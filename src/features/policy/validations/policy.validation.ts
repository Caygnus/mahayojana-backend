import Joi from 'joi';
import { JoiAuthBearer, JoiObjectId } from '../../../helpers/validator';
import { CreatePolicyDTO } from '../dtos/create-policy.dto';

export class PolicyValidation {
  static create = Joi.object<CreatePolicyDTO>({
    title: Joi.string().required().messages({
      'string.empty': 'Title cannot be empty',
      'any.required': 'Title is required',
      'string.base': 'Title must be a text value',
    }),
    description: Joi.string().messages({
      'string.base': 'Description must be a text value',
    }),
    fields: Joi.array().items(
      Joi.object({
        name: Joi.string().required().messages({
          'string.empty': 'Field name cannot be empty',
          'any.required': 'Field name is required',
        }),
        field_id: Joi.string().required().messages({
          'string.empty': 'Field ID cannot be empty',
          'any.required': 'Field ID is required',
        }),
        field_type: Joi.string()
          .required()
          .valid(
            'text',
            'number',
            'date',
            'select',
            'radio',
            'checkbox',
            'textarea',
            'email',
            'phone',
            'password',
            'file',
          )
          .messages({
            'string.empty': 'Field type cannot be empty',
            'any.required': 'Field type is required',
            'any.only':
              'Field type must be one of: text, number, date, select, radio, checkbox, textarea, email, phone, password, file',
          }),
        field_label: Joi.string().required().messages({
          'string.empty': 'Field label cannot be empty',
          'any.required': 'Field label is required',
        }),
        field_placeholder: Joi.string(),
        field_description: Joi.string(),
        field_options: Joi.array().items(Joi.string()),
        field_default_value: Joi.string(),
        field_regex: Joi.string(),
        field_regex_message: Joi.string(),
        field_min_length: Joi.number().messages({
          'number.base': 'Minimum length must be a number',
        }),
        field_max_length: Joi.number().messages({
          'number.base': 'Maximum length must be a number',
        }),
        field_min_value: Joi.number().messages({
          'number.base': 'Minimum value must be a number',
        }),
        field_max_value: Joi.number().messages({
          'number.base': 'Maximum value must be a number',
        }),
        field_required: Joi.boolean().messages({
          'boolean.base': 'Field required must be true or false',
        }),
      }),
    ),
    policy_type: Joi.string().messages({
      'string.base': 'Policy type must be a text value',
    }),
    filling_charge: Joi.number().messages({
      'number.base': 'Filling charge must be a number',
    }),
    currency: Joi.string().messages({
      'string.base': 'Currency must be a text value',
    }),
    discount_percentage: Joi.number().min(0).max(100).messages({
      'number.base': 'Discount percentage must be a number',
      'number.min': 'Discount percentage cannot be less than 0',
      'number.max': 'Discount percentage cannot be more than 100',
    }),
    discount_amount: Joi.number().min(0).messages({
      'number.base': 'Discount amount must be a number',
      'number.min': 'Discount amount cannot be negative',
    }),
    tax_percentage: Joi.number().min(0).max(100).messages({
      'number.base': 'Tax percentage must be a number',
      'number.min': 'Tax percentage cannot be less than 0',
      'number.max': 'Tax percentage cannot be more than 100',
    }),
    tax_amount: Joi.number().min(0).messages({
      'number.base': 'Tax amount must be a number',
      'number.min': 'Tax amount cannot be negative',
    }),
    agent_commission_percentage: Joi.number().min(0).max(100).messages({
      'number.base': 'Agent commission percentage must be a number',
      'number.min': 'Agent commission percentage cannot be less than 0',
      'number.max': 'Agent commission percentage cannot be more than 100',
    }),
    agent_commission_amount: Joi.number().min(0).messages({
      'number.base': 'Agent commission amount must be a number',
      'number.min': 'Agent commission amount cannot be negative',
    }),
    agent_commission_allowed: Joi.boolean().messages({
      'boolean.base': 'Agent commission allowed must be true or false',
    }),
    expiration_date: Joi.date().messages({
      'date.base': 'Expiration date must be a valid date',
    }),
    rules: Joi.array().items(
      Joi.string().messages({
        'string.base': 'Each rule must be a text value',
      }),
    ),
    benefits: Joi.array().items(
      Joi.string().messages({
        'string.base': 'Each benefit must be a text value',
      }),
    ),
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
