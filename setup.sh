#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status messages
print_status() {
    echo -e "${GREEN}[+] $1${NC}"
}

print_error() {
    echo -e "${RED}[!] $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}[*] $1${NC}"
}

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    print_error "kubectl is not installed. Please install it first."
    exit 1
fi

# Check if the cluster is accessible
print_status "Checking cluster connection..."
if ! kubectl cluster-info &> /dev/null; then
    print_error "Cannot connect to the cluster. Please check your kubeconfig."
    exit 1
fi

# Create namespaces
print_status "Creating namespaces..."
kubectl create namespace argocd --dry-run=client -o yaml | kubectl apply -f -
kubectl create namespace monitoring --dry-run=client -o yaml | kubectl apply -f -

# Install ArgoCD
print_status "Installing ArgoCD..."
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Wait for ArgoCD to be ready
print_status "Waiting for ArgoCD to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/argocd-server -n argocd

# Get ArgoCD admin password
print_status "Getting ArgoCD admin password..."
ARGOCD_PASSWORD=$(kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d)
print_warning "ArgoCD admin password: $ARGOCD_PASSWORD"
print_warning "Please save this password securely!"

# Apply all Kubernetes configurations
print_status "Applying Kubernetes configurations..."

# Apply monitoring stack first
print_status "Setting up monitoring stack..."
# Apply ConfigMaps first
kubectl apply -f k8s/monitoring/grafana-dashboards.yaml
kubectl apply -f k8s/monitoring/prometheus-config.yaml

# Then apply deployments
kubectl apply -f k8s/monitoring/prometheus-deployment.yaml
kubectl apply -f k8s/monitoring/grafana-deployment.yaml

# Wait for monitoring to be ready
print_status "Waiting for monitoring stack to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/prometheus -n monitoring || {
    print_error "Prometheus deployment failed to become ready"
    kubectl get pods -n monitoring
    kubectl describe deployment prometheus -n monitoring
    exit 1
}

kubectl wait --for=condition=available --timeout=300s deployment/grafana -n monitoring || {
    print_error "Grafana deployment failed to become ready"
    kubectl get pods -n monitoring
    kubectl describe deployment grafana -n monitoring
    exit 1
}

# Apply Kong dependencies first
print_status "Setting up Kong dependencies..."
kubectl apply -f k8s/kong/configmap.yaml
kubectl apply -f k8s/kong/config-file.yaml
kubectl apply -f k8s/kong/secrets.yaml

# Apply Kong deployment and service
print_status "Setting up Kong..."
kubectl apply -f k8s/kong/deployment.yaml
kubectl apply -f k8s/kong/service.yaml

# Wait for Kong deployment
print_status "Waiting for Kong deployment..."
if ! kubectl get deployment kong &> /dev/null; then
    print_error "Kong deployment not found. Checking Kong configuration..."
    kubectl get pods
    kubectl get deployments
    kubectl get configmaps
    kubectl get secrets
    exit 1
fi

kubectl wait --for=condition=available --timeout=300s deployment/kong || {
    print_error "Kong deployment failed to become ready"
    kubectl get pods
    kubectl describe deployment kong
    exit 1
}

# Apply remaining services
print_status "Setting up remaining services..."
kubectl apply -f k8s/

# Make scripts executable
print_status "Making scripts executable..."
chmod +x start.sh

print_status "Setup completed successfully!"
print_warning "You can now start all services using:"
echo -e "  ${GREEN}./start.sh${NC}"

print_warning "Services will be available at:"
echo -e "  - ArgoCD UI: ${GREEN}http://localhost:8080${NC}"
echo -e "  - Kong API Gateway: ${GREEN}http://localhost:8000${NC}"
echo -e "  - Grafana: ${GREEN}http://localhost:3000${NC}"
echo -e "  - Prometheus: ${GREEN}http://localhost:9090${NC}"
echo -e "  - Public Domain: ${GREEN}http://static.79.104.245.188.clients.your-server.de${NC}"

# Function to handle script termination
cleanup() {
    print_status "Cleaning up..."
    exit 0
}

# Set up trap for cleanup
trap cleanup SIGINT SIGTERM

print_warning "Press Ctrl+C to stop and exit"
wait 