import { Application } from '../entities/application.entity';
import { IApplicationDocument } from '../models/application.model';

export class ApplicationMapper {
  static toEntity(doc: IApplicationDocument): Application {
    return new Application({
      id: doc._id.toString(),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      // Add other fields here
    });
  }

  static toModel(entity: Partial<Application>): Partial<IApplicationDocument> {
    const model: any = { ...entity };
    if (entity.id) {
      model._id = entity.id;
      delete model.id;
    }
    return model;
  }

  static toEntities(docs: IApplicationDocument[]): Application[] {
    return docs.map((doc) => this.toEntity(doc));
  }

  static toModels(
    entities: Partial<Application>[],
  ): Partial<IApplicationDocument>[] {
    return entities.map((entity) => this.toModel(entity));
  }
}
