import swaggerJSDoc from 'swagger-jsdoc';

export const UserSchema: swaggerJSDoc.Schema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    email: { type: 'string' },
    phone: { type: 'string' },
  },
  required: ['name', 'email', 'phone'],
  example: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+919876543210',
  },
};
