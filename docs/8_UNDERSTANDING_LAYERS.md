# Understanding Clean Architecture: Layer by Layer

This guide explains how the different layers in our clean architecture work together and the correct usage of DTOs, entities, and mappers across these layers.

## The Three Core Layers

Our project follows a clean architecture with three primary layers:

1. **Presentation Layer** (Controllers, Routes)
2. **Domain Layer** (Entities, Services, Interfaces)
3. **Data Layer** (Repositories, Models)

Each layer has specific responsibilities and should only depend on more inner layers, never on outer ones.

## Data Flow Between Layers

The typical flow of data through our application is:

```
HTTP Request → Controller → DTO → Service → Entity → Repository → Database Model
```

And back:

```
Database Model → Repository → Entity → Service → Controller → HTTP Response
```

## Layer-by-Layer Breakdown

### 1. Presentation Layer

**Components**: Controllers, Routes, Validations, DTOs (for input/output)

**Responsibilities**:
- Handle HTTP requests and responses
- Validate input data
- Convert between DTOs and domain entities
- No business logic

**Example Flow**:
```typescript
// Controller
create = [
  validator(EntityValidation.create), // Validate input
  asyncHandler(async (req: Request, res: Response) => {
    // 1. Create DTO from request data
    const dto = new CreateEntityDTO(req.body);
    
    // 2. Pass DTO to service
    const result = await this.service.create(dto);
    
    // 3. Return HTTP response
    new SuccessResponse('Entity created successfully', result).send(res);
  })
];
```

### 2. Domain Layer

**Components**: Entities, Services, Interfaces

**Responsibilities**:
- Contain business logic and rules
- Process commands and queries
- Orchestrate the use of entities
- Independent of frameworks and UI
- No knowledge of HTTP or database details

**Example Flow**:
```typescript
// Service
async create(dto: CreateEntityDTO): Promise<Entity> {
  // 1. Validate DTO (often already done by controller)
  dto.validate();
  
  // 2. Apply business rules
  // (Could involve multiple entities and complex logic)
  
  // 3. Use repository to persist the entity
  return this.repository.create(dto);
}
```

### 3. Data Layer

**Components**: Repositories, Models, Mappers

**Responsibilities**:
- Abstract data access details
- Convert between domain entities and database models
- Handle database transactions
- No business logic

**Example Flow**:
```typescript
// Repository
async create(data: Partial<Entity>): Promise<Entity> {
  // 1. Use mapper to convert entity to model
  const modelData = EntityMapper.toModel(data);
  
  // 2. Persist to database
  const created = await EntityModel.create(modelData);
  
  // 3. Use mapper to convert model back to entity
  return EntityMapper.toEntity(created);
}
```

## Understanding Key Components

### DTOs (Data Transfer Objects)

**Purpose**: Transfer data between the presentation layer and the domain layer.

**When to use DTOs**:
- For input validation at API boundaries
- To decouple API contracts from domain models
- When the shape of data for API is different from domain entities

**Example**:
```typescript
export class CreateUserDTO {
  email!: string;
  password!: string;
  name!: string;

  constructor(data: CreateUserDTO) {
    Object.assign(this, data);
  }

  validate(): void {
    if (!this.email) throw new Error('Email is required');
    if (!this.password) throw new Error('Password is required');
    // More validation
  }
}
```

### Entities

**Purpose**: Represent core business objects and encapsulate business rules.

**When to use Entities**:
- To model your core domain concepts
- To encapsulate business rules and logic
- When you need to maintain invariants across operations

**Example**:
```typescript
export class User {
  id!: string;
  email!: string;
  passwordHash!: string;
  name!: string;
  isActive!: boolean;
  lastLoginAt?: Date;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(data: Partial<User>) {
    Object.assign(this, data);
  }

  // Business logic
  isVerified(): boolean {
    return this.isActive && this.lastLoginAt !== undefined;
  }

  canAccess(resource: string): boolean {
    // Access control logic
    return true;
  }
}
```

### Mappers

**Purpose**: Transform data between different representations.

**When to use Mappers**:
- To convert between DTOs and Entities
- To convert between Entities and Database Models
- When you need to transform data between layers

**Example**:
```typescript
export class UserMapper {
  static toEntity(doc: IUserDocument): User {
    return new User({
      id: doc._id.toString(),
      email: doc.email,
      passwordHash: doc.passwordHash,
      name: doc.name,
      isActive: doc.isActive,
      lastLoginAt: doc.lastLoginAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    });
  }

  static toModel(entity: Partial<User>): Partial<IUserDocument> {
    const model: any = { ...entity };
    if (entity.id) {
      model._id = entity.id;
      delete model.id;
    }
    return model;
  }
}
```

## Understanding the Use of Partial<T>

You'll notice `Partial<T>` used frequently in our codebase. Here's why:

1. **Flexibility**: Allows functions to accept objects with only some properties of `T`
2. **Creation vs Updates**: When creating, you might need all fields, but when updating, you might only provide a subset
3. **Optional Properties**: Makes it clear which properties are required vs optional in different contexts

**Examples**:
```typescript
// Creating a new entity with only some properties
const user = new User({ name: "John", email: "john@example.com" });

// Updating only specific fields
await userRepository.update(userId, { isActive: false });

// Filtering by certain properties
const activeUsers = await userRepository.list({ isActive: true });
```

## Best Practices

### Presentation Layer
- Keep controllers thin
- Use DTOs for input validation
- Don't leak domain logic to controllers
- Return appropriate HTTP status codes and standardized responses

### Domain Layer
- Keep business rules in entities or domain services
- Services should orchestrate, not contain business logic
- Use interfaces to define dependencies
- Domain layer should be framework-agnostic

### Data Layer
- Repositories should abstract away data access details
- Use mappers to convert between domain and database models
- Don't expose ORM-specific objects to the domain layer
- Handle database-specific concerns (transactions, etc.)

## Common Anti-Patterns to Avoid

1. **Skipping Layers**: Don't have controllers directly accessing repositories
2. **Leaky Abstractions**: Don't expose database concepts to the domain layer
3. **Anemic Domain Model**: Don't put all business logic in services
4. **Fat Controllers**: Don't put business logic in controllers
5. **Direct Domain Exposure**: Don't expose domain entities directly in API responses

## Practical Examples

### Example 1: User Registration

```typescript
// Controller Layer
@Post('/register')
async register(req: Request, res: Response) {
  const dto = new RegisterUserDTO(req.body);
  const result = await this.userService.register(dto);
  new SuccessResponse('User registered successfully', result).send(res);
}

// Service Layer
async register(dto: RegisterUserDTO): Promise<User> {
  // Business rule: check if email is already taken
  const existing = await this.userRepository.findOne({ email: dto.email });
  if (existing) {
    throw new ApiError(400, 'Email already in use');
  }
  
  // Business rule: hash password
  const passwordHash = await this.hashService.hash(dto.password);
  
  // Create user entity
  const user = new User({
    email: dto.email,
    passwordHash,
    name: dto.name,
    isActive: false // Requires verification
  });
  
  // Persist and return
  return this.userRepository.create(user);
}

// Repository Layer
async create(data: Partial<User>): Promise<User> {
  const modelData = UserMapper.toModel(data);
  const created = await UserModel.create(modelData);
  return UserMapper.toEntity(created);
}
```

### Example 2: Updating User Details

```typescript
// Controller Layer
@Put('/:id')
async update(req: Request, res: Response) {
  const id = req.params.id;
  const dto = new UpdateUserDTO(req.body);
  const result = await this.userService.update(id, dto);
  new SuccessResponse('User updated successfully', result).send(res);
}

// Service Layer
async update(id: string, dto: UpdateUserDTO): Promise<User> {
  // Get existing user
  const existingUser = await this.userRepository.findById(id);
  if (!existingUser) {
    throw new ApiError(404, 'User not found');
  }
  
  // Business rules can be applied here
  if (dto.email && dto.email !== existingUser.email) {
    // Check if new email is already taken
    const emailExists = await this.userRepository.findOne({ email: dto.email });
    if (emailExists) {
      throw new ApiError(400, 'Email already in use');
    }
  }
  
  // Update user
  return this.userRepository.update(id, dto);
}

// Repository Layer
async update(id: string, data: Partial<User>): Promise<User> {
  const modelData = UserMapper.toModel(data);
  const updated = await UserModel.findByIdAndUpdate(
    id,
    { $set: modelData },
    { new: true }
  );
  
  if (!updated) {
    throw new Error('User not found');
  }
  
  return UserMapper.toEntity(updated);
}
```

## Conclusion

Following clean architecture principles with proper separation of concerns between layers creates a maintainable, testable, and flexible codebase. Using DTOs, entities, and mappers appropriately helps enforce these boundaries and keeps each layer focused on its specific responsibilities.

Remember that the goal is not to blindly follow these patterns, but to use them to create a codebase that is:

1. **Testable**: Each layer can be tested in isolation
2. **Maintainable**: Changes in one layer don't ripple through the entire codebase
3. **Flexible**: Framework decisions can be changed without rewriting business logic
4. **Understandable**: Clear separation of concerns makes code easier to reason about

By understanding these layers and when to use each component, you'll be able to develop features that fit well within the existing architecture while maintaining clean separation of concerns. 