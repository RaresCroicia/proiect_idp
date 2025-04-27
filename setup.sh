#!/bin/bash

# Exit on error
set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Starting setup process...${NC}"

# Create necessary directories
echo -e "${GREEN}Creating project structure...${NC}"
mkdir -p auth-service course-service ingestion-service frontend api-gateway docker .github/workflows

# Initialize PostgreSQL
echo -e "${GREEN}Setting up PostgreSQL...${NC}"
docker network create e-learning-network || true
docker run --name postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=elearning -p 5432:5432 --network e-learning-network -d postgres:latest

# Wait for PostgreSQL to be ready
echo -e "${GREEN}Waiting for PostgreSQL to be ready...${NC}"
sleep 10

# Initialize Kong
echo -e "${GREEN}Setting up Kong API Gateway...${NC}"
docker run -d --name kong-database \
  --network=e-learning-network \
  -p 5432:5432 \
  -e "POSTGRES_USER=kong" \
  -e "POSTGRES_DB=kong" \
  -e "POSTGRES_PASSWORD=kong" \
  postgres:13

sleep 10

docker run --rm \
  --network=e-learning-network \
  -e "KONG_DATABASE=postgres" \
  -e "KONG_PG_HOST=kong-database" \
  -e "KONG_PG_PASSWORD=kong" \
  kong:latest kong migrations bootstrap

docker run -d --name kong \
  --network=e-learning-network \
  -e "KONG_DATABASE=postgres" \
  -e "KONG_PG_HOST=kong-database" \
  -e "KONG_PG_PASSWORD=kong" \
  -e "KONG_PROXY_ACCESS_LOG=/dev/stdout" \
  -e "KONG_ADMIN_ACCESS_LOG=/dev/stdout" \
  -e "KONG_PROXY_ERROR_LOG=/dev/stderr" \
  -e "KONG_ADMIN_ERROR_LOG=/dev/stderr" \
  -e "KONG_ADMIN_LISTEN=0.0.0.0:8001, 0.0.0.0:8444 ssl" \
  -p 8000:8000 \
  -p 8443:8443 \
  -p 8001:8001 \
  -p 8444:8444 \
  kong:latest

# Initialize Docker Swarm
echo -e "${GREEN}Initializing Docker Swarm...${NC}"
docker swarm init || true

# Build and deploy services
echo -e "${GREEN}Building and deploying services...${NC}"
docker-compose -f docker/docker-compose.yml build
docker stack deploy -c docker/docker-compose.yml e-learning

echo -e "${GREEN}Setup completed successfully!${NC}"
echo -e "${BLUE}Services are now running:${NC}"
echo -e "- API Gateway: http://localhost:8000"
echo -e "- Auth Service: http://localhost:8000/auth"
echo -e "- Course Service: http://localhost:8000/courses"
echo -e "- Frontend: http://localhost:3000" 