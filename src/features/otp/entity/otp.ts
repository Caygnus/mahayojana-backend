import { v4 as uuidv4 } from 'uuid';

export enum OTPPurpose {
    SIGNUP = 'signup',
    LOGIN = 'login',
    RESET_PASSWORD = 'reset_password'
}

export class OTP {
    id!: string;
    phone!: string;
    code!: string;
    purpose!: OTPPurpose;
    isUsed!: boolean;
    expiresAt!: Date;
    createdAt!: Date;
    updatedAt!: Date;

    constructor(partial: Partial<OTP>) {
        Object.assign(this, partial);
    }

    isValid(): boolean {
        return !this.isUsed && new Date() < this.expiresAt;
    }

    isExpired(): boolean {
        return new Date() >= this.expiresAt;
    }

    static generateCode(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    static generateExpirationDate(): Date {
        return new Date(Date.now() + 1000 * 60 * 5);
    }

    static generateOTP(phone: string, purpose: OTPPurpose): OTP {
        return new OTP({
            id: uuidv4(),
            phone,
            code: this.generateCode(),
            purpose,
            isUsed: false,
            expiresAt: this.generateExpirationDate(),
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }
} 
