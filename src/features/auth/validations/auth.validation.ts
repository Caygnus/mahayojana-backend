import Joi from 'joi';
import { JoiAuthBearer, JoiObjectId } from '../../../helpers/validator';

export class AuthValidation {
  static agentSignup = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    adhaar: Joi.string().required(),
    otp: Joi.string().required(),
  });

  static agentLogin = Joi.object({
    phone: Joi.string().required(),
    otp: Joi.string().required(),
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
