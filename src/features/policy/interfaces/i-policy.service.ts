import { Policy } from '../entities/policy.entity';
import { CreatePolicyDTO } from '../dtos/create-policy.dto';
import { UpdatePolicyDTO } from '../dtos/update-policy.dto';

export interface IPolicyService {
  create(data: CreatePolicyDTO): Promise<Policy>;
  findById(id: string): Promise<Policy | null>;
  update(id: string, data: UpdatePolicyDTO): Promise<Policy | null>;
  delete(id: string): Promise<boolean>;
  list(filter?: Partial<Policy>): Promise<Policy[]>;
}