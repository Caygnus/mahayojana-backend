import mongoose, { Schema, Document } from 'mongoose';
import { Policy } from '../entities/policy.entity';

export interface IPolicyDocument extends Document {
  createdAt: Date;
  updatedAt: Date;
}

const PolicySchema = new Schema(
  {
    // Add your schema fields here
  },
  { timestamps: true },
);

export const PolicyModel = mongoose.model<IPolicyDocument>(
  'Policy',
  PolicySchema,
);
