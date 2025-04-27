#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print status messages
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if stack exists
if ! docker stack ls | grep -q "elearning"; then
    print_warning "Stack 'elearning' is not running."
    exit 0
fi

# Stop the stack
print_status "Stopping stack..."
docker stack rm elearning

# Wait for services to stop
print_status "Waiting for services to stop..."
sleep 10

# Check if all services are stopped
if docker service ls | grep -q "elearning"; then
    print_warning "Some services are still running. Force removing..."
    docker service rm $(docker service ls -q --filter name=elearning)
fi

print_status "All services have been stopped." 