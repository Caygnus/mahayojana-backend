import { IAuthRepository } from '../interfaces/i-auth.repository';
import { CreateAgentDTO } from '../dtos/agent.dto';
import { Agent } from '../entities/agent.entity';
import { AgentMapper } from '../mappers/agent.mapper';
import { AgentModel } from '../models/agent.model';

export class AuthRepository implements IAuthRepository {

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
  async findAllAgents(): Promise<Agent[]> {
    const result = await AgentModel.find();
    return AgentMapper.toEntities(result);
  }

  async findExistingAgent({ phone, email, adhaar }: { phone?: string, email?: string, adhaar?: string }): Promise<Agent | null> {
    const result = await AgentModel.findOne({ $or: [{ phone }, { email }, { adhaar }] });
    return result ? AgentMapper.toEntity(result) : null;
  }


}