export class Auth {
  id!: string;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(data: Partial<Auth>) {
    Object.assign(this, data);
  }

  toJSON() {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
