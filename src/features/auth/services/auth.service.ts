import { IAuthService } from '../interfaces/i-auth.service';
import { IAuthRepository } from '../interfaces/i-auth.repository';
import { AuthRepository } from '../repositories/auth.repository';
import { CreateAgentDTO, LoginAgentDTO } from '../dtos/agent.dto';
import { Agent } from '../entities/agent.entity';
import { BadRequestError } from '../../../core/ApiError';
import { OtpService } from '../../otp/services/otp.service';

export class AuthService implements IAuthService {
  private repository: IAuthRepository;

  constructor() {
    this.repository = new AuthRepository();
  }
  async signupAgent(data: CreateAgentDTO): Promise<Agent> {
    data.validate();

    const otpService = new OtpService();

    const isOtpValid = await otpService.verifyOtp(data.phone, data.otp);
    if (!isOtpValid) {
      throw new BadRequestError('Invalid OTP');
    }

    const existingAgent = await this.repository.findAgentByPhone(data.phone)
    if (existingAgent) {
      throw new BadRequestError('Agent already exists');
    }

    const agent = await this.repository.createAgent(data);
    return agent;
  }
  async loginAgent(data: LoginAgentDTO): Promise<Agent> {
    throw new Error('Method not implemented.');
  }
  logoutAgent(): Promise<Agent> {
    throw new Error('Method not implemented.');
  }
  getAgentById(id: string): Promise<Agent> {
    throw new Error('Method not implemented.');
  }
  getAllAgents(): Promise<Agent[]> {
    throw new Error('Method not implemented.');
  }
  deleteAgent(id: string): Promise<Agent> {
    throw new Error('Method not implemented.');
  }


}