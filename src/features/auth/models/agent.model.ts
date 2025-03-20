import mongoose, { Schema, Document } from 'mongoose';
import { Agent } from '../entities/agent.entity';

export interface IAgentDocument
  extends Omit<Agent, 'toJSON' | 'toObject' | 'id'>,
    Document {
  _id: mongoose.Types.ObjectId;
}

const AgentSchema = new Schema<IAgentDocument>(
  {
    full_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    adhaar: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: false,
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

export const AgentModel = mongoose.model<IAgentDocument>('Agent', AgentSchema);
