import mongoose, { Schema, Document } from 'mongoose';
import { Application, Field } from '../entities/application.entity';

export interface IApplicationDocument
  extends Omit<Application, 'toJSON' | 'toObject' | 'id'>,
    Document {
  _id: mongoose.Types.ObjectId;
}
const ApplicationSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    rules: {
      type: [String],
      required: true,
    },
    is_active: {
      type: Boolean,
      required: true,
    },
    expiry_date: {
      type: Date,
      required: true,
    },
    created_by: {
      type: Schema.Types.Mixed,
      // ref: 'Agent',
      required: true,
    },
    fields: {
      type: [Field],
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

export const ApplicationModel = mongoose.model<IApplicationDocument>('Application', ApplicationSchema);