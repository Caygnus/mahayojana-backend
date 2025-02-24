# Request Validation & Response Handling Guide

## Request Validation

### 1. Schema Validation (Using Joi)

```typescript
import Joi from '@hapi/joi';
import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../core/ApiError';

export const validateSchema = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error } = schema.validate(req.body, { abortEarly: false });
      if (error) throw new BadRequestError(error.message);
      next();
    } catch (error) {
      next(error);
    }
  };
};

// Example Schema
const createPostSchema = Joi.object({
  title: Joi.string().required().min(3).max(100),
  content: Joi.string().required().min(10),
  author: Joi.string().required(),
  tags: Joi.array().items(Joi.string()),
});

// Usage in Route
router.post(
  '/posts',
  validateSchema(createPostSchema),
  AsyncHandler(async (req, res) => {
    // Your handler code
  })
);
```

### 2. Request Parameters Validation

```typescript
// Validate URL Parameters
const validatePostId = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BadRequestError('Invalid post ID format');
  }
  next();
};

// Usage
router.get('/posts/:id', validatePostId, AsyncHandler(async (req, res) => {
  // Your handler code
}));
```

### 3. Headers Validation

```typescript
const validateHeaders = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'];
  const authorization = req.headers.authorization;

  if (!apiKey) throw new AuthFailureError('API Key is missing');
  if (!authorization) throw new AuthFailureError('Authorization header is missing');

  next();
};
```

### 4. Query Parameters Validation

```typescript
const validateQueryParams = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(10),
    sortBy: Joi.string().valid('createdAt', 'title').default('createdAt'),
    order: Joi.string().valid('asc', 'desc').default('desc'),
  });

  const { error, value } = schema.validate(req.query);
  if (error) throw new BadRequestError(error.message);
  
  req.query = value;
  next();
};
```

## Success Response Handling

### 1. Standard Success Response

```typescript
// Response Handler Utility
export class SuccessResponse {
  constructor(
    public statusCode: number,
    public message: string,
    public data?: any
  ) {}

  public send(res: Response): Response {
    return res.status(this.statusCode).json({
      status: 'success',
      message: this.message,
      data: this.data,
    });
  }
}

// Usage Example
router.get(
  '/posts/:id',
  AsyncHandler(async (req, res) => {
    const post = await PostRepo.findById(req.params.id);
    if (!post) throw new NotFoundError('Post not found');
    
    return new SuccessResponse(
      200,
      'Post retrieved successfully',
      post
    ).send(res);
  })
);
```

### 2. Pagination Response

```typescript
export class PaginatedResponse extends SuccessResponse {
  constructor(
    data: any[],
    page: number,
    limit: number,
    total: number
  ) {
    super(200, 'Data retrieved successfully', {
      docs: data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  }
}

// Usage Example
router.get(
  '/posts',
  validateQueryParams,
  AsyncHandler(async (req, res) => {
    const { page, limit } = req.query;
    const posts = await PostRepo.findPaginated(page, limit);
    const total = await PostRepo.count();
    
    return new PaginatedResponse(
      posts,
      page,
      limit,
      total
    ).send(res);
  })
);
```

## Error Handling

### 1. Custom Error Classes

```typescript
// In core/ApiError.ts
export enum ErrorType {
  BAD_REQUEST = 'BadRequest',
  UNAUTHORIZED = 'Unauthorized',
  FORBIDDEN = 'Forbidden',
  NOT_FOUND = 'NotFound',
  INTERNAL = 'Internal',
}

export abstract class ApiError extends Error {
  constructor(
    public type: ErrorType,
    public message: string = 'error',
    public statusCode: number = 500,
  ) {
    super(message);
  }

  public static handle(err: ApiError, res: Response): Response {
    return res.status(err.statusCode).json({
      status: 'error',
      type: err.type,
      message: err.message,
    });
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string = 'Bad Request') {
    super(ErrorType.BAD_REQUEST, message, 400);
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = 'Not Found') {
    super(ErrorType.NOT_FOUND, message, 404);
  }
}
```

### 2. Throwing Errors

```typescript
// In your route handlers
router.get(
  '/posts/:id',
  AsyncHandler(async (req, res) => {
    const post = await PostRepo.findById(req.params.id);
    
    // Throw Not Found Error
    if (!post) {
      throw new NotFoundError('Post not found');
    }

    // Throw Bad Request Error
    if (post.isArchived) {
      throw new BadRequestError('Post is archived');
    }

    // Throw Unauthorized Error
    if (!req.user.canAccessPost(post)) {
      throw new AuthFailureError('You do not have permission to access this post');
    }

    return new SuccessResponse(200, 'Post retrieved successfully', post).send(res);
  })
);
```

### 3. Global Error Handler

```typescript
// In app.ts
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    ApiError.handle(err, res);
    if (err.type === ErrorType.INTERNAL) {
      Logger.error(
        `500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`,
      );
    }
  } else {
    Logger.error(
      `500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`,
    );
    Logger.error(err);
    if (environment === 'development') {
      return res.status(500).send(err);
    }
    ApiError.handle(new InternalError(), res);
  }
});
```

## Best Practices

1. **Always Validate Input**
   - Validate request body using schemas
   - Validate URL parameters
   - Validate query parameters
   - Validate headers when required

2. **Consistent Response Format**
   - Use standard response structure
   - Include appropriate HTTP status codes
   - Include meaningful success/error messages
   - Include pagination info when applicable

3. **Error Handling**
   - Use custom error classes
   - Include appropriate error types
   - Log errors properly
   - Hide internal errors in production
   - Include stack traces in development

4. **Security**
   - Sanitize user input
   - Validate authentication tokens
   - Check permissions
   - Rate limit requests
   - Implement CORS properly

## Example Implementation

```typescript
// Complete example of a route with validation, error handling, and response
import { Router } from 'express';
import { AsyncHandler } from '../helpers/AsyncHandler';
import { validateSchema } from '../helpers/validator';
import { SuccessResponse } from '../core/ApiResponse';
import { BadRequestError, NotFoundError } from '../core/ApiError';
import PostRepo from '../database/repository/PostRepo';

const router = Router();

// Schema validation
const createPostSchema = Joi.object({
  title: Joi.string().required().min(3).max(100),
  content: Joi.string().required().min(10),
  author: Joi.string().required(),
});

// Route implementation
router.post(
  '/',
  validateSchema(createPostSchema),
  AsyncHandler(async (req, res) => {
    // Create post
    const post = await PostRepo.create(req.body);
    
    // Return success response
    return new SuccessResponse(
      201,
      'Post created successfully',
      post
    ).send(res);
  })
);

router.get(
  '/:id',
  validatePostId,
  AsyncHandler(async (req, res) => {
    const post = await PostRepo.findById(req.params.id);
    if (!post) throw new NotFoundError('Post not found');
    
    return new SuccessResponse(
      200,
      'Post retrieved successfully',
      post
    ).send(res);
  })
);

export default router; 