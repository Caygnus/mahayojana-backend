import { Agent } from '../entities/agent.entity';
import { CreateAgentDTO, LoginAgentDTO } from '../dtos/agent.dto';
import { User } from '../entities/user.entity';
import { LoginUserDTO } from '../dtos/user.dto';
import { CreateUserDTO } from '../dtos/user.dto';

export interface IAuthService {
  signupAgent(data: CreateAgentDTO): Promise<Agent>;

  loginAgent(data: LoginAgentDTO): Promise<Agent>;

  logoutAgent(): Promise<Agent>;

  getAgentById(id: string): Promise<Agent>;

  getAllAgents(): Promise<Agent[]>;

  deleteAgent(id: string): Promise<boolean>;

  generateToken(agent: Agent): Promise<string>;

  signupUser(data: CreateUserDTO): Promise<User>;

  loginUser(data: LoginUserDTO): Promise<User>;

  getUserById(id: string): Promise<User>;

  getAllUsers(): Promise<User[]>;

  deleteUser(id: string): Promise<boolean>;

  agentMe(token: string): Promise<Agent>;

  userMe(token: string): Promise<User>;
}
