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

# Function to show service status
show_status() {
    print_status "Current service status:"
    docker service ls
}

# Function to show logs
show_logs() {
    local service=$1
    print_status "Showing logs for $service:"
    docker service logs elearning_$service
}

# Function to show service details
show_details() {
    local service=$1
    print_status "Showing details for $service:"
    docker service inspect elearning_$service
}

# Function to show all logs
show_all_logs() {
    print_status "Showing all service logs:"
    for service in auth-service course-service ingestion-service frontend nginx; do
        print_status "Logs for $service:"
        docker service logs elearning_$service
        echo "----------------------------------------"
    done
}

# Main menu
while true; do
    echo -e "\n${GREEN}Monitoring Menu:${NC}"
    echo "1. Show service status"
    echo "2. Show logs for specific service"
    echo "3. Show details for specific service"
    echo "4. Show all logs"
    echo "5. Exit"
    
    read -p "Enter your choice (1-5): " choice
    
    case $choice in
        1)
            show_status
            ;;
        2)
            echo "Available services: auth-service, course-service, ingestion-service, frontend, nginx"
            read -p "Enter service name: " service
            show_logs $service
            ;;
        3)
            echo "Available services: auth-service, course-service, ingestion-service, frontend, nginx"
            read -p "Enter service name: " service
            show_details $service
            ;;
        4)
            show_all_logs
            ;;
        5)
            print_status "Exiting monitoring..."
            exit 0
            ;;
        *)
            print_error "Invalid choice. Please try again."
            ;;
    esac
done 