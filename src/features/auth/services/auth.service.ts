import { IAuthService } from '../interfaces/i-auth.service';
import { IAuthRepository } from '../interfaces/i-auth.repository';
import { AuthRepository } from '../repositories/auth.repository';
import { CreateAgentDTO, LoginAgentDTO } from '../dtos/agent.dto';
import { Agent } from '../entities/agent.entity';
import { BadRequestError, NotFoundError } from '../../../core/ApiError';
import { OtpService } from '../../otp/services/otp.service';
import JWT from '../../../core/JWT';
import Logger from '../../../core/Logger';

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

    const existingAgent = await this.repository.findExistingAgent({
      phone: data.phone,
      email: data.email,
      adhaar: data.adhaar,
    });
    if (existingAgent) {
      throw new BadRequestError('Agent already exists');
    }

    const agent = await this.repository.createAgent(data);
    return agent;
  }
  async loginAgent(data: LoginAgentDTO): Promise<Agent> {
    data.validate();

    const otpService = new OtpService();
    const isOtpValid = await otpService.verifyOtp(data.phone, data.otp);
    if (!isOtpValid) {
      throw new BadRequestError('Invalid OTP');
    }
    Logger.info(data.phone, data.otp);

    const agent = await this.repository.findExistingAgent({
      phone: data.phone,
    });
    Logger.info('agent', agent);
    if (!agent) {
      throw new NotFoundError('Agent not found');
    }
    return agent;
  }

  async generateToken(agent: Agent): Promise<string> {
    return await JWT.encode({
      aud: 'agent',
      sub: agent.id,
      iss: 'api',
      iat: new Date().getTime(),
      exp: new Date().getTime() + 1000 * 60 * 60 * 24 * 30,
      prm: JSON.stringify({
        id: agent.id,
      }),
    });
  }

  async validateToken(
    token: string,
  ): Promise<{ valid: boolean; agent: Agent | null }> {
    try {
      const payload = await JWT.decode(token);

      // Validate audience and issuer
      if (payload.aud !== 'agent' || payload.iss !== 'api') {
        return { valid: false, agent: null };
      }

      // Validate expiration
      const now = new Date().getTime();
      if (payload.exp < now) {
        return { valid: false, agent: null };
      }

      // Get agent from payload
      const agentId = payload.sub;
      const agent = await this.repository.findAgentById(agentId);

      return {
        valid: !!agent,
        agent,
      };
    } catch (error) {
      return { valid: false, agent: null };
    }
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
