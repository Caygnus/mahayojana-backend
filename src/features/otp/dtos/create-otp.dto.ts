import { BadRequestError } from '../../../core/ApiError';
export class CreateOtpDTO {
  phone!: string;
  constructor(data: Partial<CreateOtpDTO>) {
    Object.assign(this, data);
  }

  validate(): void {
    if (!this.phone) {
      throw new BadRequestError('Phone is required');
    }
  }
}