# Feature Development Guide

## Creating a New Feature

1. Generate feature structure:
   ```bash
   npm run create-feature user v1
   ```

2. Define entity in `entities/user.entity.ts`:
   ```typescript
   export class User {
     id!: string;
     email!: string;
     password!: string;
     isActive!: boolean;
     createdAt!: Date;
     updatedAt!: Date;

     constructor(data: Partial<User>) {
       Object.assign(this, data);
     }

     canLogin(): boolean {
       return this.isActive;
     }
   }
   ```

3. Create DTOs in `dtos/`:
   ```typescript
   export class CreateUserDTO implements Partial<User> {
     email!: string;
     password!: string;

     validate(): void {
       if (!this.email) throw new Error('Email required');
       if (!this.password) throw new Error('Password required');
     }
   }
   ```

4. Define model in `models/user.model.ts`:
   ```typescript
   const UserSchema = new Schema({
     email: { type: String, required: true, unique: true },
     password: { type: String, required: true },
     isActive: { type: Boolean, default: true }
   }, { timestamps: true });
   ```

5. Implement validation in `validations/user.validation.ts`:
   ```typescript
   export class UserValidation {
     static create = Joi.object({
       email: Joi.string().email().required(),
       password: Joi.string().min(6).required()
     });
   }
   ```

## Adding Business Logic

### 1. In Entity (Domain Logic)
```typescript
export class User {
  isPasswordValid(password: string): boolean {
    return bcrypt.compareSync(password, this.password);
  }

  canAccessResource(resourceId: string): boolean {
    return this.permissions.includes(resourceId);
  }
}
```

### 2. In Service (Application Logic)
```typescript
export class UserService {
  async register(dto: CreateUserDTO): Promise<User> {
    // Validate unique email
    const exists = await this.repo.exists({ email: dto.email });
    if (exists) {
      throw new ApiError(400, 'Email already taken');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create user
    const user = await this.repo.create({
      ...dto,
      password: hashedPassword
    });

    // Send welcome email
    await this.emailService.sendWelcomeEmail(user.email);

    return user;
  }
}
```

### 3. In Repository (Data Access Logic)
```typescript
export class UserRepository {
  async findActiveUsers(): Promise<User[]> {
    const docs = await UserModel
      .find({ isActive: true })
      .sort({ createdAt: -1 });
    return UserMapper.toEntities(docs);
  }

  async updateLastLogin(userId: string): Promise<void> {
    await UserModel.updateOne(
      { _id: userId },
      { $set: { lastLoginAt: new Date() }}
    );
  }
}
```

## Multiple Entities Example

### 1. Define Related Entities
```typescript
// order.entity.ts
export class Order {
  id!: string;
  userId!: string;
  items!: OrderItem[];
  total!: number;
  status!: OrderStatus;
}

// order-item.entity.ts
export class OrderItem {
  id!: string;
  orderId!: string;
  productId!: string;
  quantity!: number;
  price!: number;
}
```

### 2. Create Repositories
```typescript
// order.repository.ts
export class OrderRepository {
  async findWithItems(orderId: string): Promise<Order | null> {
    const orderDoc = await OrderModel
      .findById(orderId)
      .populate('items');
    return orderDoc ? OrderMapper.toEntity(orderDoc) : null;
  }
}

// order-item.repository.ts
export class OrderItemRepository {
  async findByOrderId(orderId: string): Promise<OrderItem[]> {
    const docs = await OrderItemModel.find({ orderId });
    return OrderItemMapper.toEntities(docs);
  }
}
```

### 3. Implement Service Logic
```typescript
export class OrderService {
  constructor(
    private orderRepo: OrderRepository,
    private itemRepo: OrderItemRepository,
    private productService: ProductService
  ) {}

  async createOrder(dto: CreateOrderDTO): Promise<Order> {
    // Validate products exist
    await Promise.all(dto.items.map(item =>
      this.productService.validateProduct(item.productId)
    ));

    // Calculate total
    const total = await this.calculateTotal(dto.items);

    // Create order
    const order = await this.orderRepo.create({
      userId: dto.userId,
      total,
      status: OrderStatus.PENDING
    });

    // Create items
    await Promise.all(dto.items.map(item =>
      this.itemRepo.create({
        orderId: order.id,
        ...item
      })
    ));

    return this.orderRepo.findWithItems(order.id);
  }

  private async calculateTotal(items: OrderItemDTO[]): Promise<number> {
    const prices = await Promise.all(items.map(item =>
      this.productService.getPrice(item.productId)
    ));
    
    return items.reduce((total, item, index) =>
      total + (prices[index] * item.quantity), 0);
  }
}
```

## Testing Features

1. Unit Tests (Business Logic)
```typescript
describe('User Entity', () => {
  it('should validate password correctly', () => {
    const user = new User({
      password: bcrypt.hashSync('secret', 10)
    });
    expect(user.isPasswordValid('secret')).toBe(true);
  });
});
```

2. Integration Tests (API Endpoints)
```typescript
describe('POST /api/v1/users', () => {
  it('should create user', async () => {
    const res = await request(app)
      .post('/api/v1/users')
      .send({
        email: 'test@example.com',
        password: 'secret123'
      });
    
    expect(res.status).toBe(201);
    expect(res.body.data.email).toBe('test@example.com');
  });
});
```

## Cleanup

To remove a feature:
```bash
npm run cleanup-feature user
```

This will:
1. Remove feature directory
2. Remove route registrations
3. Clean up imports 