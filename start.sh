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

print_status "Services are accessible at:"

# ArgoCD
print_status "ArgoCD: http://188.245.104.79:8080"

# Kong
print_status "Kong API Gateway: http://188.245.104.79:30080"
print_status "Kong Admin API: http://188.245.104.79:30081"

# Grafana
print_status "Grafana: http://188.245.104.79:30080/grafana"

# Prometheus
print_status "Prometheus: http://188.245.104.79:30080/prometheus"

# Frontend
print_status "Frontend: http://188.245.104.79:30080/"

# Auth Service
print_status "Auth Service: http://188.245.104.79:30080/auth"

# Course Service
print_status "Course Service: http://188.245.104.79:30080/courses"

# Ingestion Service
print_status "Ingestion Service: http://188.245.104.79:30080/ingestion"

print_status "All services are accessible through Kong's NodePort (30080)"
print_status "You can access the Kong Admin API at port 30081" 