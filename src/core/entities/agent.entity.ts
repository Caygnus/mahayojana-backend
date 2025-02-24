enum AgentRole {
  ADMIN = 'admin',
  AGENT = 'agent',
}

export class Agent {
  id!: string;
  name!: string;
  email!: string;
  phone!: string;
  aadharNumber!: string;
  isVerified!: boolean;
  isActive!: boolean;
  roles!: AgentRole[];
  createdAt!: Date;
  updatedAt!: Date;
  lastLoginAt?: Date;

  constructor(partial: Partial<Agent>) {
    Object.assign(this, partial);
  }

  get isPhoneVerified(): boolean {
    return this.isVerified;
  }
} 