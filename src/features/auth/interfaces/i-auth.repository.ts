import { CreateAgentDTO } from '../dtos/agent.dto';
import { CreateUserDTO } from '../dtos/user.dto';
import { Agent } from '../entities/agent.entity';
import { User } from '../entities/user.entity';

export interface IAuthRepository {
  //  agent functions
  createAgent(data: CreateAgentDTO): Promise<Agent>;
  findAgentByPhone(phone: string): Promise<Agent | null>;
  deleteAgent(id: string): Promise<boolean>;
  findAgentById(id: string): Promise<Agent | null>;
  // updateAgent(id: string, data: UpdateAgentDTO): Promise<Agent | null>
  getAllAgents(): Promise<Agent[]>;
  findExistingAgent({
    phone,
    email,
    adhaar,
  }: {
    phone?: string;
    email?: string;
    adhaar?: string;
  }): Promise<Agent | null>;

  createUser(data: CreateUserDTO): Promise<User>;
  findUserByPhone(phone: string): Promise<User | null>;
  findUserById(id: string): Promise<User | null>;
  findExistingUser({
    phone,
    email,
  }: {
    phone?: string;
    email?: string;
    adhaar?: string;
  }): Promise<User | null>;

  //  user functions
  getAllUsers(): Promise<User[]>;
  deleteUser(id: string): Promise<boolean>;
}
