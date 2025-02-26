import { Auth } from '../entities/auth.entity';
import { IAuthDocument } from '../models/auth.model';

export class AuthMapper {
  static toEntity(doc: IAuthDocument): Auth {
    return new Auth({
      id: doc._id.toString(),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      // Add other fields here
    });
  }

  static toModel(entity: Partial<Auth>): Partial<IAuthDocument> {
    const model: any = { ...entity };
    if (entity.id) {
      model._id = entity.id;
      delete model.id;
    }
    return model;
  }

  static toEntities(docs: IAuthDocument[]): Auth[] {
    return docs.map(doc => this.toEntity(doc));
  }

  static toModels(entities: Partial<Auth>[]): Partial<IAuthDocument>[] {
    return entities.map(entity => this.toModel(entity));
  }
}