import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Store Back Api',
      version: '1.0.0',
      description: 'Documentação da API',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desenvolvimento',
      }
    ],
  },
  // Caminho para os arquivos onde você escreveu os comentários @openapi ou @swagger
  apis: ['./src/modules/**/*.ts'], 
};

export const swaggerSpec = swaggerJSDoc(options);
