import Joi from 'joi';
import { JoiAuthBearer, JoiObjectId } from '../../../helpers/validator';

// Validation for the dependency rule
const dependencySchema = Joi.object({
  field: Joi.string().required(),
  value: Joi.alternatives().try(
    Joi.string(),
    Joi.number(),
    Joi.boolean(),
    Joi.array().items(Joi.any())
  ).required()
});

// Enhanced schema for dynamic field definitions
const dynamicFieldSchema = Joi.object({
  // Basic field properties
  type: Joi.string().valid('string', 'number', 'date', 'boolean', 'object', 'array').required(),
  label: Joi.string().required(),
  description: Joi.string(),

  // Validation constraints
  required: Joi.boolean().default(false),

  // String validations
  minLength: Joi.number().integer().min(0).when('type', {
    is: 'string',
    then: Joi.number().integer().min(0),
    otherwise: Joi.forbidden()
  }),
  maxLength: Joi.number().integer().min(0).when('type', {
    is: 'string',
    then: Joi.number().integer().min(0),
    otherwise: Joi.forbidden()
  }),
  pattern: Joi.string().when('type', {
    is: 'string',
    then: Joi.string(),
    otherwise: Joi.forbidden()
  }),
  enum: Joi.array().items(Joi.any()).when('type', {
    is: 'string',
    then: Joi.array().items(Joi.string()),
    otherwise: Joi.forbidden()
  }),

  // Number validations
  min: Joi.number().when('type', {
    is: 'number',
    then: Joi.number(),
    otherwise: Joi.forbidden()
  }),
  max: Joi.number().when('type', {
    is: 'number',
    then: Joi.number(),
    otherwise: Joi.forbidden()
  }),
  step: Joi.number().positive().when('type', {
    is: 'number',
    then: Joi.number().positive(),
    otherwise: Joi.forbidden()
  }),

  // Array validations
  minItems: Joi.number().integer().min(0).when('type', {
    is: 'array',
    then: Joi.number().integer().min(0),
    otherwise: Joi.forbidden()
  }),
  maxItems: Joi.number().integer().min(0).when('type', {
    is: 'array',
    then: Joi.number().integer().min(0),
    otherwise: Joi.forbidden()
  }),
  uniqueItems: Joi.boolean().when('type', {
    is: 'array',
    then: Joi.boolean(),
    otherwise: Joi.forbidden()
  }),

  // UI display properties
  displayOrder: Joi.number().integer().min(0),
  placeholder: Joi.string(),
  helpText: Joi.string(),
  hidden: Joi.boolean(),

  // Default value - type depends on the field type
  default: Joi.any(),

  // Field dependencies
  dependsOn: dependencySchema,
});

// Additional schemas for recursive types (object and array)
const objectPropertiesSchema = Joi.object().pattern(
  Joi.string(),
  Joi.link('#dynamicField')
);

const arrayItemsSchema = Joi.link('#dynamicField');

// Add recursive references for object properties and array items
dynamicFieldSchema.id('dynamicField');
dynamicFieldSchema.append({
  properties: Joi.when('type', {
    is: 'object',
    then: objectPropertiesSchema,
    otherwise: Joi.forbidden()
  }),
  items: Joi.when('type', {
    is: 'array',
    then: arrayItemsSchema,
    otherwise: Joi.forbidden()
  })
});

export class PoliciesValidation {
  static create = Joi.object({
    policyNumber: Joi.string().required(),
    policyType: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string(),
    policyStartDate: Joi.date().required(),
    policyEndDate: Joi.date().required(),
    policyStatus: Joi.string().required(),
    policyAmount: Joi.number().required(),
    policyTerm: Joi.number().required(),
    // Enhanced schema definition for dynamic fields
    schemaDefinition: Joi.object().pattern(
      Joi.string(),
      dynamicFieldSchema
    ),
    // Dynamic fields data - still keeps unknown(true) to allow any structure
    dynamicFields: Joi.object().unknown(true)
  });

  static update = Joi.object({
    policyNumber: Joi.string(),
    policyType: Joi.string(),
    title: Joi.string(),
    description: Joi.string(),
    policyStartDate: Joi.date(),
    policyEndDate: Joi.date(),
    policyStatus: Joi.string(),
    policyAmount: Joi.number(),
    policyTerm: Joi.number(),
    // Enhanced schema definition for dynamic fields
    schemaDefinition: Joi.object().pattern(
      Joi.string(),
      dynamicFieldSchema
    ),
    // Dynamic fields data
    dynamicFields: Joi.object().unknown(true)
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
    policyType: Joi.string().optional(),
    policyStatus: Joi.string().optional(),
    title: Joi.string().optional(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
  });
}