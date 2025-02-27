import { Otp } from '../entities/otp.entity';
import { IOtpDocument } from '../models/otp.model';

export class OtpMapper {
  static toEntity(doc: IOtpDocument): Otp {
    return new Otp({
      id: doc._id.toString(),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      phone: doc.phone,
      code: doc.code,
      expiresAt: doc.expiresAt,
    });
  }

  static toModel(entity: Partial<Otp>): Partial<IOtpDocument> {
    const model: any = { ...entity };
    if (entity.id) {
      model._id = entity.id;
      delete model.id;
    }
    return model;
  }

  static toEntities(docs: IOtpDocument[]): Otp[] {
    return docs.map((doc) => this.toEntity(doc));
  }

  static toModels(entities: Partial<Otp>[]): Partial<IOtpDocument>[] {
    return entities.map((entity) => this.toModel(entity));
  }
}
