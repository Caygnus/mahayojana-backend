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

OtpSchema.index({ phone: 1 }, { unique: true });

// This index will handle expiration based on the expiresAt field
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// This index will automatically delete records 1 minute (60 seconds) after creation
OtpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 10 });

OtpSchema.index({ phone: 1, code: 1 }, { unique: true });

export const OtpModel = mongoose.model<IOtpDocument>('Otp', OtpSchema);