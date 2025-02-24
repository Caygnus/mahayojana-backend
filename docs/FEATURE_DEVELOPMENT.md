# Feature Development Guide

## Overview

This guide explains the step-by-step process of adding new features to the Mahayojana Backend, following our clean architecture principles.

## Steps to Create a New Feature

### 1. Core Entity Definition
Location: `src/core/entities/`

```typescript
// example: src/core/entities/product.entity.ts
export class Product {
  id!: string;
  name!: string;
  description!: string;
  price!: number;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(partial: Partial<Product>) {
    Object.assign(this, partial);
  }
}
```

### 2. Data Transfer Objects (DTOs)
Location: `src/domain/dto/feature-name/`

```typescript
// example: src/domain/dto/product/create-product.dto.ts
export class CreateProductDTO {
  name!: string;
  description!: string;
  price!: number;

  constructor(data: Partial<CreateProductDTO>) {
    Object.assign(this, data);
  }
}

// example: src/domain/dto/product/update-product.dto.ts
export class UpdateProductDTO {
  name?: string;
  description?: string;
  price?: number;

  constructor(data: Partial<UpdateProductDTO>) {
    Object.assign(this, data);
  }
}
```

### 3. Service Interface
Location: `src/domain/interfaces/services/`

```typescript
// example: src/domain/interfaces/services/i-product.service.ts
import { Product } from '../../../core/entities/product.entity';
import { CreateProductDTO } from '../../dto/product/create-product.dto';
import { UpdateProductDTO } from '../../dto/product/update-product.dto';

export interface IProductService {
  create(data: CreateProductDTO): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  update(id: string, data: UpdateProductDTO): Promise<Product>;
  delete(id: string): Promise<boolean>;
  list(filters: Partial<Product>): Promise<Product[]>;
}
```

### 4. Database Model
Location: `src/infrastructure/database/models/`

```typescript
// example: src/infrastructure/database/models/product.model.ts
import mongoose, { Schema, Document } from 'mongoose';
import { Product } from '../../../core/entities/product.entity';

export interface IProductDocument extends Product, Document {}

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

// Add indexes if needed
ProductSchema.index({ name: 1 });

export const ProductModel = mongoose.model<IProductDocument>('Product', ProductSchema);
```

### 5. Service Implementation
Location: `src/services/feature-name/services/`

```typescript
// example: src/services/product/services/product.service.ts
import { injectable } from 'tsyringe';
import { IProductService } from '../../../domain/interfaces/services/i-product.service';
import { Product } from '../../../core/entities/product.entity';
import { CreateProductDTO } from '../../../domain/dto/product/create-product.dto';
import { UpdateProductDTO } from '../../../domain/dto/product/update-product.dto';
import { ProductModel } from '../../../infrastructure/database/models/product.model';
import { ApiError } from '../../../core/entities/api-error';

@injectable()
export class ProductService implements IProductService {
  async create(data: CreateProductDTO): Promise<Product> {
    const product = await ProductModel.create(data);
    return product;
  }

  async findById(id: string): Promise<Product | null> {
    return ProductModel.findById(id);
  }

  async update(id: string, data: UpdateProductDTO): Promise<Product> {
    const product = await ProductModel.findByIdAndUpdate(id, data, { new: true });
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }
    return product;
  }

  async delete(id: string): Promise<boolean> {
    const result = await ProductModel.findByIdAndDelete(id);
    return !!result;
  }

  async list(filters: Partial<Product>): Promise<Product[]> {
    return ProductModel.find(filters);
  }
}
```

### 6. Controller Implementation
Location: `src/services/feature-name/controllers/`

```typescript
// example: src/services/product/controllers/product.controller.ts
import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { ProductService } from '../services/product.service';
import { CreateProductDTO } from '../../../domain/dto/product/create-product.dto';
import { UpdateProductDTO } from '../../../domain/dto/product/update-product.dto';
import { ApiError } from '../../../core/entities/api-error';

@injectable()
export class ProductController {
  constructor(private productService: ProductService) {}

  async create(req: Request, res: Response) {
    const data = new CreateProductDTO(req.body);
    const product = await this.productService.create(data);
    res.status(201).json(product);
  }

  async findById(req: Request, res: Response) {
    const { id } = req.params;
    const product = await this.productService.findById(id);
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }
    res.json(product);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const data = new UpdateProductDTO(req.body);
    const product = await this.productService.update(id, data);
    res.json(product);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await this.productService.delete(id);
    res.status(204).send();
  }

  async list(req: Request, res: Response) {
    const filters = req.query;
    const products = await this.productService.list(filters);
    res.json(products);
  }
}
```

### 7. Route Definition
Location: `src/services/feature-name/routes.ts`

```typescript
// example: src/services/product/routes.ts
import { Router } from 'express';
import { container } from 'tsyringe';
import { ProductController } from './controllers/product.controller';
import { authMiddleware } from '../../interfaces/http/middlewares/auth.middleware';
import { asyncHandler } from '../../utils/async-handler';

const router = Router();
const productController = container.resolve(ProductController);

// Public routes
router.get('/', asyncHandler(productController.list.bind(productController)));
router.get('/:id', asyncHandler(productController.findById.bind(productController)));

// Protected routes
router.use(authMiddleware(['admin']));
router.post('/', asyncHandler(productController.create.bind(productController)));
router.put('/:id', asyncHandler(productController.update.bind(productController)));
router.delete('/:id', asyncHandler(productController.delete.bind(productController)));

export default router;
```

### 8. Mount Routes
Location: `src/app.ts`

```typescript
// In your app.ts
import productRoutes from './services/product/routes';

// ... other imports and setup ...

app.use('/api/products', productRoutes);
```

## Best Practices

### 1. Naming Conventions
- Files: Use kebab-case (`create-product.dto.ts`)
- Classes: Use PascalCase (`CreateProductDTO`)
- Interfaces: Prefix with 'I' (`IProductService`)
- Methods: Use camelCase (`createProduct`)

### 2. Error Handling
- Use custom `ApiError` class for business errors
- Handle all async operations with try-catch
- Use the `asyncHandler` utility for route handlers

### 3. Validation
- Validate DTOs using class-validator decorators
- Add mongoose schema validation
- Implement request validation middleware

### 4. Testing
Create tests in the following order:
1. Unit tests for service methods
2. Integration tests for API endpoints
3. E2E tests for critical flows

```typescript
// example: src/tests/unit/services/product.service.spec.ts
describe('ProductService', () => {
  it('should create a product', async () => {
    // Test implementation
  });
});
```

### 5. Documentation
- Add JSDoc comments to interfaces and complex methods
- Update API documentation (Swagger/OpenAPI)
- Add example requests/responses

## Feature Checklist

Before considering a feature complete, ensure:

- [ ] Core entity is defined
- [ ] DTOs are created with validation
- [ ] Service interface is defined
- [ ] Database model is implemented with proper indexes
- [ ] Service implementation is complete
- [ ] Controller handles all cases
- [ ] Routes are properly configured
- [ ] Authentication/Authorization is implemented
- [ ] Error handling is in place
- [ ] Tests are written and passing
- [ ] Documentation is updated
- [ ] Code follows naming conventions
- [ ] Linting passes
- [ ] PR description is complete

## Example Feature Structure

```
src/
└── services/
    └── product/
        ├── controllers/
        │   └── product.controller.ts
        ├── services/
        │   └── product.service.ts
        ├── validators/
        │   └── product.validator.ts
        ├── tests/
        │   ├── product.service.spec.ts
        │   └── product.controller.spec.ts
        └── routes.ts
```

## Common Pitfalls to Avoid

1. **Circular Dependencies**
   - Keep dependencies flowing inward
   - Use interfaces for dependency injection

2. **Business Logic in Controllers**
   - Controllers should only handle HTTP concerns
   - Move business logic to services

3. **Direct Database Access in Services**
   - Use repository pattern
   - Abstract database operations

4. **Inconsistent Error Handling**
   - Use centralized error handling
   - Maintain consistent error responses

5. **Missing Validation**
   - Validate all inputs
   - Use DTOs for type safety

## Conclusion

Following this guide ensures:
- Consistent feature implementation
- Maintainable codebase
- Testable components
- Clean architecture compliance
- Scalable application structure 