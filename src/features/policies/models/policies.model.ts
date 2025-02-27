import mongoose, { Schema, Document } from 'mongoose';
import { Policies, DynamicFieldDefinition } from '../entities/policies.entity';

export interface IPoliciesDocument extends Omit<Policies, 'toJSON' | 'toObject' | 'id'>, Document {
  _id: mongoose.Types.ObjectId;
  schemaDefinition?: Record<string, DynamicFieldDefinition> | Map<string, DynamicFieldDefinition>;
  dynamicFields?: Record<string, any> | Map<string, any>;
}

// Schema for dynamic field definition
const DynamicFieldDefinitionSchema = new Schema({
  // Basic field properties
  type: { type: String, required: true, enum: ['string', 'number', 'date', 'boolean', 'object', 'array'] },
  label: { type: String, required: true },
  description: { type: String },

  // Validation constraints
  required: { type: Boolean, default: false },

  // String validations
  minLength: { type: Number },
  maxLength: { type: Number },
  pattern: { type: String },
  enum: { type: [Schema.Types.Mixed], default: undefined },

  // Number validations
  min: { type: Number },
  max: { type: Number },
  step: { type: Number },

  // Array validations
  minItems: { type: Number },
  maxItems: { type: Number },
  uniqueItems: { type: Boolean },

  // UI display properties
  displayOrder: { type: Number },
  placeholder: { type: String },
  helpText: { type: String },
  hidden: { type: Boolean },

  // Default value
  default: { type: Schema.Types.Mixed },

  // Field dependencies
  dependsOn: {
    type: new Schema({
      field: { type: String, required: true },
      value: { type: Schema.Types.Mixed, required: true }
    }, { _id: false })
  }
}, { _id: false });

// Add recursive properties for object and array types
DynamicFieldDefinitionSchema.add({
  // For object type fields
  properties: {
    type: Map,
    of: DynamicFieldDefinitionSchema
  },
  // For array type fields
  items: {
    type: DynamicFieldDefinitionSchema
  }
});

const PoliciesSchema = new Schema({
  policyNumber: { type: String, required: true, unique: true },
  policyType: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  policyStartDate: { type: Date, required: true },
  policyEndDate: { type: Date, required: true },
  policyStatus: { type: String, required: true },
  policyAmount: { type: Number, required: true },
  policyTerm: { type: Number, required: true },
  // Schema definition for dynamic fields with enhanced schema
  schemaDefinition: {
    type: Map,
    of: DynamicFieldDefinitionSchema
  },
  // Dynamic fields data
  dynamicFields: { type: Map, of: Schema.Types.Mixed }
}, {
  timestamps: true,
  toJSON: {
    transform: (_, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Validation of dynamic fields based on schema definition
PoliciesSchema.pre('validate', function (next) {
  const doc = this as unknown as IPoliciesDocument;

  // Skip validation if there's no schema definition or dynamic fields
  if (!doc.schemaDefinition || !doc.dynamicFields) {
    return next();
  }

  const schemaDefinition = doc.schemaDefinition instanceof Map
    ? Object.fromEntries(doc.schemaDefinition)
    : doc.schemaDefinition;

  const dynamicFields = doc.dynamicFields instanceof Map
    ? Object.fromEntries(doc.dynamicFields)
    : doc.dynamicFields;

  // Validate each dynamic field against its schema definition
  for (const [field, schema] of Object.entries(schemaDefinition)) {
    const fieldSchema = schema as DynamicFieldDefinition;

    // Skip fields with unmet dependencies
    if (fieldSchema.dependsOn) {
      const dependencyField = fieldSchema.dependsOn.field;
      const dependencyValue = fieldSchema.dependsOn.value;

      if (dynamicFields[dependencyField] !== dependencyValue) {
        // Skip validation for fields with unmet dependencies
        continue;
      }
    }

    // Check required fields
    if (fieldSchema.required && (dynamicFields[field] === undefined || dynamicFields[field] === null)) {
      this.invalidate(`dynamicFields.${field}`, `${field} is required`);
      continue;
    }

    // Skip validation for undefined optional fields
    if (dynamicFields[field] === undefined) continue;

    // Type validation and specific validations per type
    const value = dynamicFields[field];
    switch (fieldSchema.type) {
      case 'string':
        if (typeof value !== 'string') {
          this.invalidate(`dynamicFields.${field}`, `${field} must be a string`);
          continue;
        }

        // String-specific validations
        if (fieldSchema.minLength !== undefined && value.length < fieldSchema.minLength) {
          this.invalidate(`dynamicFields.${field}`, `${field} must be at least ${fieldSchema.minLength} characters`);
        }

        if (fieldSchema.maxLength !== undefined && value.length > fieldSchema.maxLength) {
          this.invalidate(`dynamicFields.${field}`, `${field} must be at most ${fieldSchema.maxLength} characters`);
        }

        if (fieldSchema.pattern && !new RegExp(fieldSchema.pattern).test(value)) {
          this.invalidate(`dynamicFields.${field}`, `${field} does not match the required pattern`);
        }

        if (fieldSchema.enum && !fieldSchema.enum.includes(value)) {
          this.invalidate(`dynamicFields.${field}`, `${field} must be one of: ${fieldSchema.enum.join(', ')}`);
        }
        break;

      case 'number':
        if (typeof value !== 'number') {
          this.invalidate(`dynamicFields.${field}`, `${field} must be a number`);
          continue;
        }

        // Number-specific validations
        if (fieldSchema.min !== undefined && value < fieldSchema.min) {
          this.invalidate(`dynamicFields.${field}`, `${field} must be at least ${fieldSchema.min}`);
        }

        if (fieldSchema.max !== undefined && value > fieldSchema.max) {
          this.invalidate(`dynamicFields.${field}`, `${field} must be at most ${fieldSchema.max}`);
        }

        if (fieldSchema.step !== undefined && (value % fieldSchema.step !== 0)) {
          this.invalidate(`dynamicFields.${field}`, `${field} must be a multiple of ${fieldSchema.step}`);
        }
        break;

      case 'date':
        if (!(value instanceof Date) && isNaN(Date.parse(value))) {
          this.invalidate(`dynamicFields.${field}`, `${field} must be a valid date`);
        }
        break;

      case 'boolean':
        if (typeof value !== 'boolean') {
          this.invalidate(`dynamicFields.${field}`, `${field} must be a boolean`);
        }
        break;

      case 'array':
        if (!Array.isArray(value)) {
          this.invalidate(`dynamicFields.${field}`, `${field} must be an array`);
          continue;
        }

        // Array-specific validations
        if (fieldSchema.minItems !== undefined && value.length < fieldSchema.minItems) {
          this.invalidate(`dynamicFields.${field}`, `${field} must have at least ${fieldSchema.minItems} items`);
        }

        if (fieldSchema.maxItems !== undefined && value.length > fieldSchema.maxItems) {
          this.invalidate(`dynamicFields.${field}`, `${field} must have at most ${fieldSchema.maxItems} items`);
        }

        if (fieldSchema.uniqueItems === true && new Set(value).size !== value.length) {
          this.invalidate(`dynamicFields.${field}`, `${field} must have unique items`);
        }

        // Validate array items if items schema is defined
        if (fieldSchema.items && value.length > 0) {
          value.forEach((item, index) => {
            validateNestedValue(item, fieldSchema.items!, `${field}[${index}]`, this);
          });
        }
        break;

      case 'object':
        if (typeof value !== 'object' || value === null || Array.isArray(value)) {
          this.invalidate(`dynamicFields.${field}`, `${field} must be an object`);
          continue;
        }

        // Validate object properties if properties schema is defined
        if (fieldSchema.properties) {
          for (const [propKey, propSchema] of Object.entries(fieldSchema.properties)) {
            if (propSchema.required && (value[propKey] === undefined || value[propKey] === null)) {
              this.invalidate(`dynamicFields.${field}.${propKey}`, `${propKey} is required`);
              continue;
            }

            if (value[propKey] !== undefined) {
              validateNestedValue(value[propKey], propSchema, `${field}.${propKey}`, this);
            }
          }
        }
        break;
    }
  }

  next();
});

// Helper function to validate nested values (for objects and arrays)
function validateNestedValue(
  value: any,
  schema: DynamicFieldDefinition,
  path: string,
  context: mongoose.Document
) {
  // Basic type validation
  switch (schema.type) {
    case 'string':
      if (typeof value !== 'string') {
        context.invalidate(`dynamicFields.${path}`, `${path} must be a string`);
        return;
      }

      // String-specific validations
      if (schema.minLength !== undefined && value.length < schema.minLength) {
        context.invalidate(`dynamicFields.${path}`, `${path} must be at least ${schema.minLength} characters`);
      }

      if (schema.maxLength !== undefined && value.length > schema.maxLength) {
        context.invalidate(`dynamicFields.${path}`, `${path} must be at most ${schema.maxLength} characters`);
      }

      if (schema.pattern && !new RegExp(schema.pattern).test(value)) {
        context.invalidate(`dynamicFields.${path}`, `${path} does not match the required pattern`);
      }

      if (schema.enum && !schema.enum.includes(value)) {
        context.invalidate(`dynamicFields.${path}`, `${path} must be one of: ${schema.enum.join(', ')}`);
      }
      break;

    case 'number':
      if (typeof value !== 'number') {
        context.invalidate(`dynamicFields.${path}`, `${path} must be a number`);
        return;
      }

      // Number-specific validations
      if (schema.min !== undefined && value < schema.min) {
        context.invalidate(`dynamicFields.${path}`, `${path} must be at least ${schema.min}`);
      }

      if (schema.max !== undefined && value > schema.max) {
        context.invalidate(`dynamicFields.${path}`, `${path} must be at most ${schema.max}`);
      }
      break;

    case 'date':
      if (!(value instanceof Date) && isNaN(Date.parse(value))) {
        context.invalidate(`dynamicFields.${path}`, `${path} must be a valid date`);
      }
      break;

    case 'boolean':
      if (typeof value !== 'boolean') {
        context.invalidate(`dynamicFields.${path}`, `${path} must be a boolean`);
      }
      break;

    // Add validation for other types as needed
  }
}

export const PoliciesModel = mongoose.model<IPoliciesDocument>('Policies', PoliciesSchema);