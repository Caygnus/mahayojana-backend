export class Otp {
  id!: string;
  createdAt!: Date;
  updatedAt!: Date;
  phone!: string;
  code!: string;
  expiresAt!: Date;

  constructor(data: Partial<Otp>) {
    Object.assign(this, data);
  }

  toJSON() {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      phone: this.phone,
      code: this.code,
      expiresAt: this.expiresAt
    };
  }
}