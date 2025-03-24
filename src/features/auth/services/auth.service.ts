import { IAuthService } from '../interfaces/i-auth.service';
import { IAuthRepository } from '../interfaces/i-auth.repository';
import { AuthRepository } from '../repositories/auth.repository';
import { CreateAgentDTO, LoginAgentDTO } from '../dtos/agent.dto';
import { Agent } from '../entities/agent.entity';
import { BadRequestError, NotFoundError } from '../../../core/ApiError';
import { OtpService } from '../../otp/services/otp.service';
import JWT from '../../../core/JWT';
import Logger from '../../../core/Logger';
import { CreateUserDTO, LoginUserDTO } from '../dtos/user.dto';
import { User } from '../entities/user.entity';

export class AuthService implements IAuthService {
  private repository: IAuthRepository;

  constructor() {
    this.repository = new AuthRepository();
  }

  async signupUser(data: CreateUserDTO): Promise<User> {
    data.validate();
    const otpService = new OtpService();
    const isOtpValid = await otpService.verifyOtp(data.phone, data.otp);

    if (!isOtpValid) {
      throw new BadRequestError('Invalid OTP');
    }

    const existingUser = await this.repository.findExistingUser({
      phone: data.phone,
      email: data.email,
      adhaar: data.adhaar,
    });
    if (existingUser) {
      throw new BadRequestError('User already exists');
    }
    const user = await this.repository.createUser(data);
    return user;
  }
  async loginUser(data: LoginUserDTO): Promise<User> {
    data.validate();
    const otpService = new OtpService();
    const isOtpValid = await otpService.verifyOtp(data.phone, data.otp);
    if (!isOtpValid) {
      throw new BadRequestError('Invalid OTP');
    }
    const user = await this.repository.findExistingUser({
      phone: data.phone,
    });
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.repository.findUserById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return this.repository.getAllUsers();
  }

  async deleteUser(id: string): Promise<boolean> {
    const user = await this.repository.findUserById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return this.repository.deleteUser(id);
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

  async generateToken(agent: Agent | User): Promise<string> {
    return await JWT.encode({
      aud: 'agent',
      sub: agent.id,
      iss: 'api',
      iat: new Date().getTime(),
      exp: new Date().getTime() + 1000 * 60 * 60 * 24 * 30,
      prm: JSON.stringify({
        id: agent.id,
        type: agent instanceof Agent ? 'agent' : 'user',
      }),
    });
  }

  async validateToken(
    token: string,
  ): Promise<{ valid: boolean; id: string | null }> {
    try {
      const payload = await JWT.decode(token);
      Logger.info('decoded token', payload);

      // Validate audience and issuer
      if (payload.aud !== 'agent' || payload.iss !== 'api') {
        return { valid: false, id: null };
      }

      // Validate expiration
      const now = new Date().getTime();
      if (payload.exp < now) {
        return { valid: false, id: null };
      }

      // Get agent from payload
      const id = payload.sub;

      return {
        valid: !!id,
        id: id,
      };
    } catch (error) {
      return { valid: false, id: null };
    }
  }

  logoutAgent(): Promise<Agent> {
    throw new Error('Method not implemented.');
  }

  async getAgentById(id: string): Promise<Agent> {
    const agent = await this.repository.findAgentById(id);
    if (!agent) {
      throw new NotFoundError('Agent not found');
    }
    return agent;
  }

  async getAllAgents(): Promise<Agent[]> {
    return this.repository.getAllAgents();
  }

  async deleteAgent(id: string): Promise<boolean> {
    const agent = await this.repository.findAgentById(id);

    if (!agent) {
      throw new NotFoundError('Agent not found');
    }

    return this.repository.deleteAgent(id);
  }

  async agentMe(token: string): Promise<Agent> {
    const { valid, id } = await this.validateToken(token);
    if (!valid) {
      throw new NotFoundError('Agent not found');
    }
    const agent = await this.repository.findAgentById(id || '');
    if (!agent) {
      throw new NotFoundError('Agent not found');
    }
    return agent;
  }

  async userMe(token: string): Promise<User> {
    const { valid, id } = await this.validateToken(token);
    if (!valid) {
      throw new NotFoundError('User not found');
    }
    const user = await this.repository.findUserById(id || '');
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }
}
