import { IBaseRepository } from '../../../core/interfaces/base.repository.interface';
import { Policy } from '../entities/policy.entity';

export interface IPolicyRepository extends IBaseRepository<Policy> {
  // Add custom repository methods here
}
