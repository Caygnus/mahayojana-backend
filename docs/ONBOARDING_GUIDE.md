# Developer Onboarding Guide

## Project Structure Overview

```
src/
├── features/          # All features/modules of the application
│   ├── auth/         # Example: Authentication feature
│   │   ├── entities/     # Business objects
│   │   ├── dtos/        # Data Transfer Objects
│   │   ├── models/      # Database models
│   │   ├── interfaces/  # Feature interfaces
│   │   ├── repositories/# Data access layer
│   │   ├── mappers/     # Entity-Model mappers
│   │   ├── validations/ # Request validation schemas
│   │   ├── services/    # Business logic
│   │   ├── controllers/ # Request handlers
│   │   └── routes/      # Route definitions
│   └── other-feature/
├── core/             # Core business logic & interfaces
├── utils/            # Shared utilities
├── types/           # Type definitions
└── config/          # Configuration files
```

## Adding a New Feature

Let's create a complete example using Authentication feature.

### 1. Create Feature Structure

First, use the feature generator script:
```bash
npm run create-feature auth
```

This will create the following structure:
```
src/features/auth/
├── entities/          # Business objects
│   └── auth.entity.ts
├── dtos/             # Request/Response objects
│   ├── create-auth.dto.ts
│   └── update-auth.dto.ts
├── models/           # Database models
│   └── auth.model.ts
├── interfaces/       # Feature interfaces
│   ├── i-auth.repository.ts
│   └── i-auth.service.ts
├── repositories/     # Data access layer
│   └── auth.repository.ts
├── mappers/         # Entity-Model mappers
│   └── auth.mapper.ts
├── validations/     # Request validation schemas
│   └── auth.validation.ts
├── services/        # Business logic
│   └── auth.service.ts
├── controllers/     # Request handlers
│   └── auth.controller.ts
└── routes/         # Route definitions
    └── auth.routes.ts
```

### 2. Define Entity

```typescript
// src/features/auth/entities/auth.entity.ts
export class Auth {
  id!: string;
  email!: string;
  password!: string;
  role!: string;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(data: Partial<Auth>) {
    Object.assign(this, data);
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

### 3. Create DTOs

```typescript
// src/features/auth/dtos/create-auth.dto.ts
import { Auth } from '../entities/auth.entity';

export class CreateAuthDTO implements Partial<Auth> {
  email!: string;
  password!: string;
  role!: string;

  constructor(data: Partial<CreateAuthDTO>) {
    Object.assign(this, data);
  }

  validate(): void {
    if (!this.email) throw new Error('Email is required');
    if (!this.password) throw new Error('Password is required');
    if (!this.role) throw new Error('Role is required');
  }
}

// src/features/auth/dtos/update-auth.dto.ts
export class UpdateAuthDTO implements Partial<Auth> {
  email?: string;
  password?: string;
  role?: string;

  constructor(data: Partial<UpdateAuthDTO>) {
    Object.assign(this, data);
  }

  validate(): void {
    // Add validation logic here
  }
}
```

### 4. Define Database Model

```typescript
// src/features/auth/models/auth.model.ts
import mongoose, { Schema, Document } from 'mongoose';
import { Auth } from '../entities/auth.entity';

export interface IAuthDocument extends Omit<Auth, 'toJSON' | 'toObject' | 'id'>, Document {
  _id: mongoose.Types.ObjectId;
}

const AuthSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true }
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

export const AuthModel = mongoose.model<IAuthDocument>('Auth', AuthSchema);
```

### 5. Create Mapper

```typescript
// src/features/auth/mappers/auth.mapper.ts
import { Auth } from '../entities/auth.entity';
import { IAuthDocument } from '../models/auth.model';

export class AuthMapper {
  static toEntity(doc: IAuthDocument): Auth {
    return new Auth({
      id: doc._id.toString(),
      email: doc.email,
      role: doc.role,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    });
  }

  static toModel(entity: Partial<Auth>): Partial<IAuthDocument> {
    const model: any = { ...entity };
    if (entity.id) {
      model._id = entity.id;
      delete model.id;
    }
    return model;
  }

  static toEntities(docs: IAuthDocument[]): Auth[] {
    return docs.map(doc => this.toEntity(doc));
  }

  static toModels(entities: Partial<Auth>[]): Partial<IAuthDocument>[] {
    return entities.map(entity => this.toModel(entity));
  }
}
```

### 6. Create Validation Schemas

```typescript
// src/features/auth/validations/auth.validation.ts
import Joi from 'joi';
import { JoiAuthBearer, JoiObjectId } from '../../../helpers/validator';

export class AuthValidation {
  static create = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().required()
  });

  static update = Joi.object({
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).optional(),
    role: Joi.string().optional()
  });

  static id = Joi.object({
    id: JoiObjectId().required()
  });

  static auth = Joi.object({
    authorization: JoiAuthBearer().required()
  });

  static query = Joi.object({
    page: Joi.number().optional(),
    limit: Joi.number().optional()
  });
}
```

### 7. Implement Repository

```typescript
// src/features/auth/repositories/auth.repository.ts
import { Auth } from '../entities/auth.entity';
import { AuthModel, IAuthDocument } from '../models/auth.model';
import { IAuthRepository } from '../interfaces/i-auth.repository';
import { AuthMapper } from '../mappers/auth.mapper';
import { FilterQuery } from 'mongoose';

export class AuthRepository implements IAuthRepository {
  private mapper: AuthMapper;

  constructor() {
    this.mapper = new AuthMapper();
  }

  async findOne(filter: Partial<Auth>): Promise<Auth | null> {
    const modelFilter = this.mapper.toModel(filter) as FilterQuery<IAuthDocument>;
    const found = await AuthModel.findOne(modelFilter);
    return found ? this.mapper.toEntity(found) : null;
  }

  // Other repository methods...
}
```

### 8. Implement Service

```typescript
// src/features/auth/services/auth.service.ts
import { IAuthService } from '../interfaces/i-auth.service';
import { IAuthRepository } from '../interfaces/i-auth.repository';
import { AuthRepository } from '../repositories/auth.repository';
import { CreateAuthDTO } from '../dtos/create-auth.dto';
import { UpdateAuthDTO } from '../dtos/update-auth.dto';
import { Auth } from '../entities/auth.entity';

export class AuthService implements IAuthService {
  private repository: IAuthRepository;

  constructor() {
    this.repository = new AuthRepository();
  }

  async create(data: CreateAuthDTO): Promise<Auth> {
    data.validate();
    return this.repository.create(data);
  }

  // Other service methods...
}
```

### 9. Create Controller with Validation

```typescript
// src/features/auth/controllers/auth.controller.ts
import { Request, Response } from 'express';
import asyncHandler from '../../../helpers/asyncHandler';
import validator, { ValidationSource } from '../../../helpers/validator';
import { AuthService } from '../services/auth.service';
import { CreateAuthDTO } from '../dtos/create-auth.dto';
import { UpdateAuthDTO } from '../dtos/update-auth.dto';
import { AuthValidation } from '../validations/auth.validation';

export class AuthController {
  private service: AuthService;

  constructor() {
    this.service = new AuthService();
  }

  create = [
    validator(AuthValidation.auth, ValidationSource.HEADER),
    validator(AuthValidation.create),
    asyncHandler(async (req: Request, res: Response) => {
      const data = new CreateAuthDTO(req.body);
      const result = await this.service.create(data);
      res.status(201).json(result);
    })
  ];

  // Other controller methods with validation...
}
```

### 10. Define Routes

```typescript
// src/features/auth/routes/auth.routes.ts
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();
const controller = new AuthController();

router.post('/', controller.create);
router.get('/:id', controller.findById);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);
router.get('/', controller.list);

export default router;
```

### 11. Register Routes

```typescript
// src/app.ts
import express from 'express';
import authRoutes from './features/auth/routes/auth.routes';

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
```

## Request Flow

The request flows through the application in this order:

```
Request → Route → Controller → Service → Repository → Model → Database
Response ← Controller ← Service ← Repository ← Model ← Database
```

Example flow for creating an auth record:
1. Client sends POST request to `/api/auth`
2. Route handler directs to `AuthController.create`
3. Controller creates DTO from request body
4. Service validates DTO and calls repository
5. Repository uses mapper to convert DTO to model
6. Model saves to database
7. Response flows back through layers, converting to entity

## Best Practices

1. **Layer Responsibilities**
   - Entities: Core business objects
   - DTOs: Request/response validation
   - Models: Database schema
   - Mappers: Static data transformation methods
   - Validations: Request validation schemas
   - Repositories: Data access
   - Services: Business logic
   - Controllers: Request handling & validation

2. **Type Safety**
   - Use TypeScript strictly
   - Implement interfaces
   - Use DTOs for validation
   - Use Joi for request validation
   - Proper error handling

3. **Clean Architecture**
   - Separation of concerns
   - Static utility methods
   - Interface-based design
   - Domain-driven design

4. **File Naming**
   - Entities: `*.entity.ts`
   - DTOs: `create-*.dto.ts`, `update-*.dto.ts`
   - Models: `*.model.ts`
   - Interfaces: `i-*.repository.ts`, `i-*.service.ts`
   - Repositories: `*.repository.ts`
   - Mappers: `*.mapper.ts`
   - Validations: `*.validation.ts`
   - Services: `*.service.ts`
   - Controllers: `*.controller.ts`
   - Routes: `*.routes.ts`

## Testing Your Feature

Test your endpoints using curl or Postman:

```bash
# Create
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "secret", "role": "user"}'

# Get by ID
curl -X GET http://localhost:3000/api/auth/123

# Update
curl -X PUT http://localhost:3000/api/auth/123 \
  -H "Content-Type: application/json" \
  -d '{"role": "admin"}'

# Delete
curl -X DELETE http://localhost:3000/api/auth/123

# List
curl -X GET http://localhost:3000/api/auth
```

## Creating New Features

To create a new feature:

1. Run the feature generator:
   ```bash
   npm run create-feature <feature-name>
   ```

2. Add your feature-specific fields to:
   - Entity class
   - DTOs
   - Database model schema
   - Mapper transformations

3. Implement validation in DTOs

4. Register routes in `app.ts`

## Common Pitfalls to Avoid

1. Don't mix business logic in controllers
2. Keep entities focused on business rules
3. Use DTOs for input validation
4. Handle errors consistently
5. Keep services single-responsibility
6. Use meaningful variable and function names
7. Don't skip mapper implementations
8. Always validate DTOs before processing
9. Use proper TypeScript types
10. Follow the established naming conventions

## Next Steps

1. Add input validation
2. Implement proper error handling
3. Add authentication middleware
4. Add request logging
5. Implement rate limiting
6. Add API documentation 