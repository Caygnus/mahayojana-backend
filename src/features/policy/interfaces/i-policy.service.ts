import { Policy } from '../entities/policy.entity';

export interface IPolicyService {
  create(data: Partial<Policy>): Promise<Policy>;
  findById(id: string): Promise<Policy | null>;
  update(id: string, data: Partial<Policy>): Promise<Policy | null>;
  delete(id: string): Promise<boolean>;
  list(filter?: Partial<Policy>): Promise<Policy[]>;
}