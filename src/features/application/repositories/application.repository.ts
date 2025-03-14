import { Application } from '../entities/application.entity';
import { ApplicationModel } from '../models/application.model';
import { IApplicationRepository } from '../interfaces/i-application.repository';
import { ApplicationMapper } from '../mappers/application.mapper';

export class ApplicationRepository implements IApplicationRepository {
  async createApplication(data: Partial<Application>): Promise<Application> {
    const modelData = ApplicationMapper.toModel(data);
    const created = await ApplicationModel.create(modelData);
    return ApplicationMapper.toEntity(created);
  }

  async listApplications(filter: Partial<Application>): Promise<Application[]> {
    const found = await ApplicationModel.find(filter);
    return found.map(ApplicationMapper.toEntity);
  }

  async updateApplication(
    id: string,
    data: Partial<Application>,
  ): Promise<Application | null> {
    const modelData = ApplicationMapper.toModel(data);
    const updated = await ApplicationModel.findByIdAndUpdate(id, modelData, {
      new: true,
    });
    return updated ? ApplicationMapper.toEntity(updated) : null;
  }

  async deleteApplication(id: string): Promise<boolean> {
    const result = await ApplicationModel.findByIdAndDelete(id);
    return !!result;
  }

  async findExistingApplication({
      title,
    }: {
      title?: string;
  }): Promise<Application | null> {
    const result = await ApplicationModel.findOne({
      $or: [{ title }],
    });
    return result ? ApplicationMapper.toEntity(result) : null;
  }
  
  async getApplicationById({
    id,
  }: {
    id?: string;
  }): Promise<Application | null> {
    const result = await ApplicationModel.findOne({
      $or: [{ id }],
    });
    return result ? ApplicationMapper.toEntity(result) : null;
  }
  
}