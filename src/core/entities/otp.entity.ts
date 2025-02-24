export enum OTPPurpose {
    SIGNUP = 'signup',
    LOGIN = 'login',
    RESET_PASSWORD = 'reset_password'
}

export class OTP {
    id: string;
    phone: string;
    code: string;
    purpose: OTPPurpose;
    isUsed: boolean;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;

    constructor(partial: Partial<OTP>) {
        Object.assign(this, partial);
    }

    isValid(): boolean {
        return !this.isUsed && new Date() < this.expiresAt;
    }

    isExpired(): boolean {
        return new Date() >= this.expiresAt;
    }
} 