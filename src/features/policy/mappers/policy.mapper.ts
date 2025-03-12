import { Policy } from '../entities/policy.entity';
import { IPolicyDocument } from '../models/policy.model';

export class PolicyMapper {
  static toEntity(doc: IPolicyDocument): Policy {
    return new Policy({
      id: doc._id.toString(),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      // Add other fields here
    });
  }

  static toModel(entity: Partial<Policy>): Partial<IPolicyDocument> {
    const model: any = { ...entity };
    if (entity.id) {
      model._id = entity.id;
      delete model.id;
    }
    return model;
  }

  static toEntities(docs: IPolicyDocument[]): Policy[] {
    return docs.map((doc) => this.toEntity(doc));
  }

  static toModels(entities: Partial<Policy>[]): Partial<IPolicyDocument>[] {
    return entities.map((entity) => this.toModel(entity));
  }
}
