import { Policy, PolicyField, PolicyStatus } from '../entities/policy.entity';

export class CreatePolicyDTO implements Partial<Policy> {
  id!: string;
  title!: string;
  description?: string;
  fields?: PolicyField[];
  policy_type!: string;
  filling_charge?: number;
  currency?: string;
  discount_percentage?: number;
  discount_amount?: number;
  tax_percentage?: number;
  tax_amount?: number;
  agent_commission_percentage?: number;
  agent_commission_amount?: number;
  agent_commission_allowed?: boolean;
  expiration_date?: Date;
  rules?: string[];
  benefits?: string[];
  
  constructor(data: Partial<CreatePolicyDTO>) {
    Object.assign(this, data);
  }

  validate(): void {
    // Add validation logic here
  }
} 