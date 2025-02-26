import mongoose, { Schema, Document } from 'mongoose';
import { Auth } from '../entities/auth.entity';

export interface IAuthDocument extends Omit<Auth, 'toJSON' | 'toObject' | 'id'>, Document {
  _id: mongoose.Types.ObjectId;
}

const AuthSchema = new Schema({
  // Add your schema fields here
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

export const AuthModel = mongoose.model<IAuthDocument>('Auth', AuthSchema);