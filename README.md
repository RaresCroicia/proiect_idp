# E-Learning Platform

A comprehensive e-learning platform built with microservices architecture.

## Project Structure

```
.
├── auth-service/          # Authentication service (NestJS)
├── course-service/        # Course management service (NestJS)
├── ingestion-service/     # Database communication service (NestJS)
├── frontend/             # React frontend application
├── api-gateway/          # Kong API Gateway configuration
├── docker/               # Docker Swarm configuration
├── .github/              # GitHub Actions workflows
└── setup.sh              # Setup script
```

## Services

1. **Auth Service**: Handles user authentication and authorization
   - Register, login, logout endpoints
   - JWT token generation and validation

2. **Course Service**: Manages course-related operations
   - CRUD operations for courses, lessons, quizzes
   - Course enrollment management
   - Quiz submission and grading

3. **Ingestion Service**: Database communication layer
   - Handles all database operations
   - Provides a unified interface for other services

4. **Frontend**: React application with TypeScript
   - User authentication flows
   - Course management interface
   - Quiz taking interface

5. **API Gateway**: Kong configuration
   - Routes requests to appropriate services
   - Handles authentication and rate limiting

## Prerequisites

- Docker and Docker Swarm
- PostgreSQL
- Node.js (v18+)
- Kong API Gateway

## Setup

1. Clone the repository
2. Run `./setup.sh` to initialize the environment
3. Access the application through the API Gateway

## Development

Each service can be developed independently. See individual service READMEs for specific instructions.

## Deployment

The platform is deployed using Docker Swarm. GitHub Actions workflows handle the build and deployment process.
