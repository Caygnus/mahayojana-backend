import { Policy } from '../entities/policy.entity';
import { PolicyModel, IPolicyDocument } from '../models/policy.model';
import { IPolicyRepository } from '../interfaces/i-policy.repository';
import { PolicyMapper } from '../mappers/policy.mapper';
import { FilterQuery } from 'mongoose';

export class PolicyRepository implements IPolicyRepository {
  async create(data: Partial<Policy>): Promise<Policy> {
    const modelData = PolicyMapper.toModel(data);
    const created = await PolicyModel.create(modelData);
    return PolicyMapper.toEntity(created);
  }

  async findById(id: string): Promise<Policy | null> {
    const found = await PolicyModel.findById(id);
    return found ? PolicyMapper.toEntity(found) : null;
  }

  async findOne(filter: Partial<Policy>): Promise<Policy | null> {
    const modelFilter = PolicyMapper.toModel(
      filter,
    ) as FilterQuery<IPolicyDocument>;
    const found = await PolicyModel.findOne(modelFilter);
    return found ? PolicyMapper.toEntity(found) : null;
  }

  async findMany(filter: Partial<Policy>): Promise<Policy[]> {
    const modelFilter = PolicyMapper.toModel(
      filter,
    ) as FilterQuery<IPolicyDocument>;
    const found = await PolicyModel.find(modelFilter);
    return PolicyMapper.toEntities(found);
  }

  async update(id: string, data: Partial<Policy>): Promise<Policy | null> {
    const modelData = PolicyMapper.toModel(data);
    const updated = await PolicyModel.findByIdAndUpdate(id, modelData, {
      new: true,
    });
    return updated ? PolicyMapper.toEntity(updated) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await PolicyModel.findByIdAndDelete(id);
    return !!result;
  }

  async exists(filter: Partial<Policy>): Promise<boolean> {
    const modelFilter = PolicyMapper.toModel(
      filter,
    ) as FilterQuery<IPolicyDocument>;
    const result = await PolicyModel.exists(modelFilter);
    return !!result;
  }
}
