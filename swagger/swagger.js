const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
      openapi: '3.0.3',
      info: {
          title: 'API Contract SIMS PPOB',
          version: '1.0.0',
          description: 'Documentation for Take Home Test API',
      },
      components: {
          securitySchemes: {
              Authorization: {
                  type: "http",
                  scheme: "bearer",
                  bearerFormat: "JWT",
                  value: "Bearer <JWT token here>"
              }
          }
      }
  },
  servers: [
    {
      url: 'http://localhost:6007',
    },
  ],
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;