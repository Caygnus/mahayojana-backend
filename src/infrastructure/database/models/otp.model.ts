import mongoose, { Schema, Document } from 'mongoose';
import { OTP, OTPPurpose } from '../../../core/entities/otp.entity';

export interface IOTPDocument extends OTP, Document { }

const OTPSchema = new Schema({
    phone: { type: String, required: true },
    code: { type: String, required: true },
    purpose: {
        type: String,
        enum: Object.values(OTPPurpose),
        required: true
    },
    isUsed: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true },
}, {
    timestamps: true,
    toJSON: {
        transform: function (doc, ret) {
            delete ret.__v;
            delete ret.code; // Don't expose OTP code in responses
            return ret;
        }
    }
});

// Indexes
OTPSchema.index({ phone: 1, purpose: 1 });
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index for automatic deletion

// Methods
OTPSchema.methods.isValid = function (): boolean {
    return !this.isUsed && new Date() < this.expiresAt;
};

OTPSchema.methods.isExpired = function (): boolean {
    return new Date() >= this.expiresAt;
};

export const OTPModel = mongoose.model<IOTPDocument>('OTP', OTPSchema); 