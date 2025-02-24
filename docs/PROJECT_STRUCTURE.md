# Node.js Backend Architecture TypeScript Project Guide

## Project Overview
This is a production-ready backend architecture written in TypeScript that follows best practices and design patterns for building scalable Node.js applications.

## Project Structure
```
├── src/
│   ├── auth/           # Authentication related code
│   ├── cache/          # Caching implementation
│   ├── core/           # Core functionality, error handling
│   ├── database/       # Database configurations and connections
│   ├── helpers/        # Helper utilities and functions
│   ├── routes/         # API routes definitions
│   ├── types/          # TypeScript type definitions
│   ├── app.ts          # Express app configuration
│   ├── config.ts       # Application configuration
│   └── server.ts       # Server entry point
├── tests/              # Test files
├── addons/             # Additional utilities and scripts
├── keys/               # API keys and certificates
├── .templates/         # Template files for code generation
└── docs/              # Project documentation
```

## Code Organization and Conventions

### 1. Directory Structure Conventions

- **auth/**: Contains authentication middleware, strategies, and related utilities
- **cache/**: Redis or other caching implementations
- **core/**: Essential components like error handling, logging, and base classes
- **database/**: Database models, repositories, and configurations
- **helpers/**: Utility functions and shared helpers
- **routes/**: API endpoint definitions and route handlers
- **types/**: TypeScript interfaces, types, and enums

### 2. File Naming Conventions

- Use `.ts` extension for TypeScript files
- Use PascalCase for class files (e.g., `UserController.ts`)
- Use camelCase for other files (e.g., `authMiddleware.ts`)
- Test files should end with `.test.ts`
- Interface files should start with 'I' (e.g., `IUser.ts`)

### 3. Code Style Guidelines

- Follow ESLint and Prettier configurations
- Use async/await for asynchronous operations
- Implement proper error handling using the custom ApiError classes
- Use dependency injection where applicable
- Write comprehensive unit tests
- Document complex functions and components

## Onboarding Process

### 1. Initial Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and configure environment variables
3. Install dependencies: `npm install`
4. Setup the database (MongoDB)
5. Start the development server: `npm run dev`

### 2. Understanding the Codebase

1. Start with `src/app.ts` and `src/server.ts`
2. Review the authentication implementation in `auth/`
3. Understand the error handling in `core/ApiError.ts`
4. Study the route organization in `routes/`
5. Review test examples in `tests/`

### 3. Development Workflow

#### Creating a New API Feature

1. **Planning Phase**
   - Define the API endpoint and requirements
   - Design the data model
   - Plan the necessary middleware

2. **Implementation Phase**
   a. Create the Model
   ```typescript
   // src/database/models/YourModel.ts
   import { Schema, model } from 'mongoose';
   ```

   b. Create the Repository
   ```typescript
   // src/database/repository/YourRepository.ts
   import { YourModel } from '../models';
   ```

   c. Create the Controller
   ```typescript
   // src/routes/YourController.ts
   import { Router } from 'express';
   ```

   d. Add Routes
   ```typescript
   // src/routes/yourRoute.ts
   import express from 'express';
   ```

   e. Register in Main Router
   ```typescript
   // src/routes/index.ts
   import yourRoute from './yourRoute';
   ```

3. **Testing Phase**
   - Write unit tests
   - Write integration tests
   - Perform manual testing

4. **Documentation Phase**
   - Update API documentation
   - Add JSDoc comments
   - Update README if necessary

### 4. Best Practices

1. **Error Handling**
   - Use the custom ApiError classes
   - Implement proper try-catch blocks
   - Log errors appropriately

2. **Authentication**
   - Use middleware for protected routes
   - Implement proper token validation
   - Follow security best practices

3. **Database Operations**
   - Use repositories for database operations
   - Implement proper data validation
   - Handle database errors gracefully

4. **API Design**
   - Follow RESTful conventions
   - Use proper HTTP methods and status codes
   - Implement proper request validation
   - Use query parameters for filtering/pagination

## Common Tasks

### Adding a New API Endpoint

1. Create necessary interfaces in `types/`
2. Add model in `database/models/`
3. Create repository in `database/repository/`
4. Add controller in `routes/`
5. Add validation schemas if required
6. Add tests in `tests/`
7. Update API documentation

### Implementing Authentication

1. Use existing auth middleware
2. Add role-based access control if needed
3. Implement token validation
4. Add authentication tests

### Adding New Dependencies

1. Install using npm
2. Update package.json
3. Add types for TypeScript
4. Update documentation

## Deployment

1. Build the project: `npm run build`
2. Use Docker: `docker-compose up`
3. Configure environment variables
4. Setup monitoring and logging

## Troubleshooting

1. Check logs using the Logger utility
2. Verify environment variables
3. Check database connectivity
4. Review error stack traces

## Additional Resources

- TypeScript Documentation
- Express.js Best Practices
- MongoDB Documentation
- Jest Testing Framework
- Docker Documentation 