import swaggerJSDoc from 'swagger-jsdoc';
const isProd = process.env.NODE_ENV === 'production';

export const createOption = (moduleName: string) => swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: `[${moduleName}] Store Api`,
      version: '1.0.0',
    },
    servers: [
      {
        url: `http://localhost:8000`,
        description: 'Servidor de Desenvolvimento',
      }
    ],
  },
  apis: [`./${isProd ? 'build' : 'src'}/modules/${moduleName.toLocaleLowerCase()}/**/*.yaml`], 
})
