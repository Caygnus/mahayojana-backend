import { IPolicyService } from '../interfaces/i-policy.service';
import { Policy } from '../entities/policy.entity';

export class PolicyService implements IPolicyService {
  async create(data: Partial<Policy>): Promise<Policy> {
    throw new Error('Method not implemented.');
  }

  async findById(id: string): Promise<Policy | null> {
    throw new Error('Method not implemented.');
  }

  async update(id: string, data: Partial<Policy>): Promise<Policy | null> {
    throw new Error('Method not implemented.');
  }

  async delete(id: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  async list(filter?: Partial<Policy>): Promise<Policy[]> {
    throw new Error('Method not implemented.');
  }
}
