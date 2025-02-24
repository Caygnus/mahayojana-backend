# Mahayojana Backend Architecture

## Clean Architecture Overview

This project follows Clean Architecture principles, ensuring:
- Independence of frameworks
- Testability
- Independence of UI
- Independence of Database
- Independence of any external agency

### Core Principles
1. Inner layers don't know anything about outer layers
2. Dependencies point inward
3. Inner layers contain business logic
4. Outer layers contain implementation details

## Folder Structure

```
src/
├── core/                     # Enterprise business rules
│   ├── entities/            # Enterprise-wide business objects
│   │   ├── User.ts
│   │   ├── Role.ts
│   │   └── Permission.ts
│   └── interfaces/          # Core interfaces
│       └── repositories/
├── domain/                  # Application business rules
│   ├── interfaces/         
│   │   ├── repositories/   # Repository interfaces
│   │   └── services/       # Service interfaces
│   ├── usecases/           # Application specific business rules
│   └── dto/                # Data Transfer Objects
├── infrastructure/          # Frameworks, tools, and drivers
│   ├── database/
│   │   ├── models/         # Database models
│   │   ├── migrations/     # Database migrations
│   │   └── repositories/   # Repository implementations
│   ├── security/
│   │   ├── jwt/           # JWT implementation
│   │   └── encryption/    # Encryption utilities
│   └── external/          # External services integration
├── interfaces/             # Interface adapters
│   ├── http/
│   │   ├── controllers/   # Express controllers
│   │   ├── middlewares/   # HTTP middlewares
│   │   ├── validators/    # Request validators
│   │   └── routes/        # Route definitions
│   └── events/            # Event handlers
├── services/              # Application services
│   ├── auth/             # Authentication service
│   │   ├── controllers/
│   │   ├── services/
│   │   └── routes.ts
│   ├── user/             # User management service
│   └── admin/            # Admin service
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
├── config/              # Configuration files
└── app.ts              # Application entry point

```

## Service Organization

Each service (auth, user, admin, etc.) follows a similar structure:

```
services/
└── [service-name]/
    ├── controllers/     # Route handlers
    ├── services/        # Business logic
    ├── validators/      # Input validation
    ├── interfaces/      # Service-specific interfaces
    └── routes.ts        # Route definitions
```

## File Naming Conventions

1. **Files:**
   - Use kebab-case for file names: `user-service.ts`
   - Suffix files based on their role:
     - Controllers: `auth.controller.ts`
     - Services: `auth.service.ts`
     - Repositories: `user.repository.ts`
     - DTOs: `create-user.dto.ts`
     - Interfaces: `i-user-repository.ts`

2. **Classes:**
   - Use PascalCase for class names
   - Suffix classes based on their role:
     ```typescript
     class UserController {}
     class UserService {}
     class UserRepository {}
     ```

3. **Interfaces:**
   - Prefix with 'I' for clarity:
     ```typescript
     interface IUserRepository {}
     interface IAuthService {}
     ```

## Role-Based Access Control (RBAC)

### Roles
- Admin: Full system access
- Agent: Limited administrative access
- User: Basic platform access

### Implementation
- Store roles in `core/entities/Role.ts`
- Define permissions in `core/entities/Permission.ts`
- Implement role checks in middleware
- Use decorators for role-based route protection

## Authentication Flow

1. User registration:
   ```
   POST /api/auth/register
   → AuthController.register
   → AuthService.register
   → UserRepository.create
   ```

2. User login:
   ```
   POST /api/auth/login
   → AuthController.login
   → AuthService.validateCredentials
   → TokenService.generateToken
   ```

## Best Practices

1. **Dependency Injection:**
   - Use a DI container (e.g., TypeDI)
   - Define interfaces for all services
   - Inject dependencies through constructors

2. **Error Handling:**
   - Create custom error classes
   - Use global error middleware
   - Implement proper error logging

3. **Validation:**
   - Use DTOs for request validation
   - Implement request schema validation
   - Validate at controller level

4. **Testing:**
   - Unit tests for business logic
   - Integration tests for APIs
   - E2E tests for critical flows

## API Documentation

Use OpenAPI (Swagger) for API documentation:
- Place swagger definitions in `/docs`
- Document all endpoints
- Include request/response examples

## Environment Configuration

Use different configuration files for different environments:
- `.env.development`
- `.env.production`
- `.env.test`

## Logging

Implement structured logging:
- Use Winston or Pino
- Log different levels (DEBUG, INFO, ERROR)
- Include request correlation IDs

## Security Measures

1. **Authentication:**
   - JWT-based authentication
   - Refresh token rotation
   - Token blacklisting

2. **Authorization:**
   - Role-based access control
   - Permission-based access control
   - Resource-level permissions

3. **Data Protection:**
   - Input validation
   - Output sanitization
   - Rate limiting
   - CORS configuration

## Database Management

1. **Migrations:**
   - Version control for schema
   - Up/down migrations
   - Seed data for testing

2. **Models:**
   - Clear separation from entities
   - Validation rules
   - Proper indexing

## Scalability Considerations

1. **Caching:**
   - Redis for session storage
   - Cache frequently accessed data
   - Implement cache invalidation

2. **Queue Management:**
   - Use message queues for async tasks
   - Implement retry mechanisms
   - Handle failed jobs

3. **Monitoring:**
   - Health check endpoints
   - Performance metrics
   - Error tracking

## Development Workflow

1. **Version Control:**
   - Feature branches
   - Semantic versioning
   - Conventional commits

2. **Code Quality:**
   - ESLint configuration
   - Prettier for formatting
   - Husky for pre-commit hooks

3. **CI/CD:**
   - Automated testing
   - Build pipeline
   - Deployment stages 