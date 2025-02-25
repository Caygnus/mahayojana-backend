# Feature Development Guide

## 1. Plan Your Feature

Before writing any code, clearly define:
- The purpose of the feature
- Required endpoints
- Data structure
- Business logic
- Dependencies

## 2. Create Feature Directory Structure

Create a new directory under `src/features/` with proper subdirectories:

```
features/your-feature/
├── entities/        # Business objects
├── dtos/            # Data Transfer Objects
├── models/          # Database models
├── interfaces/      # Feature interfaces
├── repositories/    # Data access layer
├── mappers/         # Data transformers
├── validations/     # Request validation
├── services/        # Business logic
├── controllers/     # Request handlers
└── routes/          # Route definitions
```

## 3. Define the Entity

Create your domain entity in `entities/your-entity.entity.ts`:

```typescript
export class YourEntity {
  id!: string;
  // Add your entity properties
  createdAt!: Date;
  updatedAt!: Date;

  constructor(data: Partial<YourEntity>) {
    Object.assign(this, data);
  }

  // Add business logic methods if needed
  toJSON() {
    // Return a sanitized version of the entity
    return {
      id: this.id,
      // Other properties
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
```

## 4. Create Database Model

Define your MongoDB schema in `models/your-entity.model.ts`:

```typescript
import mongoose, { Schema, Document } from 'mongoose';
import { YourEntity } from '../entities/your-entity.entity';

export interface IYourEntityDocument extends Omit<YourEntity, 'toJSON' | 'toObject' | 'id'>, Document {
  _id: mongoose.Types.ObjectId;
}

const YourEntitySchema = new Schema({
  // Define your schema fields
  field1: { type: String, required: true },
  field2: { type: Number, default: 0 },
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

export const YourEntityModel = mongoose.model<IYourEntityDocument>('YourEntity', YourEntitySchema);
```

## 5. Create DTOs

Create DTOs for your API requests in `dtos/`:

```typescript
// create-your-entity.dto.ts
export class CreateYourEntityDTO {
  field1!: string;
  field2?: number;

  constructor(data: CreateYourEntityDTO) {
    Object.assign(this, data);
  }

  validate(): void {
    if (!this.field1) throw new Error('Field1 is required');
  }
}

// update-your-entity.dto.ts
export class UpdateYourEntityDTO {
  field1?: string;
  field2?: number;

  constructor(data: UpdateYourEntityDTO) {
    Object.assign(this, data);
  }

  validate(): void {
    // Add validation if needed
  }
}
```

## 6. Define Repository Interface

Create the repository interface in `interfaces/your-entity.repository.interface.ts`:

```typescript
import { YourEntity } from '../entities/your-entity.entity';

export interface IYourEntityRepository {
  create(data: Partial<YourEntity>): Promise<YourEntity>;
  findById(id: string): Promise<YourEntity | null>;
  findOne(filter: Partial<YourEntity>): Promise<YourEntity | null>;
  update(id: string, data: Partial<YourEntity>): Promise<YourEntity | null>;
  delete(id: string): Promise<void>;
  list(filter?: Partial<YourEntity>): Promise<YourEntity[]>;
  // Add other methods as needed
}
```

## 7. Create Mapper

Implement the mapper in `mappers/your-entity.mapper.ts`:

```typescript
import { YourEntity } from '../entities/your-entity.entity';
import { IYourEntityDocument } from '../models/your-entity.model';

export class YourEntityMapper {
  static toEntity(doc: IYourEntityDocument): YourEntity {
    return new YourEntity({
      id: doc._id.toString(),
      field1: doc.field1,
      field2: doc.field2,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toModel(entity: Partial<YourEntity>): Partial<IYourEntityDocument> {
    const model: any = { ...entity };
    if (entity.id) {
      model._id = entity.id;
      delete model.id;
    }
    return model;
  }

  static toEntities(docs: IYourEntityDocument[]): YourEntity[] {
    return docs.map(doc => this.toEntity(doc));
  }

  static toModels(entities: Partial<YourEntity>[]): Partial<IYourEntityDocument>[] {
    return entities.map(entity => this.toModel(entity));
  }
}
```

## 8. Implement Repository

Create your repository implementation in `repositories/your-entity.repository.ts`:

```typescript
import { FilterQuery } from 'mongoose';
import { YourEntity } from '../entities/your-entity.entity';
import { IYourEntityDocument, YourEntityModel } from '../models/your-entity.model';
import { YourEntityMapper } from '../mappers/your-entity.mapper';
import { IYourEntityRepository } from '../interfaces/your-entity.repository.interface';

export class YourEntityRepository implements IYourEntityRepository {
  async create(data: Partial<YourEntity>): Promise<YourEntity> {
    const modelData = YourEntityMapper.toModel(data);
    const created = await YourEntityModel.create(modelData);
    return YourEntityMapper.toEntity(created);
  }

  async findById(id: string): Promise<YourEntity | null> {
    const found = await YourEntityModel.findById(id);
    return found ? YourEntityMapper.toEntity(found) : null;
  }

  async findOne(filter: Partial<YourEntity>): Promise<YourEntity | null> {
    const modelFilter = YourEntityMapper.toModel(filter) as FilterQuery<IYourEntityDocument>;
    const found = await YourEntityModel.findOne(modelFilter);
    return found ? YourEntityMapper.toEntity(found) : null;
  }

  async update(id: string, data: Partial<YourEntity>): Promise<YourEntity | null> {
    const modelData = YourEntityMapper.toModel(data);
    const updated = await YourEntityModel.findByIdAndUpdate(id, { $set: modelData }, { new: true });
    return updated ? YourEntityMapper.toEntity(updated) : null;
  }

  async delete(id: string): Promise<void> {
    await YourEntityModel.findByIdAndDelete(id);
  }

  async list(filter?: Partial<YourEntity>): Promise<YourEntity[]> {
    const modelFilter = filter ? YourEntityMapper.toModel(filter) as FilterQuery<IYourEntityDocument> : {};
    const found = await YourEntityModel.find(modelFilter);
    return YourEntityMapper.toEntities(found);
  }
}
```

## 9. Define Validations

Create validation rules in `validations/your-entity.validation.ts`:

```typescript
import Joi from 'joi';

export class YourEntityValidation {
  static create = Joi.object({
    field1: Joi.string().required().messages({
      'any.required': 'Field1 is required'
    }),
    field2: Joi.number().optional()
  });

  static update = Joi.object({
    field1: Joi.string().optional(),
    field2: Joi.number().optional()
  });
}
```

## 10. Implement Service Interface

Create the service interface in `interfaces/your-entity.service.interface.ts`:

```typescript
import { YourEntity } from '../entities/your-entity.entity';
import { CreateYourEntityDTO } from '../dtos/create-your-entity.dto';
import { UpdateYourEntityDTO } from '../dtos/update-your-entity.dto';

export interface IYourEntityService {
  create(data: CreateYourEntityDTO): Promise<YourEntity>;
  findById(id: string): Promise<YourEntity | null>;
  update(id: string, data: UpdateYourEntityDTO): Promise<YourEntity | null>;
  delete(id: string): Promise<void>;
  list(): Promise<YourEntity[]>;
  // Add other methods as needed
}
```

## 11. Implement Service

Create your service implementation in `services/your-entity.service.ts`:

```typescript
import { YourEntity } from '../entities/your-entity.entity';
import { IYourEntityRepository } from '../interfaces/your-entity.repository.interface';
import { YourEntityRepository } from '../repositories/your-entity.repository';
import { CreateYourEntityDTO } from '../dtos/create-your-entity.dto';
import { UpdateYourEntityDTO } from '../dtos/update-your-entity.dto';
import { ApiError } from '../../../core/errors/api.error';
import { IYourEntityService } from '../interfaces/your-entity.service.interface';

export class YourEntityService implements IYourEntityService {
  private repository: IYourEntityRepository;

  constructor() {
    this.repository = new YourEntityRepository();
  }

  async create(dto: CreateYourEntityDTO): Promise<YourEntity> {
    // Validate DTO
    dto.validate();

    // You can add business logic here

    // Create entity
    return this.repository.create(dto);
  }

  async findById(id: string): Promise<YourEntity | null> {
    const entity = await this.repository.findById(id);
    if (!entity) {
      throw new ApiError(404, 'Entity not found');
    }
    return entity;
  }

  async update(id: string, dto: UpdateYourEntityDTO): Promise<YourEntity | null> {
    // Validate DTO
    dto.validate();

    // Check if entity exists
    const exists = await this.repository.findById(id);
    if (!exists) {
      throw new ApiError(404, 'Entity not found');
    }

    // Update entity
    return this.repository.update(id, dto);
  }

  async delete(id: string): Promise<void> {
    // Check if entity exists
    const exists = await this.repository.findById(id);
    if (!exists) {
      throw new ApiError(404, 'Entity not found');
    }

    // Delete entity
    await this.repository.delete(id);
  }

  async list(): Promise<YourEntity[]> {
    return this.repository.list();
  }
}
```

## 12. Implement Controller

Create your controller in `controllers/your-entity.controller.ts`:

```typescript
import { Request, Response } from 'express';
import { YourEntityService } from '../services/your-entity.service';
import { CreateYourEntityDTO } from '../dtos/create-your-entity.dto';
import { UpdateYourEntityDTO } from '../dtos/update-your-entity.dto';
import { YourEntityValidation } from '../validations/your-entity.validation';
import asyncHandler from '../../../helpers/asyncHandler';
import validator from '../../../helpers/validator';
import { SuccessResponse } from '../../../core/ApiResponse';

export class YourEntityController {
  private service: YourEntityService;

  constructor() {
    this.service = new YourEntityService();
  }

  create = [
    validator(YourEntityValidation.create),
    asyncHandler(async (req: Request, res: Response) => {
      const dto = new CreateYourEntityDTO(req.body);
      const result = await this.service.create(dto);
      new SuccessResponse('Entity created successfully', result).send(res);
    })
  ];

  findById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await this.service.findById(id);
    new SuccessResponse('Entity retrieved successfully', result).send(res);
  });

  update = [
    validator(YourEntityValidation.update),
    asyncHandler(async (req: Request, res: Response) => {
      const id = req.params.id;
      const dto = new UpdateYourEntityDTO(req.body);
      const result = await this.service.update(id, dto);
      new SuccessResponse('Entity updated successfully', result).send(res);
    })
  ];

  delete = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    await this.service.delete(id);
    new SuccessResponse('Entity deleted successfully', {}).send(res);
  });

  list = asyncHandler(async (_req: Request, res: Response) => {
    const result = await this.service.list();
    new SuccessResponse('Entities retrieved successfully', result).send(res);
  });
}
```

## 13. Create Routes

Define your routes in `routes/your-entity.routes.ts`:

```typescript
import { Router } from 'express';
import { YourEntityController } from '../controllers/your-entity.controller';

const router = Router();
const controller = new YourEntityController();

/**
 * @swagger
 * /api/v1/your-entities:
 *   post:
 *     tags: [YourEntity]
 *     summary: Create a new entity
 *     description: Creates a new entity with the provided data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - field1
 *             properties:
 *               field1:
 *                 type: string
 *               field2:
 *                 type: number
 */
router.post('/', controller.create);

/**
 * @swagger
 * /api/v1/your-entities/{id}:
 *   get:
 *     tags: [YourEntity]
 *     summary: Get entity by ID
 */
router.get('/:id', controller.findById);

/**
 * @swagger
 * /api/v1/your-entities/{id}:
 *   put:
 *     tags: [YourEntity]
 *     summary: Update entity
 */
router.put('/:id', controller.update);

/**
 * @swagger
 * /api/v1/your-entities/{id}:
 *   delete:
 *     tags: [YourEntity]
 *     summary: Delete entity
 */
router.delete('/:id', controller.delete);

/**
 * @swagger
 * /api/v1/your-entities:
 *   get:
 *     tags: [YourEntity]
 *     summary: List all entities
 */
router.get('/', controller.list);

export default router;
```

## 14. Register Routes in Main Router

Add your routes to `src/routes/v1/index.ts`:

```typescript
import express from 'express';
import authRoutes from '../../features/auth/routes/auth.routes';
import yourEntityRoutes from '../../features/your-feature/routes/your-entity.routes';

const router = express.Router();
router.use('/auth', authRoutes);
router.use('/your-entities', yourEntityRoutes);

export default router;
```

## 15. Test Your Endpoints

Use Postman or another API testing tool to verify your endpoints work correctly.

## Common Issues & Troubleshooting

1. **Import Errors**: Make sure all your import paths are correct.
   ```typescript
   // Incorrect path
   import { Component } from '../wrong/path';
   
   // Correct path
   import { Component } from '../correct/path';
   ```

2. **Interface Implementation Errors**: Ensure your classes properly implement all methods required by interfaces.

3. **Type Errors**: Ensure your types are consistent throughout the codebase.

4. **Missing Core Modules**: If you're getting errors about missing core modules (like `validator` or `asyncHandler`), check their location in your project and ensure you're importing them correctly.

5. **Model Type Errors**: Ensure your entity model properties match the database schema.

# Feature Development Guide

## 1. Plan Your Feature

Before writing any code, clearly define:
- The purpose of the feature
- Required endpoints
- Data structure
- Business logic
- Dependencies

## 2. Create Feature Directory Structure

Create a new directory under `src/features/` with proper subdirectories:

```
features/your-feature/
├── entities/        # Business objects
├── dtos/            # Data Transfer Objects
├── models/          # Database models
├── interfaces/      # Feature interfaces
├── repositories/    # Data access layer
├── mappers/         # Data transformers
├── validations/     # Request validation
├── services/        # Business logic
├── controllers/     # Request handlers
└── routes/          # Route definitions
```

## 3. Define the Entity

Create your domain entity in `entities/your-entity.entity.ts`:

```typescript
export class YourEntity {
  id!: string;
  // Add your entity properties
  createdAt!: Date;
  updatedAt!: Date;

  constructor(data: Partial<YourEntity>) {
    Object.assign(this, data);
  }

  // Add business logic methods if needed
  toJSON() {
    // Return a sanitized version of the entity
    return {
      id: this.id,
      // Other properties
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
```

## 4. Create Database Model

Define your MongoDB schema in `models/your-entity.model.ts`:

```typescript
import mongoose, { Schema, Document } from 'mongoose';
import { YourEntity } from '../entities/your-entity.entity';

export interface IYourEntityDocument extends Omit<YourEntity, 'toJSON' | 'toObject' | 'id'>, Document {
  _id: mongoose.Types.ObjectId;
}

const YourEntitySchema = new Schema({
  // Define your schema fields
  field1: { type: String, required: true },
  field2: { type: Number, default: 0 },
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

export const YourEntityModel = mongoose.model<IYourEntityDocument>('YourEntity', YourEntitySchema);
```

## 5. Create DTOs

Create DTOs for your API requests in `dtos/`:

```typescript
// create-your-entity.dto.ts
export class CreateYourEntityDTO {
  field1!: string;
  field2?: number;

  constructor(data: CreateYourEntityDTO) {
    Object.assign(this, data);
  }

  validate(): void {
    if (!this.field1) throw new Error('Field1 is required');
  }
}

// update-your-entity.dto.ts
export class UpdateYourEntityDTO {
  field1?: string;
  field2?: number;

  constructor(data: UpdateYourEntityDTO) {
    Object.assign(this, data);
  }

  validate(): void {
    // Add validation if needed
  }
}
```

## 6. Define Repository Interface

Create the repository interface in `interfaces/your-entity.repository.interface.ts`:

```typescript
import { YourEntity } from '../entities/your-entity.entity';

export interface IYourEntityRepository {
  create(data: Partial<YourEntity>): Promise<YourEntity>;
  findById(id: string): Promise<YourEntity | null>;
  findOne(filter: Partial<YourEntity>): Promise<YourEntity | null>;
  update(id: string, data: Partial<YourEntity>): Promise<YourEntity | null>;
  delete(id: string): Promise<void>;
  list(filter?: Partial<YourEntity>): Promise<YourEntity[]>;
  // Add other methods as needed
}
```

## 7. Create Mapper

Implement the mapper in `mappers/your-entity.mapper.ts`:

```typescript
import { YourEntity } from '../entities/your-entity.entity';
import { IYourEntityDocument } from '../models/your-entity.model';

export class YourEntityMapper {
  static toEntity(doc: IYourEntityDocument): YourEntity {
    return new YourEntity({
      id: doc._id.toString(),
      field1: doc.field1,
      field2: doc.field2,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toModel(entity: Partial<YourEntity>): Partial<IYourEntityDocument> {
    const model: any = { ...entity };
    if (entity.id) {
      model._id = entity.id;
      delete model.id;
    }
    return model;
  }

  static toEntities(docs: IYourEntityDocument[]): YourEntity[] {
    return docs.map(doc => this.toEntity(doc));
  }

  static toModels(entities: Partial<YourEntity>[]): Partial<IYourEntityDocument>[] {
    return entities.map(entity => this.toModel(entity));
  }
}
```

## 8. Implement Repository

Create your repository implementation in `repositories/your-entity.repository.ts`:

```typescript
import { FilterQuery } from 'mongoose';
import { YourEntity } from '../entities/your-entity.entity';
import { IYourEntityDocument, YourEntityModel } from '../models/your-entity.model';
import { YourEntityMapper } from '../mappers/your-entity.mapper';
import { IYourEntityRepository } from '../interfaces/your-entity.repository.interface';

export class YourEntityRepository implements IYourEntityRepository {
  async create(data: Partial<YourEntity>): Promise<YourEntity> {
    const modelData = YourEntityMapper.toModel(data);
    const created = await YourEntityModel.create(modelData);
    return YourEntityMapper.toEntity(created);
  }

  async findById(id: string): Promise<YourEntity | null> {
    const found = await YourEntityModel.findById(id);
    return found ? YourEntityMapper.toEntity(found) : null;
  }

  async findOne(filter: Partial<YourEntity>): Promise<YourEntity | null> {
    const modelFilter = YourEntityMapper.toModel(filter) as FilterQuery<IYourEntityDocument>;
    const found = await YourEntityModel.findOne(modelFilter);
    return found ? YourEntityMapper.toEntity(found) : null;
  }

  async update(id: string, data: Partial<YourEntity>): Promise<YourEntity | null> {
    const modelData = YourEntityMapper.toModel(data);
    const updated = await YourEntityModel.findByIdAndUpdate(id, { $set: modelData }, { new: true });
    return updated ? YourEntityMapper.toEntity(updated) : null;
  }

  async delete(id: string): Promise<void> {
    await YourEntityModel.findByIdAndDelete(id);
  }

  async list(filter?: Partial<YourEntity>): Promise<YourEntity[]> {
    const modelFilter = filter ? YourEntityMapper.toModel(filter) as FilterQuery<IYourEntityDocument> : {};
    const found = await YourEntityModel.find(modelFilter);
    return YourEntityMapper.toEntities(found);
  }
}
```

## 9. Define Validations

Create validation rules in `validations/your-entity.validation.ts`:

```typescript
import Joi from 'joi';

export class YourEntityValidation {
  static create = Joi.object({
    field1: Joi.string().required().messages({
      'any.required': 'Field1 is required'
    }),
    field2: Joi.number().optional()
  });

  static update = Joi.object({
    field1: Joi.string().optional(),
    field2: Joi.number().optional()
  });
}
```

## 10. Implement Service Interface

Create the service interface in `interfaces/your-entity.service.interface.ts`:

```typescript
import { YourEntity } from '../entities/your-entity.entity';
import { CreateYourEntityDTO } from '../dtos/create-your-entity.dto';
import { UpdateYourEntityDTO } from '../dtos/update-your-entity.dto';

export interface IYourEntityService {
  create(data: CreateYourEntityDTO): Promise<YourEntity>;
  findById(id: string): Promise<YourEntity | null>;
  update(id: string, data: UpdateYourEntityDTO): Promise<YourEntity | null>;
  delete(id: string): Promise<void>;
  list(): Promise<YourEntity[]>;
  // Add other methods as needed
}
```

## 11. Implement Service

Create your service implementation in `services/your-entity.service.ts`:

```typescript
import { YourEntity } from '../entities/your-entity.entity';
import { IYourEntityRepository } from '../interfaces/your-entity.repository.interface';
import { YourEntityRepository } from '../repositories/your-entity.repository';
import { CreateYourEntityDTO } from '../dtos/create-your-entity.dto';
import { UpdateYourEntityDTO } from '../dtos/update-your-entity.dto';
import { ApiError } from '../../../core/errors/api.error';
import { IYourEntityService } from '../interfaces/your-entity.service.interface';

export class YourEntityService implements IYourEntityService {
  private repository: IYourEntityRepository;

  constructor() {
    this.repository = new YourEntityRepository();
  }

  async create(dto: CreateYourEntityDTO): Promise<YourEntity> {
    // Validate DTO
    dto.validate();

    // You can add business logic here

    // Create entity
    return this.repository.create(dto);
  }

  async findById(id: string): Promise<YourEntity | null> {
    const entity = await this.repository.findById(id);
    if (!entity) {
      throw new ApiError(404, 'Entity not found');
    }
    return entity;
  }

  async update(id: string, dto: UpdateYourEntityDTO): Promise<YourEntity | null> {
    // Validate DTO
    dto.validate();

    // Check if entity exists
    const exists = await this.repository.findById(id);
    if (!exists) {
      throw new ApiError(404, 'Entity not found');
    }

    // Update entity
    return this.repository.update(id, dto);
  }

  async delete(id: string): Promise<void> {
    // Check if entity exists
    const exists = await this.repository.findById(id);
    if (!exists) {
      throw new ApiError(404, 'Entity not found');
    }

    // Delete entity
    await this.repository.delete(id);
  }

  async list(): Promise<YourEntity[]> {
    return this.repository.list();
  }
}
```

## 12. Implement Controller

Create your controller in `controllers/your-entity.controller.ts`:

```typescript
import { Request, Response } from 'express';
import { YourEntityService } from '../services/your-entity.service';
import { CreateYourEntityDTO } from '../dtos/create-your-entity.dto';
import { UpdateYourEntityDTO } from '../dtos/update-your-entity.dto';
import { YourEntityValidation } from '../validations/your-entity.validation';
import asyncHandler from '../../../helpers/asyncHandler';
import validator from '../../../helpers/validator';
import { SuccessResponse } from '../../../core/ApiResponse';

export class YourEntityController {
  private service: YourEntityService;

  constructor() {
    this.service = new YourEntityService();
  }

  create = [
    validator(YourEntityValidation.create),
    asyncHandler(async (req: Request, res: Response) => {
      const dto = new CreateYourEntityDTO(req.body);
      const result = await this.service.create(dto);
      new SuccessResponse('Entity created successfully', result).send(res);
    })
  ];

  findById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await this.service.findById(id);
    new SuccessResponse('Entity retrieved successfully', result).send(res);
  });

  update = [
    validator(YourEntityValidation.update),
    asyncHandler(async (req: Request, res: Response) => {
      const id = req.params.id;
      const dto = new UpdateYourEntityDTO(req.body);
      const result = await this.service.update(id, dto);
      new SuccessResponse('Entity updated successfully', result).send(res);
    })
  ];

  delete = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    await this.service.delete(id);
    new SuccessResponse('Entity deleted successfully', {}).send(res);
  });

  list = asyncHandler(async (_req: Request, res: Response) => {
    const result = await this.service.list();
    new SuccessResponse('Entities retrieved successfully', result).send(res);
  });
}
```

## 13. Create Routes

Define your routes in `routes/your-entity.routes.ts`:

```typescript
import { Router } from 'express';
import { YourEntityController } from '../controllers/your-entity.controller';

const router = Router();
const controller = new YourEntityController();

/**
 * @swagger
 * /api/v1/your-entities:
 *   post:
 *     tags: [YourEntity]
 *     summary: Create a new entity
 *     description: Creates a new entity with the provided data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - field1
 *             properties:
 *               field1:
 *                 type: string
 *               field2:
 *                 type: number
 */
router.post('/', controller.create);

/**
 * @swagger
 * /api/v1/your-entities/{id}:
 *   get:
 *     tags: [YourEntity]
 *     summary: Get entity by ID
 */
router.get('/:id', controller.findById);

/**
 * @swagger
 * /api/v1/your-entities/{id}:
 *   put:
 *     tags: [YourEntity]
 *     summary: Update entity
 */
router.put('/:id', controller.update);

/**
 * @swagger
 * /api/v1/your-entities/{id}:
 *   delete:
 *     tags: [YourEntity]
 *     summary: Delete entity
 */
router.delete('/:id', controller.delete);

/**
 * @swagger
 * /api/v1/your-entities:
 *   get:
 *     tags: [YourEntity]
 *     summary: List all entities
 */
router.get('/', controller.list);

export default router;
```

## 14. Register Routes in Main Router

Add your routes to `src/routes/v1/index.ts`:

```typescript
import express from 'express';
import authRoutes from '../../features/auth/routes/auth.routes';
import yourEntityRoutes from '../../features/your-feature/routes/your-entity.routes';

const router = express.Router();
router.use('/auth', authRoutes);
router.use('/your-entities', yourEntityRoutes);

export default router;
```

## 15. Test Your Endpoints

Use Postman or another API testing tool to verify your endpoints work correctly.

## Common Issues & Troubleshooting

1. **Import Errors**: Make sure all your import paths are correct.
   ```typescript
   // Incorrect path
   import { Component } from '../wrong/path';
   
   // Correct path
   import { Component } from '../correct/path';
   ```

2. **Interface Implementation Errors**: Ensure your classes properly implement all methods required by interfaces.

3. **Type Errors**: Ensure your types are consistent throughout the codebase.

4. **Missing Core Modules**: If you're getting errors about missing core modules (like `validator` or `asyncHandler`), check their location in your project and ensure you're importing them correctly.

5. **Model Type Errors**: Ensure your entity model properties match the database schema.

## Best Practices

1. **Follow the Clean Architecture**: Keep responsibilities separated between layers.
2. **Use DTOs for Input Validation**: Validate all user input at the controller level.
3. **Use Entities for Business Logic**: Keep business rules in entity methods.
4. **Use Repositories for Data Access**: Keep database queries in repository methods.
5. **Handle Errors Consistently**: Use API error classes for consistent error responses.
6. **Document with Swagger**: Add Swagger annotations to all endpoints.
7. **Write Unit Tests**: Test each layer independently.## Best Practices

1. **Follow the Clean Architecture**: Keep responsibilities separated between layers.
2. **Use DTOs for Input Validation**: Validate all user input at the controller level.
3. **Use Entities for Business Logic**: Keep business rules in entity methods.
4. **Use Repositories for Data Access**: Keep database queries in repository methods.
5. **Handle Errors Consistently**: Use API error classes for consistent error responses.
6. **Document with Swagger**: Add Swagger annotations to all endpoints.
7. **Write Unit Tests**: Test each layer independently.