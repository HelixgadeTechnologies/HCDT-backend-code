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
    // servers: [{ url: "https://hcdt-api-09b9ed32e39a.herokuapp.com/" }],
    servers: [{ url: "http://localhost:8000/" }],
    tags: [
      { name: "Auth", description: "Authentication Endpoints" },
      { name: "Upload", description: "Upload Endpoints" },
      { name: "Setting", description: "Settings Endpoints" },
      { name: "Trust", description: "Trust Management Endpoints" },
      { name: "Project", description: "Project Management Endpoints" },
      { name: "Conflict", description: "Conflict Management Endpoints" },
      { name: "Average Community Satisfaction", description: "Average Community Satisfaction Management Endpoints" },
      { name: "Economic Impact", description: "Economic Impact Management Endpoints" },
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
        },
        ProjectView: {
          type: "object",
          properties: {
            projectId: {
              type: "string",
              example: "abc123"
            },
            projectTitle: {
              type: "string",
              nullable: true,
              example: "Road Construction Project"
            },
            projectCategory: {
              type: "string",
              nullable: true,
              example: "Infrastructure"
            },
            totalBudget: {
              type: "integer",
              nullable: true,
              example: 5000000
            },
            community: {
              type: "string",
              nullable: true,
              example: "Lagos"
            },
            awardDate: {
              type: "string",
              format: "date-time",
              nullable: true,
              example: "2025-01-15T00:00:00.000Z"
            },
            nameOfContractor: {
              type: "string",
              nullable: true,
              example: "XYZ Construction Ltd."
            },
            annualApprovedBudget: {
              type: "string",
              nullable: true,
              example: "$2,000,000"
            },
            projectStatus: {
              type: "integer",
              nullable: true,
              example: 1
            },
            projectStatusName: {
              type: "string",
              nullable: true,
              example: "Ongoing"
            },
            qualityRatingId: {
              type: "integer",
              nullable: true,
              example: 2
            },
            qualityRatingName: {
              type: "string",
              nullable: true,
              example: "Good"
            },
            projectVideoMimeType: {
              type: "string",
              nullable: true,
              example: "video/mp4"
            },
            numberOfMaleEmployedByContractor: {
              type: "integer",
              nullable: true,
              example: 50
            },
            numberOfFemaleEmployedByContractor: {
              type: "integer",
              nullable: true,
              example: 20
            },
            numberOfPwDsEmployedByContractor: {
              type: "integer",
              nullable: true,
              example: 5
            },
            typeOfWork: {
              type: "string",
              nullable: true,
              example: "Bridge Construction"
            },
            numberOfHostCommunityMemberContracted: {
              type: "integer",
              nullable: true,
              example: 30
            },
            numberOfMaleBenefited: {
              type: "integer",
              nullable: true,
              example: 1000
            },
            numberOfFemaleBenefited: {
              type: "integer",
              nullable: true,
              example: 800
            },
            numberOfPwDsBenefited: {
              type: "integer",
              nullable: true,
              example: 50
            },
            trustId: {
              type: "string",
              nullable: true,
              example: "trust_123"
            },
            createAt: {
              type: "string",
              format: "date-time",
              nullable: true,
              example: "2025-01-01T12:00:00.000Z"
            },
            updateAt: {
              type: "string",
              format: "date-time",
              nullable: true,
              example: "2025-02-01T12:00:00.000Z"
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
