import { Policies } from '../entities/policies.entity';

export class CreatePoliciesDTO implements Partial<Policies> {
  // Add your DTO properties here

  constructor(data: Partial<CreatePoliciesDTO>) {
    Object.assign(this, data);
  }

  validate(): void {
    // Add validation logic here
  }
}