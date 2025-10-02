import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PrimeTrade API',
      version: '1.0.0',
      description: 'Secure, scalable REST API with auth and RBAC'
    },
    servers: [{ url: '/api/v1' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '64f1234567890abcdef12345'
            },
            name: {
              type: 'string',
              example: 'John Doe'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              example: 'user'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Task: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '64f1234567890abcdef12345'
            },
            title: {
              type: 'string',
              maxLength: 200,
              example: 'Complete project documentation'
            },
            description: {
              type: 'string',
              maxLength: 2000,
              example: 'Write comprehensive API documentation'
            },
            status: {
              type: 'string',
              enum: ['pending', 'in_progress', 'done'],
              example: 'in_progress'
            },
            owner: {
              type: 'string',
              example: '64f1234567890abcdef12345'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        TokenPair: {
          type: 'object',
          properties: {
            accessToken: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            },
            refreshToken: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            status: {
              type: 'integer',
              example: 400
            },
            message: {
              type: 'string',
              example: 'Validation error details'
            }
          }
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['src/routes/**/*.js', 'src/models/**/*.js']
};

export const swaggerSpec = swaggerJSDoc(options);


