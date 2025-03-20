import Joi from 'joi';
import { JoiAuthBearer, JoiObjectId } from '../../../helpers/validator';
import { User } from '../entities/user.entity';

export class AuthValidation {
  static agentSignup = Joi.object({
    full_name: Joi.string().required(),
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

  static userSignup = Joi.object<User & { otp: string }>({
    full_name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    otp: Joi.string().required(),

    // optional fields
    address_line_1: Joi.string().optional(),
    address_line_2: Joi.string().optional(),
    city: Joi.string().optional(),
    state: Joi.string().optional(),
    pincode: Joi.string().optional(),
    country: Joi.string().optional(),
  });

  static userLogin = Joi.object<User & { otp: string }>({
    phone: Joi.string().required(),
    otp: Joi.string().required(),
  });
}
