#!/bin/bash

# Color definitions
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status messages
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

# Function to print error messages
print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to print warning messages
print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    print_error "kubectl is not installed. Please install it first."
    exit 1
fi

# Check if we can access the cluster
if ! kubectl cluster-info &> /dev/null; then
    print_error "Cannot access the Kubernetes cluster. Please check your configuration."
    exit 1
fi

print_status "Starting port forwarding for services..."

# Start port forwarding for ArgoCD
print_status "Starting port forwarding for ArgoCD..."
kubectl port-forward svc/argocd-server -n argocd 8080:80 &
print_status "ArgoCD is accessible at: http://localhost:8080"

# Start port forwarding for Kong
print_status "Starting port forwarding for Kong..."
kubectl port-forward svc/kong -n default 30080:8000 30081:8001 &
print_status "Kong API Gateway is accessible at: http://localhost:30080"
print_status "Kong Admin API is accessible at: http://localhost:30081"

# Start port forwarding for Grafana
print_status "Starting port forwarding for Grafana..."
kubectl port-forward svc/grafana -n monitoring 3000:3000 &
print_status "Grafana is accessible at: http://localhost:3000"

# Start port forwarding for Prometheus
print_status "Starting port forwarding for Prometheus..."
kubectl port-forward svc/prometheus -n monitoring 9090:9090 &
print_status "Prometheus is accessible at: http://localhost:9090"

# Start port forwarding for Frontend
print_status "Starting port forwarding for Frontend..."
kubectl port-forward svc/frontend -n default 3000:3000 &
print_status "Frontend is accessible at: http://localhost:3000"

# Start port forwarding for Auth Service
print_status "Starting port forwarding for Auth Service..."
kubectl port-forward svc/auth-service -n default 3001:3001 &
print_status "Auth Service is accessible at: http://localhost:3001"

# Start port forwarding for Course Service
print_status "Starting port forwarding for Course Service..."
kubectl port-forward svc/course-service -n default 3002:3002 &
print_status "Course Service is accessible at: http://localhost:3002"

# Start port forwarding for Ingestion Service
print_status "Starting port forwarding for Ingestion Service..."
kubectl port-forward svc/ingestion-service -n default 3003:3003 &
print_status "Ingestion Service is accessible at: http://localhost:3003"

# Function to cleanup port forwarding processes
cleanup() {
    print_status "Cleaning up port forwarding processes..."
    pkill -f "kubectl port-forward"
    exit 0
}

# Set up trap to catch Ctrl+C and cleanup
trap cleanup SIGINT

print_status "All services are now accessible through port forwarding."
print_status "Press Ctrl+C to stop port forwarding."

# Keep the script running
while true; do
    sleep 1
done 