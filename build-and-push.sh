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

# Check if GitHub username is provided
if [ -z "$1" ]; then
    print_error "Please provide your GitHub username as an argument"
    print_error "Usage: ./build-and-push.sh <github-username>"
    exit 1
fi

GITHUB_USERNAME=$1
REGISTRY="ghcr.io/${GITHUB_USERNAME}/proiect-idp"

# Login to GitHub Container Registry
print_status "Logging in to GitHub Container Registry..."
echo "Please enter your GitHub Personal Access Token:"
read -s GITHUB_TOKEN
echo $GITHUB_TOKEN | docker login ghcr.io -u $GITHUB_USERNAME --password-stdin

if [ $? -ne 0 ]; then
    print_error "Failed to login to GitHub Container Registry"
    exit 1
fi

# Build and push auth-service
print_status "Building and pushing auth-service..."
docker build -t ${REGISTRY}/auth-service:latest ./auth-service
docker push ${REGISTRY}/auth-service:latest

# Build and push course-service
print_status "Building and pushing course-service..."
docker build -t ${REGISTRY}/course-service:latest ./course-service
docker push ${REGISTRY}/course-service:latest

# Build and push frontend
print_status "Building and pushing frontend..."
docker build -t ${REGISTRY}/frontend:latest ./frontend
docker push ${REGISTRY}/frontend:latest

# Build and push ingestion-service
print_status "Building and pushing ingestion-service..."
docker build -t ${REGISTRY}/ingestion-service:latest ./ingestion-service
docker push ${REGISTRY}/ingestion-service:latest

print_status "All images have been built and pushed successfully!"
print_warning "Please update your Kubernetes deployments to use the correct image names:"
echo -e "  - auth-service: ${GREEN}${REGISTRY}/auth-service:latest${NC}"
echo -e "  - course-service: ${GREEN}${REGISTRY}/course-service:latest${NC}"
echo -e "  - frontend: ${GREEN}${REGISTRY}/frontend:latest${NC}"
echo -e "  - ingestion-service: ${GREEN}${REGISTRY}/ingestion-service:latest${NC}" 