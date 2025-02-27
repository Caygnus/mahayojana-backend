import { IBaseRepository } from '../../../core/interfaces/base.repository.interface';
import { Policies } from '../entities/policies.entity';

export interface IPoliciesRepository extends IBaseRepository<Policies> {
  // Add custom repository methods here
}