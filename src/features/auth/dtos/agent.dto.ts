import { BadRequestError } from '../../../core/ApiError';
import { Agent } from '../entities/agent.entity';

export class CreateAgentDTO implements Partial<Agent> {
  name!: string;
  email!: string;
  phone!: string;
  adhaar!: string;
  address?: string;
  otp!: string;

  constructor(data: Partial<CreateAgentDTO>) {
    Object.assign(this, data);
  }

  validate(): void {
    if (!this.name) throw new BadRequestError('Name is required');
    if (!this.email) throw new BadRequestError('Email is required');
    if (!this.phone) throw new BadRequestError('Phone is required');
    if (!this.adhaar) throw new BadRequestError('Adhaar is required');
    if (!this.otp) throw new BadRequestError('OTP is required');
  }
}

export class LoginAgentDTO implements Partial<Agent> {
  phone!: string;
  otp!: string;

  constructor(data: Partial<LoginAgentDTO>) {
    Object.assign(this, data);
  }

  validate(): void {
    if (!this.phone) throw new BadRequestError('Phone is required');
    if (!this.otp) throw new BadRequestError('OTP is required');
  }

}