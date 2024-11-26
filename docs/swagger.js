const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API da Residencia',
    version: '1.0.0',
    description: 'API da Residencia',
  },
  servers: [
    {
      url: 'http://localhost:10000',
      description: 'Servidor de Desenvolvimento',
    },
    {
      url: 'https://projetoresidenciallm.onrender.com', 
      description: 'Servidor de Produção',
    },
  
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = (app) => {
  app.use('/api/doc-api-residencia', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};