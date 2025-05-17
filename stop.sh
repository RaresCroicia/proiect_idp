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

# Stop port-forwarding processes
print_status "Stopping port-forwarding processes..."
pkill -f "kubectl port-forward" || true

# Scale down deployments
print_status "Scaling down deployments..."

# Scale down monitoring stack
print_status "Scaling down monitoring stack..."
kubectl scale deployment prometheus --replicas=0 -n monitoring
kubectl scale deployment grafana --replicas=0 -n monitoring

# Scale down other services
print_status "Scaling down other services..."
kubectl scale deployment kong --replicas=0 -n default
kubectl scale deployment argocd-server --replicas=0 -n argocd

print_status "All services have been stopped!"
print_warning "To start services again, run:"
echo -e "  ${GREEN}./start.sh${NC}" 