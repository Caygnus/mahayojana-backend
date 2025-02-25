import { Otp } from '../entities/otp.entity';
import { CreateOtpDTO } from '../dtos/create-otp.dto';

export interface IOtpService {
  createOtp(data: CreateOtpDTO): Promise<Otp>;
  verifyOtp(phone: string, code: string): Promise<boolean>;
}