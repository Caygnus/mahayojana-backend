import { Role } from './role.entity';

export class Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  aadharNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  isVerified: boolean;
  isActive: boolean;
  roles: Role[];
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;

  constructor(partial: Partial<Agent>) {
    Object.assign(this, partial);
  }

  get isPhoneVerified(): boolean {
    return this.isVerified;
  }
} 