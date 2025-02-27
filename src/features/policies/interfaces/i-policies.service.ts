import { Policies } from '../entities/policies.entity';
import { CreatePoliciesDTO } from '../dtos/create-policies.dto';
import { UpdatePoliciesDTO } from '../dtos/update-policies.dto';

export interface IPoliciesService {
  create(data: CreatePoliciesDTO): Promise<Policies>;
  findById(id: string): Promise<Policies | null>;
  update(id: string, data: UpdatePoliciesDTO): Promise<Policies | null>;
  delete(id: string): Promise<boolean>;
  list(filter?: Partial<Policies>): Promise<Policies[]>;
}