import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

// Swagger configuration
const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'API documentation for my Express TypeScript app',
    },
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