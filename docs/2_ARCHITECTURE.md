# Architecture Guide

## Clean Architecture

This project follows clean architecture principles with a feature-based organization:

```
Feature/
├── entities/        # Business objects
├── dtos/           # Data Transfer Objects
├── models/         # Database models
├── interfaces/     # Feature interfaces
├── repositories/   # Data access layer
├── mappers/        # Data transformers
├── validations/    # Request validation
├── services/       # Business logic
├── controllers/    # Request handlers
└── routes/         # Route definitions
```

## Layer Responsibilities

### 1. Entities (Domain Layer)
- Core business objects
- Business rules and validation
- No dependencies on other layers
```typescript
export class User {
  id!: string;
  email!: string;
  isVerified!: boolean;

  canLogin(): boolean {
    return this.isVerified;
  }
}
```

### 2. DTOs (Interface Layer)
- Request/Response data validation
- Data shape for API endpoints
```typescript
export class CreateUserDTO {
  email!: string;
  password!: string;

  validate(): void {
    if (!this.email) throw new Error('Email required');
  }
}
```

### 3. Models (Data Layer)
- Database schema definitions
- MongoDB/Mongoose models
```typescript
const UserSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
});
```

### 4. Repositories (Data Layer)
- Data access logic
- CRUD operations
- Database queries
```typescript
export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email });
    return doc ? UserMapper.toEntity(doc) : null;
  }
}
```

### 5. Mappers (Data Layer)
- Transform between layers
- Entity ↔ Model conversion
```typescript
export class UserMapper {
  static toEntity(doc: IUserDocument): User {
    return new User({
      id: doc._id.toString(),
      email: doc.email
    });
  }
}
```

### 6. Services (Business Layer)
- Business logic
- Use cases
- Orchestrate repositories
```typescript
export class UserService {
  async register(dto: CreateUserDTO): Promise<User> {
    const exists = await this.repo.exists({ email: dto.email });
    if (exists) throw new Error('Email taken');
    return this.repo.create(dto);
  }
}
```

### 7. Controllers (Interface Layer)
- Request handling
- Input validation
- Response formatting
```typescript
export class UserController {
  @validate(createUserSchema)
  async register(req: Request, res: Response) {
    const user = await this.service.register(req.body);
    return ApiResponse.success(user);
  }
}
```

## Data Flow

1. Request comes to Controller
2. Controller validates input using DTOs
3. Controller calls Service
4. Service implements business logic
5. Service uses Repository for data access
6. Repository uses Mapper to convert between Model and Entity
7. Response flows back through layers

## Multiple Entities in One Feature

Features can contain multiple related entities:

```
features/order/
├── entities/
│   ├── order.entity.ts
│   ├── order-item.entity.ts
│   └── shipping.entity.ts
├── repositories/
│   ├── order.repository.ts
│   └── order-item.repository.ts
└── services/
    └── order.service.ts     # Orchestrates both entities
```

Example service handling multiple entities:
```typescript
export class OrderService {
  async createOrder(dto: CreateOrderDTO): Promise<Order> {
    // Start transaction
    const order = await this.orderRepo.create({
      userId: dto.userId,
      total: dto.total
    });

    // Create order items
    await Promise.all(dto.items.map(item =>
      this.orderItemRepo.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity
      })
    ));

    // Create shipping info
    await this.shippingRepo.create({
      orderId: order.id,
      address: dto.shippingAddress
    });

    return order;
  }
}
```

## Error Handling

- Use custom `ApiError` class
- Centralized error handler middleware
- Consistent error responses

```typescript
throw new ApiError(400, 'Invalid input');
```

## Versioning

Routes are versioned:
```
/api/v1/users
/api/v2/users
```

Create feature with version:
```bash
npm run create-feature user v2
``` 