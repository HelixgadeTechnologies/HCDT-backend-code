import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

// Swagger configuration
const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HCDT API',
      version: '1.0.0',
      description: 'API documentation for an independent monitoring and evaluation system that aims to promote community participation and effective implementation of the Host Community Development Trust for sustainable development.',
    },
    servers: [{ url: "https://myhcdtbackend-e9275292f4e2.herokuapp.com/" }],
    // servers: [{ url: "http://localhost:8000/" }],
    tags: [
      { name: "Auth", description: "Authentication Endpoints" },
      { name: "Trust", description: "Trust Management Endpoints" },
      // { name: "BotDetails", description: "BotDetails Management Endpoints" }, // Added BotDetails tag
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT", // Important!
        }
      },
      schemas: {
        BotDetails: {
          type: "object",
          properties: {
            botDetailsId: {
              type: "string",
              format: "uuid",
              example: "d3f8a2b4-12f5-4e7a-9f93-34f85d763b87"
            },
            firstName: {
              type: "string",
              example: "John"
            },
            lastName: {
              type: "string",
              example: "Doe"
            },
            email: {
              type: "string",
              format: "email",
              example: "john.doe@example.com"
            },
            phoneNumber: {
              type: "string",
              example: "+1234567890"
            },
            trustId: {
              type: "string",
              format: "uuid",
              example: "a1b2c3d4-5678-90ef-1234-567890abcdef"
            }
          }
        },
        OperationalExpenditure: {
          type: "object",
          properties: {
            OperationalExpenditureId: {
              type: "string",
              format: "uuid",
              example: "d3f8a2b4-12f5-4e7a-9f93-34f85d763b87"
            },
            settlorOperationalExpenditureYear: {
              type: "int",
              example: 2025
            },
            settlorOperationalExpenditure: {
              type: "int",
              example: 2000
            },
            trustEstablishmentStatusId: {
              type: "string",
              format: "uuid",
              example: "d3f8a2b4-12f5-4e7a-9f93-34f85d763b87"
            }
          }
        }
      }
    }

  },
  apis: ['./src/routes/*.ts'], // Path to the API routes with Swagger comments
};

// Generate Swagger documentation
const swaggerSpec = swaggerJSDoc(options);

// Function to setup Swagger
const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default setupSwagger;
