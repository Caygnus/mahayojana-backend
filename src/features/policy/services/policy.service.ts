import { IPolicyService } from '../interfaces/i-policy.service';
import { IPolicyRepository } from '../interfaces/i-policy.repository';
import { PolicyRepository } from '../repositories/policy.repository';
import { CreatePolicyDTO } from '../dtos/create-policy.dto';
import { UpdatePolicyDTO } from '../dtos/update-policy.dto';
import { Policy } from '../entities/policy.entity';

export class PolicyService implements IPolicyService {
  private repository: IPolicyRepository;

  constructor() {
    this.repository = new PolicyRepository();
  }

  async create(data: CreatePolicyDTO): Promise<Policy> {
    data.validate();
    return this.repository.create(data);
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