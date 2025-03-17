import swaggerJsdoc from 'swagger-jsdoc';
import { version } from '../../package.json';

// Swagger definition
const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mahayojana API Documentation',
      version,
      description: 'API documentation for the Mahayojana Backend',
      license: {
        name: 'Apache 2.0',
        url: 'https://www.apache.org/licenses/LICENSE-2.0.html',
      },
      contact: {
        name: 'API Support',
        email: 'support@mahayojana.com',
      },
    },
    servers: [
      {
        url: 'https://api.mahayojana.site',
        description: 'API V1',
      },
    ],
    components: {
      schemas: {
        // Common schemas
        // Auth related schemas
        Agent: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Agent email address',
            },
            name: {
              type: 'string',
              description: 'Agent name',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Agent email address',
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'Agent password',
            },
          },
          required: ['email', 'password'],
        },
        SignupRequest: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Agent name',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Agent email address',
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'Agent password',
            },
          },
          required: ['name', 'email', 'password'],
        },
        TokenResponse: {
          type: 'object',
          properties: {
            agent: {
              $ref: '#/components/schemas/Agent',
            },
            token: {
              type: 'string',
              description: 'JWT token',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            code: {
              type: 'number',
            },
            message: {
              type: 'string',
            },
          },
        },
      },
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: [
    './src/features/*/routes/*.ts',
    './src/features/*/controllers/*.ts',
    './src/routes/*.ts',
    './src/routes/v1/*.ts',
  ],
};

// Generate the OpenAPI specification
export const specs = swaggerJsdoc(options);
