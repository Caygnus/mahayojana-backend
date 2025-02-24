# Request Flow Guide

## Complete Request Flow Example

Let's follow a complete request flow for creating a user:

```
POST /api/v1/users
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "secret123",
  "role": "user"
}
```

### 1. Route Handler (`src/routes/v1/index.ts`)
```typescript
import express from 'express';
import userRoutes from '../../features/user/routes/user.routes';

const router = express.Router();
router.use('/users', userRoutes);
export default router;
```

### 2. Feature Routes (`src/features/user/routes/user.routes.ts`)
```typescript
import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const router = Router();
const controller = new UserController();

router.post('/', controller.create);
export default router;
```

### 3. Controller (`src/features/user/controllers/user.controller.ts`)
```typescript
export class UserController {
  private service: UserService;

  constructor() {
    this.service = new UserService();
  }

  create = [
    // Validate request headers
    validator(UserValidation.auth, ValidationSource.HEADER),
    
    // Validate request body
    validator(UserValidation.create),
    
    // Handle request
    asyncHandler(async (req: Request, res: Response) => {
      // Create DTO from request body
      const dto = new CreateUserDTO(req.body);
      
      // Call service
      const user = await this.service.create(dto);
      
      // Return response
      res.status(201).json(ApiResponse.success(user));
    })
  ];
}
```

### 4. Validation (`src/features/user/validations/user.validation.ts`)
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
      }),
    role: Joi.string()
      .valid('user', 'admin')
      .required()
  });

  static auth = Joi.object({
    authorization: JoiAuthBearer().required()
  });
}
```

### 5. DTO (`src/features/user/dtos/create-user.dto.ts`)
```typescript
export class CreateUserDTO implements Partial<User> {
  email!: string;
  password!: string;
  role!: string;

  constructor(data: Partial<CreateUserDTO>) {
    Object.assign(this, data);
  }

  validate(): void {
    if (!this.email) throw new Error('Email is required');
    if (!this.password) throw new Error('Password is required');
    if (!this.role) throw new Error('Role is required');
  }
}
```

### 6. Service (`src/features/user/services/user.service.ts`)
```typescript
export class UserService {
  private repository: IUserRepository;
  private emailService: EmailService;

  constructor() {
    this.repository = new UserRepository();
    this.emailService = new EmailService();
  }

  async create(dto: CreateUserDTO): Promise<User> {
    // Validate DTO
    dto.validate();

    // Check if email exists
    const exists = await this.repository.exists({ email: dto.email });
    if (exists) {
      throw new ApiError(400, 'Email already taken');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create user
    const user = await this.repository.create({
      ...dto,
      password: hashedPassword
    });

    // Send welcome email
    await this.emailService.sendWelcomeEmail(user.email);

    return user;
  }
}
```

### 7. Repository (`src/features/user/repositories/user.repository.ts`)
```typescript
export class UserRepository implements IUserRepository {
  async create(data: Partial<User>): Promise<User> {
    // Convert entity to model
    const modelData = UserMapper.toModel(data);
    
    // Create in database
    const created = await UserModel.create(modelData);
    
    // Convert back to entity
    return UserMapper.toEntity(created);
  }

  async exists(filter: Partial<User>): Promise<boolean> {
    const modelFilter = UserMapper.toModel(filter) as FilterQuery<IUserDocument>;
    return UserModel.exists(modelFilter);
  }
}
```

### 8. Model (`src/features/user/models/user.model.ts`)
```typescript
export interface IUserDocument extends Omit<User, 'toJSON' | 'toObject' | 'id'>, Document {
  _id: mongoose.Types.ObjectId;
}

const UserSchema = new Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    required: true,
    enum: ['user', 'admin']
  }
}, {
  timestamps: true,
  toJSON: {
    transform: (_, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);
```

### 9. Entity (`src/features/user/entities/user.entity.ts`)
```typescript
export class User {
  id!: string;
  email!: string;
  password!: string;
  role!: string;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(data: Partial<User>) {
    Object.assign(this, data);
  }

  isAdmin(): boolean {
    return this.role === 'admin';
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      role: this.role,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
```

### 10. Mapper (`src/features/user/mappers/user.mapper.ts`)
```typescript
export class UserMapper {
  static toEntity(doc: IUserDocument): User {
    return new User({
      id: doc._id.toString(),
      email: doc.email,
      password: doc.password,
      role: doc.role,
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

## Request Flow Sequence

1. Request hits `/api/v1/users` (POST)
2. Main router forwards to version router
3. Version router forwards to feature router
4. Feature router forwards to controller
5. Controller:
   - Validates request headers
   - Validates request body
   - Creates DTO
   - Calls service
6. Service:
   - Validates DTO
   - Checks business rules
   - Calls repository
   - Handles side effects (email)
7. Repository:
   - Uses mapper to convert to model
   - Interacts with database
   - Uses mapper to convert back to entity
8. Response flows back through layers

## Error Flow Example

If email already exists:

1. Repository check fails
2. Service throws `ApiError`
3. Error handler middleware catches it
4. Response sent to client:
   ```json
   {
     "error": "Email already taken",
     "statusCode": 400
   }
   ```

## Success Flow Example

When everything succeeds:

1. User created in database
2. Welcome email sent
3. Response sent to client:
   ```json
   {
     "data": {
       "id": "507f1f77bcf86cd799439011",
       "email": "john@example.com",
       "role": "user",
       "createdAt": "2024-02-24T12:00:00.000Z",
       "updatedAt": "2024-02-24T12:00:00.000Z"
     }
   }
   ```
