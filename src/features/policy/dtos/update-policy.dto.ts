import { BadRequestError } from '../../../core/ApiError';
import { Policy, PolicyField, PolicyStatus } from '../entities/policy.entity';

export class UpdatePolicyDTO implements Partial<Policy> {
  // Add your DTO properties here
  id!: string;
  title!: string;
  description!: string;
  fields!: PolicyField[];
  status!: PolicyStatus;

  constructor(data: Partial<UpdatePolicyDTO>) {
    Object.assign(this, data);
  }

  validate(): void {
    // Add validation logic here
    if (!this.id) throw new BadRequestError('Id is required');
  }
}
