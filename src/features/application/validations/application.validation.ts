import Joi from 'joi';
import { JoiAuthBearer, JoiObjectId } from '../../../helpers/validator';

export class ApplicationValidation {
  static create = Joi.object({
    // Add validation for create fields
  });

  static update = Joi.object({
    // Add validation for update fields
  });

  static id = Joi.object({
    id: JoiObjectId().required(),
  });

  static auth = Joi.object({
    authorization: JoiAuthBearer().required(),
  });

  static query = Joi.object({
    page: Joi.number().optional(),
    limit: Joi.number().optional(),
    // Add other query params
  });
}