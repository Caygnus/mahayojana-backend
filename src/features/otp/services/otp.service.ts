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
      throw new BadRequestError('Otp already exists');
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const otpData = {
      phone: data.phone,
      code,
      expiresAt: new Date(Date.now() + 1000 * 60 * 5),
    };
    return this.repository.createOtp(otpData);
  }
  async verifyOtp(phone: string, code: string): Promise<boolean> {
    const otp = await this.repository.findOtpByPhone(phone);
    if (!otp) {
      throw new BadRequestError('Otp not found');
    }
    if (otp.code !== code) {
      throw new BadRequestError('Invalid code');
    }
    if (otp.expiresAt < new Date()) {
      throw new BadRequestError('Otp expired');
    }
    return !!otp;
  }
}