# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Frontend Service
- Initial setup of React + TypeScript + Vite project
- Added Material-UI for UI components
- Implemented basic routing with React Router
- Created authentication pages (Login, Register)
- Added course listing and detail pages
- Implemented API service for backend communication
- Added environment configuration for service URLs
- Set up Dockerfile for containerization

### Course Service
- Initial setup of NestJS + TypeScript project
- Implemented TypeORM with PostgreSQL
- Created Course entity and repository
- Added Lesson entity with relationship to Course
- Implemented Quiz and QuizQuestion entities
- Added UserCourse entity for course enrollment
- Created course controller with CRUD endpoints
- Implemented course service with business logic
- Added Dockerfile for containerization

### Auth Service
- Initial setup of NestJS + TypeScript project
- Implemented TypeORM with PostgreSQL
- Created User entity and repository
- Added JWT authentication
- Implemented registration and login endpoints
- Created auth controller and service
- Added password hashing with bcrypt
- Implemented user validation
- Added Dockerfile for containerization

### Nginx Service
- Initial setup of Nginx reverse proxy
- Configured routing for frontend service
- Added routing for auth service
- Configured routing for course service
- Implemented CORS headers
- Added proper request forwarding
- Configured proxy headers

### Docker Configuration
- Created docker-compose.yml
- Added PostgreSQL service
- Configured service networking
- Set up volume for database persistence
- Added environment variables
- Configured service dependencies
- Added build contexts for each service

### Docker Swarm
- Initialized Docker Swarm cluster
- Deployed services using stack deployment
- Configured service scaling
- Set up service discovery
- Implemented load balancing
- Added service health monitoring
- Configured service updates and rollbacks

## [0.1.0] - 2024-04-27
### Initial Release
- Basic frontend with authentication
- Course management system
- User authentication system
- Nginx reverse proxy
- Docker containerization
- PostgreSQL database
- Docker Swarm orchestration 