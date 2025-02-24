# Best Practices Guide

## Code Organization

### 1. Feature Structure
- Keep related code together in feature directories
- Use clear, consistent naming conventions
- Follow single responsibility principle

### 2. File Naming
```
entities/user.entity.ts
dtos/create-user.dto.ts
models/user.model.ts
services/user.service.ts
```

### 3. Code Style
- Use TypeScript strictly
- Enable all strict type checks
- Use interfaces for contracts
- Use enums for constants

## Business Logic

### 1. Entity Layer
- Domain logic only
- No dependencies on other layers
- Business rules and validation
```typescript
export class User {
  private static readonly MIN_PASSWORD_LENGTH = 6;

  validatePassword(password: string): boolean {
    return password.length >= User.MIN_PASSWORD_LENGTH;
  }

  canPerformAction(action: string): boolean {
    return this.permissions.includes(action);
  }
}
```

### 2. Service Layer
- Application logic
- Orchestration of repositories
- Transaction management
```typescript
export class OrderService {
  async placeOrder(dto: CreateOrderDTO): Promise<Order> {
    // Validate business rules
    await this.validateOrder(dto);

    // Start transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const order = await this.createOrder(dto, session);
      await this.processPayment(order, session);
      await session.commitTransaction();
      return order;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    }
  }
}
```

### 3. Repository Layer
- Data access only
- No business logic
- Use query builders
```typescript
export class UserRepository {
  async findByFilters(filters: UserFilters): Promise<User[]> {
    const query = UserModel.find();

    if (filters.role) {
      query.where('role').equals(filters.role);
    }

    if (filters.isActive !== undefined) {
      query.where('isActive').equals(filters.isActive);
    }

    if (filters.createdAfter) {
      query.where('createdAt').gte(filters.createdAfter);
    }

    return (await query.exec()).map(doc => UserMapper.toEntity(doc));
  }
}
```

## Error Handling

### 1. Custom Errors
```typescript
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational = true
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}
```

### 2. Error Types
```typescript
export class ValidationError extends ApiError {
  constructor(message: string) {
    super(400, message);
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string) {
    super(404, `${resource} not found`);
  }
}
```

### 3. Error Handling
```typescript
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode)
      .json(ApiResponse.error(err.message));
  }

  logger.error(err);
  return res.status(500)
    .json(ApiResponse.error('Internal server error'));
};
```

## Validation

### 1. Request Validation
```typescript
export class UserValidation {
  static create = Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Invalid email format',
        'any.required': 'Email is required'
      }),
    password: Joi.string()
      .min(6)
      .required()
      .messages({
        'string.min': 'Password must be at least 6 characters'
      })
  });
}
```

### 2. Business Validation
```typescript
export class OrderService {
  private async validateOrder(dto: CreateOrderDTO): Promise<void> {
    // Validate products exist
    await this.validateProducts(dto.items);

    // Validate stock availability
    await this.validateStock(dto.items);

    // Validate user can place order
    await this.validateUserCanOrder(dto.userId);

    // Validate total amount
    await this.validateOrderAmount(dto);
  }
}
```

## Testing

### 1. Unit Tests
```typescript
describe('User Entity', () => {
  describe('validatePassword', () => {
    it('should return true for valid password', () => {
      const user = new User();
      expect(user.validatePassword('validpass')).toBe(true);
    });

    it('should return false for short password', () => {
      const user = new User();
      expect(user.validatePassword('short')).toBe(false);
    });
  });
});
```

### 2. Integration Tests
```typescript
describe('UserService', () => {
  it('should create user with hashed password', async () => {
    const dto = { email: 'test@test.com', password: 'secret' };
    const user = await userService.create(dto);
    
    expect(user.email).toBe(dto.email);
    expect(bcrypt.compareSync(dto.password, user.password)).toBe(true);
  });
});
```

### 3. API Tests
```typescript
describe('POST /api/v1/users', () => {
  it('should return 400 for invalid email', async () => {
    const res = await request(app)
      .post('/api/v1/users')
      .send({
        email: 'invalid-email',
        password: 'secret123'
      });
    
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid email format');
  });
});
```

## Security

### 1. Input Validation
- Validate all inputs
- Use Joi schemas
- Sanitize data

### 2. Authentication
- Use JWT tokens
- Implement refresh tokens
- Secure password storage

### 3. Authorization
- Role-based access control
- Resource-level permissions
- Validate in middleware

## Performance

### 1. Database
- Use proper indexes
- Implement pagination
- Optimize queries

### 2. Caching
- Cache frequently accessed data
- Use Redis for distributed caching
- Implement cache invalidation

### 3. Async Operations
- Use Promise.all for parallel operations
- Implement job queues for heavy tasks
- Handle timeouts properly 