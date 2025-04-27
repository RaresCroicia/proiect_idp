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

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Initialize Docker Swarm if not already initialized
if ! docker info | grep -q "Swarm: active"; then
    print_status "Initializing Docker Swarm..."
    docker swarm init
else
    print_status "Docker Swarm is already initialized."
fi

# Build the services
print_status "Building services..."
docker-compose build

# Deploy the stack
print_status "Deploying stack..."
docker stack deploy -c docker-compose.yml elearning

# Wait for services to start
print_status "Waiting for services to start..."
sleep 10

# Check service status
print_status "Checking service status..."
docker service ls

# Print testing instructions
echo -e "\n${GREEN}Deployment completed!${NC}"
echo -e "\n${YELLOW}Testing Instructions:${NC}"
echo "1. Frontend: Open http://localhost in your browser"
echo "2. Auth Service:"
echo "   Register: curl -X POST http://localhost/auth/register -H \"Content-Type: application/json\" -d '{\"username\":\"testuser\",\"email\":\"test@example.com\",\"password\":\"password123\"}'"
echo "   Login: curl -X POST http://localhost/auth/login -H \"Content-Type: application/json\" -d '{\"email\":\"test@example.com\",\"password\":\"password123\"}'"
echo "3. Course Service:"
echo "   Get courses: curl http://localhost/courses"
echo "4. Ingestion Service:"
echo "   Upload content: curl -X POST http://localhost/ingestion/upload -H \"Authorization: Bearer YOUR_JWT_TOKEN\" -F \"file=@course_content.zip\""

# Print monitoring commands
echo -e "\n${YELLOW}Monitoring Commands:${NC}"
echo "1. View service logs:"
echo "   docker service logs elearning_auth-service"
echo "   docker service logs elearning_course-service"
echo "   docker service logs elearning_ingestion-service"
echo "   docker service logs elearning_frontend"
echo "   docker service logs elearning_nginx"
echo "2. View service details:"
echo "   docker service inspect elearning_auth-service"
echo "3. Scale services:"
echo "   docker service scale elearning_auth-service=2"
echo "4. Remove stack:"
echo "   docker stack rm elearning"

# Run in background
print_status "Running services in background..."
nohup ./deploy.sh > deployment.log 2>&1 &
print_status "Deployment log file: deployment.log" 