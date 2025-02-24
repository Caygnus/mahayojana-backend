export class AgentSignupDTO {
  name!: string;
  email!: string;
  phone!: string;
  aadharNumber!: string;
  address!: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };

  constructor(data: Partial<AgentSignupDTO>) {
    Object.assign(this, data);
  }
}