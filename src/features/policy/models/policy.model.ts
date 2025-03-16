import mongoose, { Schema, Document } from 'mongoose';
import { Policy, PolicyField } from '../entities/policy.entity';

export interface IPolicyDocument
  extends Omit<
      Policy,
      'toJSON' | 'toObject' | 'id' | 'created_at' | 'updated_at'
    >,
    Document {
  _id: mongoose.Types.ObjectId;
}

const PolicyFieldSchema = new Schema<PolicyField>(
  {
    name: {
      type: String,
      required: true,
    },
    field_id: {
      type: String,
      required: true,
    },
    field_type: {
      type: String,
      required: true,
    },
    field_label: {
      type: String,
      required: true,
    },
    field_placeholder: {
      type: String,
    },
    field_description: {
      type: String,
    },
    field_options: {
      type: [String],
    },
    field_default_value: {
      type: String,
    },
    field_required: {
      type: Boolean,
      default: false,
    },
    field_min_length: {
      type: Number,
    },
    field_max_length: {
      type: Number,
    },
    field_min_value: {
      type: Number,
    },
    field_max_value: {
      type: Number,
    },
    field_regex: {
      type: String,
    },
    field_regex_message: {
      type: String,
    },
  },
  {
    _id: false,
  },
);

const PolicySchema = new Schema<IPolicyDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    agent_commission_allowed: {
      type: Boolean,
      default: false,
    },
    agent_commission_percentage: {
      type: Number,
    },
    agent_commission_amount: {
      type: Number,
    },
    filling_charge: {
      type: Number,
    },
    currency: {
      type: String,
    },
    discount_percentage: {
      type: Number,
    },
    discount_amount: {
      type: Number,
    },
    tax_percentage: {
      type: Number,
    },
    tax_amount: {
      type: Number,
    },
    expiration_date: {
      type: Date,
    },
    created_by: {
      type: String,
    },
    policy_type: {
      type: String,
    },
    rules: {
      type: [String],
    },
    benefits: {
      type: [String],
    },
    fields: {
      type: [PolicyFieldSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    toObject: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        ret.created_at = ret.createdAt;
        ret.updated_at = ret.updatedAt;
        delete ret._id;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
        return ret;
      },
    },
    toJSON: { virtuals: true },
  },
);

export const PolicyModel = mongoose.model<IPolicyDocument>(
  'Policy',
  PolicySchema,
);
