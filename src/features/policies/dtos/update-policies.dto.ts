import { Policies } from '../entities/policies.entity';

export class UpdatePoliciesDTO implements Partial<Policies> {
  // Add your DTO properties here

  constructor(data: Partial<UpdatePoliciesDTO>) {
    Object.assign(this, data);
  }

  validate(): void {
    // Add validation logic here
  }
}