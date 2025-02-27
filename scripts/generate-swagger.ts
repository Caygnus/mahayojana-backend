import fs from 'fs';
import path from 'path';
import swaggerJsdoc from 'swagger-jsdoc';
import { version } from '../package.json';

// Define Swagger options
// Swagger definition for DynamicFieldDefinition
const dynamicFieldDefinitionSchema: {
  type: string;
  properties: Record<string, any>;
  required: string[];
} = {
  type: 'object',
  properties: {
    type: {
      type: 'string',
      enum: ['string', 'number', 'date', 'boolean', 'object', 'array'],
      description: 'Data type of the field',
    },
    label: {
      type: 'string',
      description: 'Display label for the field',
    },
    description: {
      type: 'string',
      description: 'Description of the field',
    },
    required: {
      type: 'boolean',
      description: 'Whether the field is required',
    },
    // String validations
    minLength: {
      type: 'integer',
      description: 'Minimum length for string fields',
    },
    maxLength: {
      type: 'integer',
      description: 'Maximum length for string fields',
    },
    pattern: {
      type: 'string',
      description: 'Regex pattern for string validation',
    },
    enum: {
      type: 'array',
      items: {
        type: 'string',
      },
      description: 'List of allowed values for string fields',
    },
    // Number validations
    min: {
      type: 'number',
      description: 'Minimum value for number fields',
    },
    max: {
      type: 'number',
      description: 'Maximum value for number fields',
    },
    step: {
      type: 'number',
      description: 'Step value for number fields',
    },
    // Array validations
    minItems: {
      type: 'integer',
      description: 'Minimum number of items for array fields',
    },
    maxItems: {
      type: 'integer',
      description: 'Maximum number of items for array fields',
    },
    uniqueItems: {
      type: 'boolean',
      description: 'Whether array items must be unique',
    },
    // UI properties
    displayOrder: {
      type: 'integer',
      description: 'Order to display the field in UI',
    },
    placeholder: {
      type: 'string',
      description: 'Placeholder text for the field',
    },
    helpText: {
      type: 'string',
      description: 'Help text to display with the field',
    },
    hidden: {
      type: 'boolean',
      description: 'Whether the field should be hidden in UI',
    },
    default: {
      description: 'Default value for the field',
    },
    dependsOn: {
      type: 'object',
      properties: {
        field: {
          type: 'string',
          description: 'Field this field depends on',
        },
        value: {
          description: 'Value that the dependent field must have',
        },
      },
      description:
        'Dependency configuration for conditional display/validation',
    },
  },
  required: ['type', 'label'],
};

// Handle recursive nature of object/array types - add these after the initial definition
dynamicFieldDefinitionSchema.properties.properties = {
  type: 'object',
  additionalProperties: {
    $ref: '#/components/schemas/DynamicFieldDefinition',
  },
  description: 'Nested field definitions for object type',
};

dynamicFieldDefinitionSchema.properties.items = {
  $ref: '#/components/schemas/DynamicFieldDefinition',
  description: 'Item definition for array type',
};

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
        url: '/v1',
        description: 'API V1',
      },
    ],
    components: {
      schemas: {
        // Common schemas
        DynamicFieldDefinition: dynamicFieldDefinitionSchema,
        Policy: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier',
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
            policyNumber: {
              type: 'string',
              description: 'Unique policy number',
            },
            policyType: {
              type: 'string',
              description: 'Type of policy',
            },
            title: {
              type: 'string',
              description: 'Policy title',
            },
            description: {
              type: 'string',
              description: 'Policy description',
            },
            policyStartDate: {
              type: 'string',
              format: 'date-time',
              description: 'Policy start date',
            },
            policyEndDate: {
              type: 'string',
              format: 'date-time',
              description: 'Policy end date',
            },
            policyStatus: {
              type: 'string',
              description: 'Current status of the policy',
            },
            policyAmount: {
              type: 'number',
              description: 'Policy amount',
            },
            policyTerm: {
              type: 'number',
              description: 'Policy term in months',
            },
            schemaDefinition: {
              type: 'object',
              additionalProperties: {
                $ref: '#/components/schemas/DynamicFieldDefinition',
              },
              description: 'Schema definition for dynamic fields',
            },
            dynamicFields: {
              type: 'object',
              additionalProperties: true,
              description: 'Dynamic fields data based on schema definition',
            },
          },
        },
        // Auth schemas
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
        CreateOtpRequest: {
          type: 'object',
          properties: {
            phone: {
              type: 'string',
              description: 'Phone number to send OTP to',
            },
          },
          required: ['phone'],
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

// Function to generate Swagger docs
async function generateSwaggerDocs() {
  try {
    console.log('Generating Swagger documentation...');

    // Generate OpenAPI specification
    const specs = swaggerJsdoc(options);

    // Create docs directory if it doesn't exist
    const docsDir = path.join(__dirname, '..', 'docs');
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }

    // Write OpenAPI specification to file
    const outputPath = path.join(docsDir, 'swagger.json');
    fs.writeFileSync(outputPath, JSON.stringify(specs, null, 2), 'utf8');

    console.log(
      `Swagger documentation generated successfully at: ${outputPath}`,
    );

    // Also create a basic HTML to view the docs
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Mahayojana API Documentation</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@latest/swagger-ui.css" />
  <style>
    body {
      margin: 0;
      padding: 0;
    }
    #swagger-ui {
      max-width: 1200px;
      margin: 0 auto;
    }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@latest/swagger-ui-bundle.js"></script>
  <script>
    window.onload = function() {
      const ui = SwaggerUIBundle({
        url: "./swagger.json",
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIBundle.SwaggerUIStandalonePreset
        ],
        layout: "BaseLayout"
      });
    };
  </script>
</body>
</html>
    `;

    fs.writeFileSync(path.join(docsDir, 'index.html'), htmlContent, 'utf8');
    console.log(`HTML viewer created at: ${path.join(docsDir, 'index.html')}`);
  } catch (error) {
    console.error('Error generating Swagger documentation:', error);
    process.exit(1);
  }
}

// Run the function
generateSwaggerDocs();
