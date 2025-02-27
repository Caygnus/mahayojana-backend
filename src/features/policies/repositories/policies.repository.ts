import { Policies } from '../entities/policies.entity';
import { PoliciesModel, IPoliciesDocument } from '../models/policies.model';
import { IPoliciesRepository } from '../interfaces/i-policies.repository';
import { PoliciesMapper } from '../mappers/policies.mapper';
import { FilterQuery } from 'mongoose';

export class PoliciesRepository implements IPoliciesRepository {
  async create(data: Partial<Policies>): Promise<Policies> {
    const modelData = PoliciesMapper.toModel(data);
    const created = await PoliciesModel.create(modelData);
    return PoliciesMapper.toEntity(created);
  }

  async findById(id: string): Promise<Policies | null> {
    const found = await PoliciesModel.findById(id);
    return found ? PoliciesMapper.toEntity(found) : null;
  }

  async findOne(filter: Partial<Policies>): Promise<Policies | null> {
    const modelFilter = PoliciesMapper.toModel(filter) as FilterQuery<IPoliciesDocument>;
    const found = await PoliciesModel.findOne(modelFilter);
    return found ? PoliciesMapper.toEntity(found) : null;
  }

  async findMany(filter: Partial<Policies>): Promise<Policies[]> {
    const modelFilter = PoliciesMapper.toModel(filter) as FilterQuery<IPoliciesDocument>;
    const found = await PoliciesModel.find(modelFilter);
    return PoliciesMapper.toEntities(found);
  }

  async update(id: string, data: Partial<Policies>): Promise<Policies | null> {
    const modelData = PoliciesMapper.toModel(data);
    const updated = await PoliciesModel.findByIdAndUpdate(id, modelData, { new: true });
    return updated ? PoliciesMapper.toEntity(updated) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await PoliciesModel.findByIdAndDelete(id);
    return !!result;
  }

  async exists(filter: Partial<Policies>): Promise<boolean> {
    const modelFilter = PoliciesMapper.toModel(filter) as FilterQuery<IPoliciesDocument>;
    const result = await PoliciesModel.exists(modelFilter);
    return !!result;
  }
}