import { IOtpService } from '../interfaces/i-otp.service';
import { IOtpRepository } from '../interfaces/i-otp.repository';
import { OtpRepository } from '../repositories/otp.repository';
import { CreateOtpDTO } from '../dtos/create-otp.dto';
import { Otp } from '../entities/otp.entity';
import { BadRequestError } from '../../../core/ApiError';
export class OtpService implements IOtpService {
  private repository: IOtpRepository;

  constructor() {
    this.repository = new OtpRepository();
  }
  async createOtp(data: CreateOtpDTO): Promise<Otp> {
    data.validate();
    const existingOtp = await this.repository.findOtpByPhone(data.phone);

    if (existingOtp) {
      const remainingTime = Math.ceil(
        (existingOtp.expiresAt.getTime() - Date.now()) / (1000 * 60),
      );
      throw new BadRequestError(
        `You can request an otp after ${remainingTime} minutes`,
      );
    }

    // const code = Math.floor(100000 + Math.random() * 900000).toString();
    const code = '123456';

    const otpData = {
      phone: data.phone,
      code,
      expiresAt: new Date(Date.now() + 1000 * 60 * 3),
    };
    return this.repository.createOtp(otpData);
  }
  async verifyOtp(phone: string, code: string): Promise<boolean> {
    const otp = await this.repository.findOtpByPhone(phone);

    if (!otp) {
      throw new BadRequestError('Otp not found');
    }

    if (otp.code !== code) {
      throw new BadRequestError('Invalid OTP');
    }

    if (otp.expiresAt < new Date()) {
      throw new BadRequestError('Otp expired');
    }

    await this.repository.deleteOtp(otp.id);

    return otp.code === code;
  }
}
