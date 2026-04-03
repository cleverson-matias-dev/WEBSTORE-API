import swaggerJSDoc from 'swagger-jsdoc';


export const createOption = (moduleName: string) => swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: `[${moduleName}] Store Api`,
      version: '1.0.0',
    },
    servers: [
      {
        url: `http://localhost:3000`,
        description: 'Servidor de Desenvolvimento',
      }
    ],
  },
  apis: [`./src/modules/${moduleName.toLocaleLowerCase()}/**/*.yaml`], 
})
