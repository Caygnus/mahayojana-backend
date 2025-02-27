export type FieldType =
  | 'string'
  | 'number'
  | 'date'
  | 'boolean'
  | 'object'
  | 'array';

// Enhanced schema definition for dynamic fields
export interface DynamicFieldDefinition {
  // Basic field properties
  type: FieldType;
  label: string;
  description?: string;

  // Validation constraints
  required?: boolean;

  // Type-specific validation
  // String validations
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  enum?: string[];

  // Number validations
  min?: number;
  max?: number;
  step?: number;

  // Array validations
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;

  // UI display properties
  displayOrder?: number;
  placeholder?: string;
  helpText?: string;
  hidden?: boolean;

  // Default value
  default?: any;

  // For dependent fields
  dependsOn?: {
    field: string;
    value: any;
  };

  // For object type fields to support nested structure
  properties?: Record<string, DynamicFieldDefinition>;

  // For array type fields
  items?: DynamicFieldDefinition;
}

export class Policies {
  id!: string;
  createdAt!: Date;
  updatedAt!: Date;
  policyNumber!: string;
  policyType!: string;
  title!: string;
  description?: string;
  policyStartDate!: Date;
  policyEndDate!: Date;
  policyStatus!: string;
  policyAmount!: number;
  policyTerm!: number;
  // Schema for dynamic fields - enhanced with more attributes
  schemaDefinition?:
    | Record<string, DynamicFieldDefinition>
    | Map<string, DynamicFieldDefinition>;
  // Actual dynamic fields data
  dynamicFields?: Record<string, any> | Map<string, any>;

  constructor(data: Partial<Policies>) {
    Object.assign(this, data);
  }

  toJSON() {
    // Handle Map conversion for schemaDefinition and dynamicFields
    const schemaDefToReturn =
      this.schemaDefinition instanceof Map
        ? Object.fromEntries(this.schemaDefinition)
        : this.schemaDefinition;

    const dynamicFieldsToReturn =
      this.dynamicFields instanceof Map
        ? Object.fromEntries(this.dynamicFields)
        : this.dynamicFields;

    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      policyNumber: this.policyNumber,
      policyType: this.policyType,
      title: this.title,
      description: this.description,
      policyStartDate: this.policyStartDate,
      policyEndDate: this.policyEndDate,
      policyStatus: this.policyStatus,
      policyAmount: this.policyAmount,
      policyTerm: this.policyTerm,
      schemaDefinition: schemaDefToReturn,
      dynamicFields: dynamicFieldsToReturn,
    };
  }
}
