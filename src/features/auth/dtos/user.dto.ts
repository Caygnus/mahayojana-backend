import { BadRequestError } from '../../../core/ApiError';
import { User } from '../entities/user.entity';

export class CreateUserDTO implements Partial<User> {
  full_name!: string;
  email!: string;
  phone!: string;
  adhaar?: string;
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  otp!: string;

  constructor(data: Partial<CreateUserDTO>) {
    Object.assign(this, data);
  }

  validate(): void {
    if (!this.full_name) throw new BadRequestError('Full name is required');
    if (!this.email) throw new BadRequestError('Email is required');
    if (!this.phone) throw new BadRequestError('Phone is required');
    if (!this.otp) throw new BadRequestError('OTP is required');
  }
}

export class LoginUserDTO implements Partial<User> {
  phone!: string;
  otp!: string;

  constructor(data: Partial<LoginUserDTO>) {
    Object.assign(this, data);
  }

  validate(): void {
    if (!this.phone) throw new BadRequestError('Phone is required');
    if (!this.otp) throw new BadRequestError('OTP is required');
  }
}
