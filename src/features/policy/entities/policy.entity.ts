export class Policy {
  id!: string;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(data: Partial<Policy>) {
    Object.assign(this, data);
  }
}