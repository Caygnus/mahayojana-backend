import { Agent } from '../entities/agent.entity';
import { CreateAgentDTO, LoginAgentDTO } from '../dtos/agent.dto';

export interface IAuthService {
  signupAgent(data: CreateAgentDTO): Promise<Agent>
  loginAgent(data: LoginAgentDTO): Promise<Agent>
  logoutAgent(): Promise<Agent>
  getAgentById(id: string): Promise<Agent>
  getAllAgents(): Promise<Agent[]>
  deleteAgent(id: string): Promise<Agent>
  generateToken(agent: Agent): Promise<string>
}