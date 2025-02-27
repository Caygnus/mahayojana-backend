import { Policies } from '../entities/policies.entity';
import { IPoliciesDocument } from '../models/policies.model';

export class PoliciesMapper {
  static toEntity(doc: IPoliciesDocument): Policies {
    return new Policies({
      id: doc._id.toString(),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      // Add other fields here
    });
  }

  static toModel(entity: Partial<Policies>): Partial<IPoliciesDocument> {
    const model: any = { ...entity };
    if (entity.id) {
      model._id = entity.id;
      delete model.id;
    }
    return model;
  }

  static toEntities(docs: IPoliciesDocument[]): Policies[] {
    return docs.map(doc => this.toEntity(doc));
  }

  static toModels(entities: Partial<Policies>[]): Partial<IPoliciesDocument>[] {
    return entities.map(entity => this.toModel(entity));
  }
}