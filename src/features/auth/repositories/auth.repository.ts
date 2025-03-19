import { IAuthRepository } from '../interfaces/i-auth.repository';
import { CreateAgentDTO } from '../dtos/agent.dto';
import { Agent } from '../entities/agent.entity';
import { AgentMapper } from '../mappers/agent.mapper';
import { AgentModel } from '../models/agent.model';
import { CreateUserDTO } from '../dtos/user.dto';
import { User } from '../entities/user.entity';
import { UserMapper } from '../mappers/user.mapper';
import { UserModel } from '../models/user.model';

export class AuthRepository implements IAuthRepository {
  async deleteUser(id: string): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(id);
    return !!result;
  }

  async createAgent(data: CreateAgentDTO): Promise<Agent> {
    const modelData = AgentMapper.toModel(new Agent(data));
    const created = await AgentModel.create(modelData);
    return AgentMapper.toEntity(created);
  }

  async findAgentByPhone(phone: string): Promise<Agent | null> {
    const result = await AgentModel.findOne({ phone });
    return result ? AgentMapper.toEntity(result) : null;
  }

  async deleteAgent(id: string): Promise<boolean> {
    const result = await AgentModel.findByIdAndDelete(id);
    return !!result;
  }

  async findAgentById(id: string): Promise<Agent | null> {
    const result = await AgentModel.findById(id);
    return result ? AgentMapper.toEntity(result) : null;
  }

  async getAllAgents(): Promise<Agent[]> {
    const result = await AgentModel.find();
    return AgentMapper.toEntities(result);
  }

  async findExistingAgent({
    phone,
    email,
    adhaar,
  }: {
    phone?: string;
    email?: string;
    adhaar?: string;
  }): Promise<Agent | null> {
    const result = await AgentModel.findOne({
      $or: [{ phone }, { email }, { adhaar }],
    });
    return result ? AgentMapper.toEntity(result) : null;
  }

  async createUser(data: CreateUserDTO): Promise<User> {
    const modelData = UserMapper.toModel(new User(data));
    const created = await UserModel.create(modelData);
    return UserMapper.toEntity(created);
  }

  async findUserByPhone(phone: string): Promise<User | null> {
    const result = await UserModel.findOne({ phone });
    return result ? UserMapper.toEntity(result) : null;
  }

  async findUserById(id: string): Promise<User | null> {
    const result = await UserModel.findById(id);
    return result ? UserMapper.toEntity(result) : null;
  }

  async getAllUsers(): Promise<User[]> {
    const result = await UserModel.find();
    return UserMapper.toEntities(result);
  }

  async findExistingUser({
    phone,
    email,
    adhaar,
  }: {
    phone?: string;
    email?: string;
    adhaar?: string;
  }): Promise<User | null> {
    const result = await UserModel.findOne({
      $or: [{ phone }, { email }, { adhaar }],
    });
    return result ? UserMapper.toEntity(result) : null;
  }
}
