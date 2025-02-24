# Developer Onboarding Guide

## Project Structure Overview

```
src/
├── features/          # All features/modules of the application
│   ├── auth/          # Authentication feature
│   │   ├── entities/  # Business objects
│   │   ├── dtos/      # Data Transfer Objects
│   │   ├── models/    # Database models
│   │   ├── services/  # Business logic
│   │   ├── routes/    # Route definitions
│   │   └── controllers/ # Request handlers
│   └── other-feature/
├── core/              # Core business logic
├── utils/             # Shared utilities
├── types/             # Type definitions
└── config/            # Configuration files

```

## Adding a New Feature

Let's create a complete example using Phone OTP Authentication feature.

### 1. Create Feature Structure

First, create the feature directory structure:

```bash
src/features/auth/
├── entities/          # Business objects
│   └── otp.entity.ts
├── dtos/             # Request/Response objects
│   ├── send-otp.dto.ts
│   └── verify-otp.dto.ts
├── models/           # Database models
│   └── otp.model.ts
├── services/         # Business logic
│   └── auth.service.ts
├── controllers/      # Request handlers
│   └── auth.controller.ts
└── routes/          # Route definitions
    └── auth.routes.ts
```

### 2. Define Entity

```typescript
// src/features/auth/entities/otp.entity.ts
export enum OTPPurpose {
  SIGNUP = 'signup',
  LOGIN = 'login'
}

export class OTP {
  id: string;
  phone: string;
  code: string;
  purpose: OTPPurpose;
  isUsed: boolean;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<OTP>) {
    Object.assign(this, data);
  }

  isValid(): boolean {
    return !this.isUsed && new Date() < this.expiresAt;
  }
}
```

### 3. Create DTOs

```typescript
// src/features/auth/dtos/send-otp.dto.ts
export class SendOTPDTO {
  phone: string;
  purpose: OTPPurpose;

  constructor(data: Partial<SendOTPDTO>) {
    Object.assign(this, data);
  }
}

// src/features/auth/dtos/verify-otp.dto.ts
export class VerifyOTPDTO {
  phone: string;
  code: string;
  purpose: OTPPurpose;

  constructor(data: Partial<VerifyOTPDTO>) {
    Object.assign(this, data);
  }
}
```

### 4. Define Database Model

```typescript
// src/features/auth/models/otp.model.ts
import mongoose, { Schema } from 'mongoose';
import { OTP, OTPPurpose } from '../entities/otp.entity';

const OTPSchema = new Schema({
  phone: { type: String, required: true },
  code: { type: String, required: true },
  purpose: {
    type: String,
    enum: Object.values(OTPPurpose),
    required: true
  },
  isUsed: { type: Boolean, default: false },
  expiresAt: { type: Date, required: true }
}, {
  timestamps: true
});

// Indexes for performance
OTPSchema.index({ phone: 1, purpose: 1 });
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

export const OTPModel = mongoose.model<OTP>('OTP', OTPSchema);
```

### 5. Implement Service

```typescript
// src/features/auth/services/auth.service.ts
import { OTPModel } from '../models/otp.model';
import { SendOTPDTO } from '../dtos/send-otp.dto';
import { VerifyOTPDTO } from '../dtos/verify-otp.dto';
import { OTP } from '../entities/otp.entity';

export class AuthService {
  async sendOTP(data: SendOTPDTO): Promise<{ requestId: string }> {
    // Generate 6 digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiry to 10 minutes
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    const otp = await OTPModel.create({
      phone: data.phone,
      code,
      purpose: data.purpose,
      expiresAt
    });

    // TODO: Integrate with SMS service
    console.log(`OTP for ${data.phone}: ${code}`);

    return { requestId: otp.id };
  }

  async verifyOTP(data: VerifyOTPDTO): Promise<boolean> {
    const otp = await OTPModel.findOne({
      phone: data.phone,
      code: data.code,
      purpose: data.purpose,
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });

    if (!otp) {
      return false;
    }

    // Mark OTP as used
    otp.isUsed = true;
    await otp.save();

    return true;
  }
}
```

### 6. Create Controller

```typescript
// src/features/auth/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { SendOTPDTO } from '../dtos/send-otp.dto';
import { VerifyOTPDTO } from '../dtos/verify-otp.dto';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async sendOTP(req: Request, res: Response) {
    try {
      const data = new SendOTPDTO(req.body);
      const result = await this.authService.sendOTP(data);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async verifyOTP(req: Request, res: Response) {
    try {
      const data = new VerifyOTPDTO(req.body);
      const isValid = await this.authService.verifyOTP(data);
      
      if (!isValid) {
        return res.status(400).json({ error: 'Invalid OTP' });
      }

      res.json({ message: 'OTP verified successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
```

### 7. Define Routes

```typescript
// src/features/auth/routes/auth.routes.ts
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();
const authController = new AuthController();

router.post('/otp/send', (req, res) => authController.sendOTP(req, res));
router.post('/otp/verify', (req, res) => authController.verifyOTP(req, res));

export default router;
```

### 8. Register Routes

```typescript
// src/app.ts
import express from 'express';
import authRoutes from './features/auth/routes/auth.routes';

const app = express();
app.use(express.json());

// Register routes
app.use('/api/auth', authRoutes);
```

## Request Flow

The request flows through the application in this order:

```
Request → Route → Controller → Service → Model → Database
Response ← Controller ← Service ← Model ← Database
```

Example flow for sending OTP:
1. Client sends POST request to `/api/auth/otp/send`
2. Route handler directs to `AuthController.sendOTP`
3. Controller creates DTO from request body
4. Service generates OTP and saves using Model
5. Response flows back through the same layers

## Best Practices

1. **DTOs vs Entities**
   - DTOs: For request/response data
   - Entities: For business logic and database

2. **Validation**
   ```typescript
   // In controller
   if (!data.phone) {
     throw new Error('Phone is required');
   }
   ```

3. **Error Handling**
   ```typescript
   try {
     // Operation
   } catch (error) {
     res.status(400).json({ error: error.message });
   }
   ```

4. **File Naming**
   - Use `.entity.ts` for entities
   - Use `.dto.ts` for DTOs
   - Use `.model.ts` for database models
   - Use `.service.ts` for services
   - Use `.controller.ts` for controllers
   - Use `.routes.ts` for routes

## Testing Your Feature

Test your endpoints using curl or Postman:

```bash
# Send OTP
curl -X POST http://localhost:3000/api/auth/otp/send \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919876543210", "purpose": "login"}'

# Verify OTP
curl -X POST http://localhost:3000/api/auth/otp/verify \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919876543210", "code": "123456", "purpose": "login"}'
```

## Adding New Features

To add a new feature:

1. Create feature directory in `src/features/`
2. Copy this structure:
   ```
   new-feature/
   ├── entities/
   ├── dtos/
   ├── models/
   ├── services/
   ├── controllers/
   └── routes/
   ```
3. Implement each layer
4. Register routes in `app.ts`

## Common Pitfalls to Avoid

1. Don't mix business logic in controllers
2. Keep entities focused on business rules
3. Use DTOs for input validation
4. Handle errors consistently
5. Keep services single-responsibility
6. Use meaningful variable and function names

## Next Steps

1. Add input validation
2. Implement proper error handling
3. Add authentication middleware
4. Add request logging
5. Implement rate limiting
6. Add API documentation 