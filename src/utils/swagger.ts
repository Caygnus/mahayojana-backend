import swaggerJsdoc from 'swagger-jsdoc';
import { version } from '../../package.json';

// Swagger definition for DynamicFieldDefinition
interface DynamicFieldSchemaProps {
    type: {
        type: string;
        enum: string[];
        description: string;
    };
    label: {
        type: string;
        description: string;
    };
    description: {
        type: string;
        description: string;
    };
    required: {
        type: boolean;
        description: string;
    };
    minLength: {
        type: string;
        description: string;
    };
    maxLength: {
        type: string;
        description: string;
    };
    pattern: {
        type: string;
        description: string;
    };
    enum: {
        type: string;
        items: {
            type: string;
        };
        description: string;
    };
    min: {
        type: string;
        description: string;
    };
    max: {
        type: string;
        description: string;
    };
    step: {
        type: string;
        description: string;
    };
    minItems: {
        type: string;
        description: string;
    };
    maxItems: {
        type: string;
        description: string;
    };
    uniqueItems: {
        type: boolean;
        description: string;
    };
    displayOrder: {
        type: string;
        description: string;
    };
    placeholder: {
        type: string;
        description: string;
    };
    helpText: {
        type: string;
        description: string;
    };
    hidden: {
        type: boolean;
        description: string;
    };
    default: {
        description: string;
    };
    dependsOn: {
        type: string;
        properties: {
            field: {
                type: string;
                description: string;
            };
            value: {
                description: string;
            };
        };
        description: string;
    };
    properties?: any;
    items?: any;
}

// Defining the schema
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
            description: 'Data type of the field'
        },
        label: {
            type: 'string',
            description: 'Display label for the field'
        },
        description: {
            type: 'string',
            description: 'Description of the field'
        },
        required: {
            type: 'boolean',
            description: 'Whether the field is required'
        },
        // String validations
        minLength: {
            type: 'integer',
            description: 'Minimum length for string fields'
        },
        maxLength: {
            type: 'integer',
            description: 'Maximum length for string fields'
        },
        pattern: {
            type: 'string',
            description: 'Regex pattern for string validation'
        },
        enum: {
            type: 'array',
            items: {
                type: 'string'
            },
            description: 'List of allowed values for string fields'
        },
        // Number validations
        min: {
            type: 'number',
            description: 'Minimum value for number fields'
        },
        max: {
            type: 'number',
            description: 'Maximum value for number fields'
        },
        step: {
            type: 'number',
            description: 'Step value for number fields'
        },
        // Array validations
        minItems: {
            type: 'integer',
            description: 'Minimum number of items for array fields'
        },
        maxItems: {
            type: 'integer',
            description: 'Maximum number of items for array fields'
        },
        uniqueItems: {
            type: 'boolean',
            description: 'Whether array items must be unique'
        },
        // UI properties
        displayOrder: {
            type: 'integer',
            description: 'Order to display the field in UI'
        },
        placeholder: {
            type: 'string',
            description: 'Placeholder text for the field'
        },
        helpText: {
            type: 'string',
            description: 'Help text to display with the field'
        },
        hidden: {
            type: 'boolean',
            description: 'Whether the field should be hidden in UI'
        },
        default: {
            description: 'Default value for the field'
        },
        dependsOn: {
            type: 'object',
            properties: {
                field: {
                    type: 'string',
                    description: 'Field this field depends on'
                },
                value: {
                    description: 'Value that the dependent field must have'
                }
            },
            description: 'Dependency configuration for conditional display/validation'
        }
    },
    required: ['type', 'label']
};

// Handle recursive nature of object/array types - add these after the initial definition
dynamicFieldDefinitionSchema.properties.properties = {
    type: 'object',
    additionalProperties: {
        $ref: '#/components/schemas/DynamicFieldDefinition'
    },
    description: 'Nested field definitions for object type'
};

dynamicFieldDefinitionSchema.properties.items = {
    $ref: '#/components/schemas/DynamicFieldDefinition',
    description: 'Item definition for array type'
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
                            description: 'Unique identifier'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Creation timestamp'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Last update timestamp'
                        },
                        policyNumber: {
                            type: 'string',
                            description: 'Unique policy number'
                        },
                        policyType: {
                            type: 'string',
                            description: 'Type of policy'
                        },
                        title: {
                            type: 'string',
                            description: 'Policy title'
                        },
                        description: {
                            type: 'string',
                            description: 'Policy description'
                        },
                        policyStartDate: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Policy start date'
                        },
                        policyEndDate: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Policy end date'
                        },
                        policyStatus: {
                            type: 'string',
                            description: 'Current status of the policy'
                        },
                        policyAmount: {
                            type: 'number',
                            description: 'Policy amount'
                        },
                        policyTerm: {
                            type: 'number',
                            description: 'Policy term in months'
                        },
                        schemaDefinition: {
                            type: 'object',
                            additionalProperties: {
                                $ref: '#/components/schemas/DynamicFieldDefinition'
                            },
                            description: 'Schema definition for dynamic fields'
                        },
                        dynamicFields: {
                            type: 'object',
                            additionalProperties: true,
                            description: 'Dynamic fields data based on schema definition'
                        }
                    }
                },
                // Auth related schemas
                Agent: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Unique identifier'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'Agent email address'
                        },
                        name: {
                            type: 'string',
                            description: 'Agent name'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Creation timestamp'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Last update timestamp'
                        }
                    }
                },
                LoginRequest: {
                    type: 'object',
                    properties: {
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'Agent email address'
                        },
                        password: {
                            type: 'string',
                            format: 'password',
                            description: 'Agent password'
                        }
                    },
                    required: ['email', 'password']
                },
                SignupRequest: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            description: 'Agent name'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'Agent email address'
                        },
                        password: {
                            type: 'string',
                            format: 'password',
                            description: 'Agent password'
                        }
                    },
                    required: ['name', 'email', 'password']
                },
                TokenResponse: {
                    type: 'object',
                    properties: {
                        agent: {
                            $ref: '#/components/schemas/Agent'
                        },
                        token: {
                            type: 'string',
                            description: 'JWT token'
                        }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        code: {
                            type: 'number'
                        },
                        message: {
                            type: 'string'
                        }
                    }
                }
            },
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [
            {
                BearerAuth: []
            }
        ]
    },
    apis: [
        './src/features/*/routes/*.ts',
        './src/features/*/controllers/*.ts',
        './src/routes/*.ts',
        './src/routes/v1/*.ts'
    ],
};

// Generate the OpenAPI specification
export const specs = swaggerJsdoc(options); 