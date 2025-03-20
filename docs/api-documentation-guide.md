# API Documentation Guide

This guide explains how to document your API routes using TSOA decorators while maintaining the existing Express routing logic.

## Basic Structure

We use TSOA decorators to document our API without affecting the actual route implementation. Here's how to do it:

### 1. Create a Controller File

For each feature, create a controller file (e.g., `UserController.ts`) alongside your route file. This controller is only for documentation purposes.

```typescript
// src/features/users/UserController.ts
import { Route, Get, Post, Body, Path, Query, Tags, Security, Response } from 'tsoa';

@Route('users')
@Tags('Users')
export class UserController {
    /**
     * Get user by ID
     * @param userId The unique identifier of the user
     */
    @Get('{userId}')
    @Security('jwt')
    @Response(200, 'Success')
    @Response(404, 'User not found')
    public async getUser(
        @Path() userId: string
    ): Promise<UserResponse> {
        // This is just for documentation
        // The actual implementation is in your route file
        return {} as any;
    }
}
```

### 2. Define DTOs (Data Transfer Objects)

Create interfaces for your request and response types:

```typescript
// src/features/users/types.ts
export interface UserResponse {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
}

export interface CreateUserRequest {
    name: string;
    email: string;
    password: string;
}
```

## Available Decorators

### Route Decorators
- `@Route('path')` - Base path for all endpoints in the controller
- `@Tags('category')` - Group endpoints under a category
- `@Security('jwt')` - Specify authentication requirement

### HTTP Method Decorators
- `@Get()` - GET endpoint
- `@Post()` - POST endpoint
- `@Put()` - PUT endpoint
- `@Delete()` - DELETE endpoint
- `@Patch()` - PATCH endpoint

### Parameter Decorators
- `@Path()` - URL path parameters
- `@Query()` - Query string parameters
- `@Body()` - Request body
- `@Header()` - Request headers
- `@FormField()` - Form fields

### Response Decorators
- `@Response<ErrorType>(code, description)` - Document response types
- `@Example<Type>({ example object })` - Provide example responses

## Examples

### 1. Basic GET Endpoint
```typescript
/**
 * Retrieve a list of users
 * @param page Current page number
 * @param limit Items per page
 */
@Get()
@Response<UserResponse[]>(200, 'Success')
public async getUsers(
    @Query() page?: number,
    @Query() limit?: number
): Promise<UserResponse[]> {
    return [] as any;
}
```

### 2. POST with Request Body
```typescript
/**
 * Create a new user
 * @param requestBody User creation data
 */
@Post()
@Response<UserResponse>(201, 'User created')
@Response<ValidationError>(400, 'Validation failed')
public async createUser(
    @Body() requestBody: CreateUserRequest
): Promise<UserResponse> {
    return {} as any;
}
```

### 3. Protected Endpoint with Path Parameter
```typescript
/**
 * Update user profile
 * @param userId User identifier
 * @param requestBody Updated user data
 */
@Put('{userId}')
@Security('jwt')
@Response<UserResponse>(200, 'User updated')
@Response<NotFoundError>(404, 'User not found')
public async updateUser(
    @Path() userId: string,
    @Body() requestBody: UpdateUserRequest
): Promise<UserResponse> {
    return {} as any;
}
```

### 4. Complex Response Types
```typescript
/**
 * Get user statistics
 * @param userId User identifier
 * @param startDate Start date for statistics
 * @param endDate End date for statistics
 */
@Get('{userId}/stats')
@Security('jwt')
@Response<UserStats>(200, 'Success', {
    examples: {
        success: {
            value: {
                totalOrders: 42,
                averageOrderValue: 99.99,
                lastOrderDate: '2024-03-20'
            }
        }
    }
})
public async getUserStats(
    @Path() userId: string,
    @Query() startDate: string,
    @Query() endDate: string
): Promise<UserStats> {
    return {} as any;
}
```

## Best Practices

1. **Consistent Naming**
   - Use consistent naming for similar endpoints across different controllers
   - Follow REST conventions (GET for retrieval, POST for creation, etc.)

2. **Detailed Descriptions**
   - Write clear JSDoc comments for each endpoint
   - Include parameter descriptions
   - Document all possible response types

3. **Examples**
   - Provide realistic examples for complex request/response bodies
   - Include both success and error scenarios

4. **Type Safety**
   - Define and use TypeScript interfaces for all request/response types
   - Keep types in separate files for better organization

5. **Error Handling**
   - Document all possible error responses
   - Include error codes and descriptions

## Generating Documentation

Run the following command to generate OpenAPI specification:
```bash
npm run generate-docs
```

This will:
1. Generate OpenAPI spec in `src/swagger/swagger.json`
2. Make documentation available at:
   - `/api-docs` - Swagger UI
   - `/redoc` - Redoc UI
   - `/openapi.json` - Raw OpenAPI specification

## Note
Remember that the controller files are for documentation purposes only. Your actual route implementation remains in the route files, maintaining separation between documentation and implementation. 