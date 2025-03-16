import { Schema } from 'mongoose';

export enum FieldType {
  TEXT = 'text',
  NUMBER = 'number',
  DATE = 'date',
  BOOLEAN = 'boolean',
  SELECT = 'select',
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  TEXTAREA = 'textarea',
  FILE = 'file',
  IMAGE = 'image',
}

export class Field {
  type!: FieldType;
  label!: string;
  placeholder!: string;
  required!: boolean;
  options!: string[];
}

export class Application {
  id!: string;

  // required fields
  createdAt!: Date;
  updatedAt!: Date;
  title!: string;
  description!: string;
  rules!: string[];
  is_active!: boolean;
  expiry_date!: Date;
  created_by!: Schema.Types.ObjectId;

  // dynamic fields
  fields!: Field[];

  constructor(data: Partial<Application>) {
    Object.assign(this, data);
  }

  toJSON() {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
