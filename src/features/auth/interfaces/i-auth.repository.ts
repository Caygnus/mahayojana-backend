import { CreateAgentDTO } from '../dtos/agent.dto';
import { Agent } from '../entities/agent.entity';

export interface IAuthRepository {
  createAgent(data: CreateAgentDTO): Promise<Agent>;
  findAgentByPhone(phone: string): Promise<Agent | null>;
  deleteAgent(id: string): Promise<boolean>;
  findAgentById(id: string): Promise<Agent | null>;
  // updateAgent(id: string, data: UpdateAgentDTO): Promise<Agent | null>
  findAllAgents(): Promise<Agent[]>;
  findExistingAgent({
    phone,
    email,
    adhaar,
  }: {
    phone?: string;
    email?: string;
    adhaar?: string;
  }): Promise<Agent | null>;
}
