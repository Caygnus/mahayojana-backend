# API Versioning Guide

## Version Structure

```
src/routes/
├── index.ts           # Main router
├── v1/               # Version 1 routes
│   └── index.ts
└── v2/               # Version 2 routes
    └── index.ts
```

## Creating Versioned Features

### 1. Basic Version
```bash
npm run create-feature user
# Creates in v1 by default
```

### 2. Specific Version
```bash
npm run create-feature user v2
# Creates in v2
```

## Route Registration

### 1. Version Router (v1/index.ts)
```typescript
import express from 'express';
import userRoutes from '../../features/user/routes/user.routes';

const router = express.Router();

router.use('/users', userRoutes);

export default router;
```

### 2. Main Router (index.ts)
```typescript
import express from 'express';
import v1Routes from './v1';
import v2Routes from './v2';

const router = express.Router();

router.use('/v1', v1Routes);
router.use('/v2', v2Routes);

export default router;
```

## Version Migration

### 1. Copy Existing Feature
```bash
# Create new version of feature
npm run create-feature user v2
```

### 2. Modify V2 Implementation
```typescript
// v2 changes in entity
export class User {
  // New fields in v2
  phoneNumber?: string;
  preferences: UserPreferences;
}

// v2 changes in validation
export class UserValidation {
  static create = Joi.object({
    // New validation rules
    phoneNumber: Joi.string().pattern(/^\+[1-9]\d{1,14}$/),
    preferences: Joi.object()
  });
}
```

### 3. Update Documentation
```typescript
/**
 * @api {post} /v2/users Create User
 * @apiVersion 2.0.0
 * @apiParam {String} [phoneNumber] User's phone number
 * @apiParam {Object} preferences User preferences
 */
```

## Breaking Changes

### 1. Response Format Changes
```typescript
// v1 response
{
  "data": {
    "id": "123",
    "name": "John"
  }
}

// v2 response
{
  "data": {
    "user": {
      "id": "123",
      "name": "John"
    },
    "meta": {
      "createdAt": "2024-01-01"
    }
  }
}
```

### 2. Request Format Changes
```typescript
// v1 request
POST /v1/users
{
  "name": "John",
  "age": 30
}

// v2 request
POST /v2/users
{
  "userData": {
    "name": "John",
    "age": 30
  },
  "preferences": {
    "theme": "dark"
  }
}
```

## Version Deprecation

### 1. Mark as Deprecated
```typescript
/**
 * @api {post} /v1/users Create User
 * @apiVersion 1.0.0
 * @apiDeprecated Use v2 endpoint instead
 */
```

### 2. Warning Header
```typescript
router.use('/v1/*', (req, res, next) => {
  res.setHeader(
    'Warning',
    '299 - "This version is deprecated. Please use /v2"'
  );
  next();
});
```

### 3. Sunset Header
```typescript
router.use('/v1/*', (req, res, next) => {
  const sunsetDate = new Date('2024-12-31');
  res.setHeader('Sunset', sunsetDate.toUTCString());
  next();
});
```

## Version Maintenance

### 1. Feature Flags
```typescript
const config = {
  features: {
    v2: {
      newUserFields: true,
      strictValidation: true
    }
  }
};
```

### 2. Version-specific Middleware
```typescript
const v2Middleware = (req, res, next) => {
  if (config.features.v2.strictValidation) {
    // Additional validation
  }
  next();
};

router.use('/v2/*', v2Middleware);
```

### 3. Version Documentation
```typescript
export const versionInfo = {
  v1: {
    status: 'deprecated',
    endOfLife: '2024-12-31',
    documentation: '/docs/v1'
  },
  v2: {
    status: 'current',
    releaseDate: '2024-01-01',
    documentation: '/docs/v2'
  }
};
``` 