import { Agent } from '../entities/agent.entity';
import { IAgentDocument } from '../models/agent.model';

export class AgentMapper {
    static toEntity(doc: IAgentDocument): Agent {
        return new Agent({
            id: doc._id.toString(),
            name: doc.name,
            email: doc.email,
            phone: doc.phone,
            adhaar: doc.adhaar,
            address: doc.address,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,

            // Add other fields here
        });
    }

    static toModel(entity: Partial<Agent>): Partial<IAgentDocument> {
        const model: any = { ...entity };
        if (entity.id) {
            model._id = entity.id;
            delete model.id;
        }
        return model;
    }

    static toEntities(docs: IAgentDocument[]): Agent[] {
        return docs.map(doc => this.toEntity(doc));
    }

    static toModels(entities: Partial<Agent>[]): Partial<IAgentDocument>[] {
        return entities.map(entity => this.toModel(entity));
    }
}