import { Application } from '../entities/application.entity';
import { CreateApplicationDTO } from '../dtos/create-application.dto';
import { UpdateApplicationDTO } from '../dtos/update-application.dto';

export interface IApplicationService {
  // agent
  createApplication(data: CreateApplicationDTO): Promise<Application>;
  updateApplication(
    id: string,
    data: UpdateApplicationDTO,
  ): Promise<Application | null>;
  deleteApplication(id: string): Promise<boolean>;
  listApplications(filter: Partial<Application>): Promise<Application[]>;
}
