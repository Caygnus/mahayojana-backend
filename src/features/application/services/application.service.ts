import { IApplicationService } from '../interfaces/i-application.service';
import { IApplicationRepository } from '../interfaces/i-application.repository';
import { ApplicationRepository } from '../repositories/application.repository';
import { CreateApplicationDTO } from '../dtos/create-application.dto';
import { UpdateApplicationDTO } from '../dtos/update-application.dto';
import { Application } from '../entities/application.entity';
import { BadRequestError } from '../../../core/ApiError';

export class ApplicationService implements IApplicationService {
  private repository: IApplicationRepository;

  constructor() {
    this.repository = new ApplicationRepository();
  }

  async createApplication(data: CreateApplicationDTO): Promise<Application> {
    data.validate();

    const existingApplication = await this.repository.findExistingApplication({
      title: data.title,
    });

    if (existingApplication) {
      throw new BadRequestError('Application already exists');
    }
    
    const Application =  this.repository.createApplication(data);
    return Application;
  }

  async updateApplication(
    id: string,
    data: UpdateApplicationDTO,
  ): Promise<Application | null> {
    data.validate();

    const existingApplication = await this.repository.getApplicationById({ id });
  
    if (!existingApplication) {
      throw new BadRequestError('Application not found');
    }

    const updatedData = new UpdateApplicationDTO({
      ...existingApplication,
      ...data,
      fields: data.fields || existingApplication.fields
    });

    updatedData.validate();

    const Application =  this.repository.updateApplication(id, updatedData);
    return Application;
  }

  async deleteApplication(id: string): Promise<boolean> {
    return this.repository.deleteApplication(id);
  }

  async listApplications(
    filter?: Partial<Application>,
  ): Promise<Application[]> {
    const Application =  this.repository.listApplications(filter || {});
    return Application;
  }
}
