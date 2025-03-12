import Joi from 'joi';
import { JoiAuthBearer, JoiObjectId } from '../../../helpers/validator';
import { CreatePolicyDTO } from '../dtos/create-policy.dto';


export class PolicyValidation {
  static create = Joi.object<CreatePolicyDTO>({
    title: Joi.string().required(),
    description: Joi.string(),
    fields: Joi.array().items(Joi.object({
      name: Joi.string().required(),
      field_id: Joi.string().required(),
      field_type: Joi.string().required(),
      field_label: Joi.string().required(),
      field_placeholder: Joi.string(),
      field_description: Joi.string(),
      field_options: Joi.array().items(Joi.string()),
      field_default_value: Joi.string(),
      field_regex: Joi.string(),
      field_regex_message: Joi.string(),
      field_min_length: Joi.number(),
      field_max_length: Joi.number(),
      field_min_value: Joi.number(),
      field_max_value: Joi.number(),
      field_required: Joi.boolean(),
    })),
    policy_type: Joi.string(),
    filling_charge: Joi.number(),
    currency: Joi.string(),
    discount_percentage: Joi.number(),
    discount_amount: Joi.number(),
    tax_percentage: Joi.number(),
    tax_amount: Joi.number(),
    agent_commission_percentage: Joi.number(),
    agent_commission_amount: Joi.number(),
    agent_commission_allowed: Joi.boolean(),
    expiration_date: Joi.date(),
    rules: Joi.array().items(Joi.string()),
    benefits: Joi.array().items(Joi.string()),
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
    page: Joi.number(),
    limit: Joi.number(),
    // Add other query params
  });
}