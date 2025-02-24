import { OTPPurpose } from '../../../core/entities/otp.entity';

export class VerifyOTPDTO {
    phone!: string;
    code!: string;
    purpose!: OTPPurpose;

    constructor(data: Partial<VerifyOTPDTO>) {
        Object.assign(this, data);
    }
} 