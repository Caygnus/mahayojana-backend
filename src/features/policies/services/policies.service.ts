import { IPoliciesService } from '../interfaces/i-policies.service';
import { IPoliciesRepository } from '../interfaces/i-policies.repository';
import { PoliciesRepository } from '../repositories/policies.repository';
import { CreatePoliciesDTO } from '../dtos/create-policies.dto';
import { UpdatePoliciesDTO } from '../dtos/update-policies.dto';
import { Policies } from '../entities/policies.entity';
import { NotFoundError } from '../../../core/ApiError';
import { IPoliciesDocument, PoliciesModel } from '../models/policies.model';

export class PoliciesService implements IPoliciesService {
  private repository: IPoliciesRepository;

  constructor() {
    this.repository = new PoliciesRepository();
  }

  async create(policy: Partial<Policies>): Promise<Policies> {
    const created = await PoliciesModel.create(policy);
    return new Policies(created.toJSON());
  }

  async findById(id: string): Promise<Policies> {
    const policy = await PoliciesModel.findById(id);
    if (!policy) throw new NotFoundError('Policy not found');
    return new Policies(policy.toJSON());
  }

  async update(id: string, policy: Partial<Policies>): Promise<Policies> {
    const updated = await PoliciesModel.findByIdAndUpdate(
      id,
      { $set: policy },
      { new: true }
    );
    if (!updated) throw new NotFoundError('Policy not found');
    return new Policies(updated.toJSON());
  }

  async delete(id: string): Promise<void> {
    const deleted = await PoliciesModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundError('Policy not found');
  }

  async findAll(query: Record<string, any> = {}, page = 1, limit = 10): Promise<{ policies: Policies[], total: number, page: number, limit: number }> {
    const filters: Record<string, any> = {};

    if (query.policyType) filters.policyType = query.policyType;
    if (query.policyStatus) filters.policyStatus = query.policyStatus;
    if (query.title) filters.title = { $regex: query.title, $options: 'i' };

    if (query.startDate || query.endDate) {
      filters.policyStartDate = {};
      if (query.startDate) filters.policyStartDate.$gte = new Date(query.startDate);
      if (query.endDate) filters.policyStartDate.$lte = new Date(query.endDate);
    }

    if (query.dynamicFields) {
      for (const [key, value] of Object.entries(query.dynamicFields)) {
        filters[`dynamicFields.${key}`] = value;
      }
    }

    const skip = (page - 1) * limit;
    const [policies, total] = await Promise.all([
      PoliciesModel.find(filters).skip(skip).limit(limit).sort({ createdAt: -1 }),
      PoliciesModel.countDocuments(filters)
    ]);

    return {
      policies: policies.map(p => new Policies(p.toJSON())),
      total,
      page,
      limit
    };
  }

  async updateSchema(id: string, schemaDefinition: Record<string, any>): Promise<Policies> {
    const policy = await PoliciesModel.findById(id);
    if (!policy) throw new NotFoundError('Policy not found');

    policy.schemaDefinition = schemaDefinition;

    const updated = await policy.save();

    return new Policies(updated.toJSON());
  }

  async updateDynamicFields(id: string, dynamicFields: Record<string, any>): Promise<Policies> {
    const policy = await PoliciesModel.findById(id);
    if (!policy) throw new NotFoundError('Policy not found');

    const updated = await PoliciesModel.findByIdAndUpdate(
      id,
      { $set: { dynamicFields } },
      { new: true }
    );

    return new Policies(updated!.toJSON());
  }

  async list(filter?: Partial<Policies>): Promise<Policies[]> {
    return this.repository.findMany(filter || {});
  }
}