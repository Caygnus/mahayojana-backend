export class Agent {
  id!: string;
  name!: string;
  email!: string;
  phone!: string;
  adhaar!: string;
  address?: string;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(data: Partial<Agent>) {
    Object.assign(this, data);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      adhaar: this.adhaar,
      address: this.address,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
