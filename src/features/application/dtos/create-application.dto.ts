import { Application, Field } from '../entities/application.entity';
import { BadRequestError } from '../../../core/ApiError';

export class CreateApplicationDTO implements Partial<Application> {
  title!: string;
  description!: string;
  rules!: string[];
  is_active!: boolean;
  expiry_date!: Date;
  fields!: Field[];

  constructor(data: Partial<CreateApplicationDTO>) {
    Object.assign(this, data);
  }

  validate(): void {
    if (!this.title) {
      throw new BadRequestError('Title is required');
    }
    if (!this.description) {
      throw new BadRequestError('Description is required');
    }
    if (!this.rules) {
      throw new BadRequestError('Rules are required');
    }
    if (!this.expiry_date) {
      throw new BadRequestError('Expiry date is required');
    }
  }
}
