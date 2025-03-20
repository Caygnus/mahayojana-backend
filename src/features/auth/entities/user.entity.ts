export class User {
  id!: string;
  full_name!: string;
  email?: string;
  phone!: string;
  adhaar?: string;
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(data: Partial<User>) {
    Object.assign(this, data);
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      phone: this.phone,
      adhaar: this.adhaar,
      address_line_1: this.address_line_1,
      address_line_2: this.address_line_2,
      city: this.city,
      state: this.state,
      country: this.country,
      pincode: this.pincode,
      full_name: this.full_name,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }
}
