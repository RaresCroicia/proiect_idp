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

# Start port-forwarding for all services
print_status "Starting port-forwarding for services..."

# ArgoCD
kubectl port-forward svc/argocd-server -n argocd 8080:8080 &
ARGOCD_PID=$!

# Kong
kubectl port-forward svc/kong -n default 8000:8000 &
KONG_PID=$!

# Grafana
kubectl port-forward svc/grafana -n monitoring 3000:3000 &
GRAFANA_PID=$!

# Prometheus
kubectl port-forward svc/prometheus -n monitoring 9090:9090 &
PROMETHEUS_PID=$!

# Frontend
kubectl port-forward svc/frontend -n default 3000:3000 &
FRONTEND_PID=$!

# Auth Service
kubectl port-forward svc/auth-service -n default 3001:3001 &
AUTH_PID=$!

# Course Service
kubectl port-forward svc/course-service -n default 3002:3002 &
COURSE_PID=$!

# Ingestion Service
kubectl port-forward svc/ingestion-service -n default 3003:3003 &
INGESTION_PID=$!

# Wait for port-forwards to be ready
sleep 5

print_status "All services are now accessible at:"
echo -e "  - ArgoCD UI: ${GREEN}http://localhost:8080${NC}"
echo -e "  - Kong API Gateway: ${GREEN}http://localhost:8000${NC}"
echo -e "  - Grafana: ${GREEN}http://localhost:3000${NC}"
echo -e "  - Prometheus: ${GREEN}http://localhost:9090${NC}"
echo -e "  - Frontend: ${GREEN}http://localhost:3000${NC}"
echo -e "  - Auth Service: ${GREEN}http://localhost:3001${NC}"
echo -e "  - Course Service: ${GREEN}http://localhost:3002${NC}"
echo -e "  - Ingestion Service: ${GREEN}http://localhost:3003${NC}"
echo -e "  - Public Domain: ${GREEN}http://static.79.104.245.188.clients.your-server.de${NC}"

# Function to handle script termination
cleanup() {
    print_status "Cleaning up..."
    if [ ! -z "$ARGOCD_PID" ]; then
        kill $ARGOCD_PID 2>/dev/null
    fi
    if [ ! -z "$KONG_PID" ]; then
        kill $KONG_PID 2>/dev/null
    fi
    if [ ! -z "$GRAFANA_PID" ]; then
        kill $GRAFANA_PID 2>/dev/null
    fi
    if [ ! -z "$PROMETHEUS_PID" ]; then
        kill $PROMETHEUS_PID 2>/dev/null
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
    fi
    if [ ! -z "$AUTH_PID" ]; then
        kill $AUTH_PID 2>/dev/null
    fi
    if [ ! -z "$COURSE_PID" ]; then
        kill $COURSE_PID 2>/dev/null
    fi
    if [ ! -z "$INGESTION_PID" ]; then
        kill $INGESTION_PID 2>/dev/null
    fi
    exit 0
}

# Set up trap for cleanup
trap cleanup SIGINT SIGTERM

print_warning "Press Ctrl+C to stop all port-forwarding and exit"
wait 