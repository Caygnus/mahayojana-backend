/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the user
 *         full_name:
 *           type: string
 *           description: Full name of the user
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the user
 *         phone:
 *           type: string
 *           description: Phone number of the user
 *         adhaar_number:
 *           type: string
 *           description: Adhaar card number of the user
 *         address_line_1:
 *           type: string
 *           description: First line of user's address
 *         address_line_2:
 *           type: string
 *           description: Second line of user's address
 *         city:
 *           type: string
 *           description: City of residence
 *         state:
 *           type: string
 *           description: State of residence
 *         country:
 *           type: string
 *           description: Country of residence
 *         pincode:
 *           type: string
 *           description: Postal code
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp of user creation
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp of last update
 *       required:
 *         - id
 *         - full_name
 *         - phone
 */

export class User {
  id!: string;
  full_name!: string;
  email?: string;
  phone!: string;
  adhaar_number?: string;
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
      adhaar_number: this.adhaar_number,
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
