
export enum PolicyStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  EXPIRED = 'expired',
}

export enum PolicyFieldType {
  TEXT = 'text',
  NUMBER = 'number',
  DATE = 'date',
  BOOLEAN = 'boolean',
  SELECT = 'select',
  MULTI_SELECT = 'multi_select',
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  TEXTAREA = 'textarea',
  FILE = 'file',
  IMAGE = 'image',
}


export interface PolicyField {
  name: string;
  field_id: string;
  field_type: PolicyFieldType;
  field_label?: string;
  field_placeholder?: string;
  field_description?: string;
  field_options?: string[];
  field_default_value?: string;
  field_required?: boolean;

  // these refers to string fields
  field_min_length?: number;
  field_max_length?: number;

  // these refers to number fields
  field_min_value?: number;
  field_max_value?: number;

  // these refers to regex fields
  field_regex?: string;
  field_regex_message?: string;
}




export class Policy {

  // required fields
  id!: string;
  title!: string;
  description!: string;
  rules!: string[];
  benefits!: string[];
  expiration_date!: Date;
  status!: PolicyStatus;
  created_by!: string;
  policy_type!: string;

  // pricing fields
  filling_charge?: number;
  currency?: string;
  discount_percentage?: number;
  discount_amount?: number;

  tax_percentage?: number;
  tax_amount?: number;

  // agent commission fields
  agent_commission_percentage?: number;
  agent_commission_amount?: number;
  agent_commission_allowed?: boolean;

  // payment fields
  fields?: PolicyField[];
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data: Partial<Policy>) {
    Object.assign(this, data);
  }
}
