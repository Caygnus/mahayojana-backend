import { CreateApplicationDTO } from '../dtos/create-application.dto';
import { UpdateApplicationDTO } from '../dtos/update-application.dto';
import { Application } from '../entities/application.entity';

export interface IApplicationRepository {
  // Add custom repository methods here
  createApplication(data: CreateApplicationDTO): Promise<Application>;
  updateApplication(
    id: string,
    data: UpdateApplicationDTO,
  ): Promise<Application | null>;
  deleteApplication(id: string): Promise<boolean>;
  listApplications(filter: Partial<Application>): Promise<Application[]>;
  findExistingApplication({
    title,
  }: {
    title?: string;
  }): Promise<Application | null>;
  getApplicationById({ id }: { id?: string }): Promise<Application | null>;
}
