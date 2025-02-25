import mongoose, { Schema, Document } from 'mongoose';
import { Otp } from '../entities/otp.entity';

export interface IOtpDocument extends Omit<Otp, 'toJSON' | 'toObject' | 'id'>, Document {
  _id: mongoose.Types.ObjectId;
}

const OtpSchema = new Schema({
  phone: { type: String, required: true },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true },
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

export const OtpModel = mongoose.model<IOtpDocument>('Otp', OtpSchema);