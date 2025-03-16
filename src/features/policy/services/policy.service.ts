import { IPolicyService } from '../interfaces/i-policy.service';
import { IPolicyRepository } from '../interfaces/i-policy.repository';
import { PolicyRepository } from '../repositories/policy.repository';
import { CreatePolicyDTO } from '../dtos/create-policy.dto';
import { UpdatePolicyDTO } from '../dtos/update-policy.dto';
import { Policy, PolicyStatus } from '../entities/policy.entity';

export class PolicyService implements IPolicyService {
  private repository: IPolicyRepository;

  constructor() {
    this.repository = new PolicyRepository();
  }

  async create(data: CreatePolicyDTO): Promise<Policy> {
    data.validate();

    const newPolicy = new Policy({
      title: data.title,
      description: data.description,
      fields: data.fields,
      policy_type: data.policy_type,
      filling_charge: data.filling_charge,
      currency: data.currency,
      discount_percentage: data.discount_percentage,
      discount_amount: data.discount_amount,
      tax_percentage: data.tax_percentage,
      tax_amount: data.tax_amount,
      agent_commission_percentage: data.agent_commission_percentage,
      agent_commission_amount: data.agent_commission_amount,
      agent_commission_allowed: data.agent_commission_allowed,
      expiration_date: data.expiration_date,
      rules: data.rules,
      benefits: data.benefits,
      status: PolicyStatus.ACTIVE,
    });

    return this.repository.create(newPolicy);
  }

  async findById(id: string): Promise<Policy | null> {
    return this.repository.findById(id);
  }

  async update(id: string, data: UpdatePolicyDTO): Promise<Policy | null> {
    data.validate();
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }

  async list(filter?: Partial<Policy>): Promise<Policy[]> {
    return this.repository.findMany(filter || {});
  }
}
