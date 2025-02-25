import { IBaseRepository } from '../../../core/interfaces/base.repository.interface';
import { Otp } from '../entities/otp.entity';

export interface IOtpRepository extends IBaseRepository<Otp> {
  createOtp(data: Partial<Otp>): Promise<Otp>
  findOtpByPhone(phone: string): Promise<Otp | null>
  deleteOtp(id: string): Promise<boolean>
}