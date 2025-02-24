import mongoose, { Schema, Document } from 'mongoose';
import { Agent } from '../../../core/entities/agent.entity';

export interface IAgentDocument extends Agent, Document {}

const AgentSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  aadharNumber: { type: String, required: true, unique: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, required: true, default: 'India' }
  },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  roles: [{ type: Schema.Types.ObjectId, ref: 'Role' }],
  lastLoginAt: { type: Date },
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes
AgentSchema.index({ phone: 1 }, { unique: true });
AgentSchema.index({ email: 1 }, { unique: true });
AgentSchema.index({ aadharNumber: 1 }, { unique: true });

export const AgentModel = mongoose.model<IAgentDocument>('Agent', AgentSchema); 