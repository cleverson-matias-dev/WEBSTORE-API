import express from 'express';
import { AppDataSource } from '../db/data-source';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from 'config/swagger';
import { errorHandlerMiddleware } from '@shared/middlewares/error-handler-middleware';
import { loggerMiddleware } from '@shared/middlewares/loggerMiddleware';
import { sanitizeMiddleware } from '@shared/middlewares/sanitizeMiddleware';
import catalogoRoutes from '@modules/catalog/infrastructure/http/routes/routes';
import { identityRoutes } from '@modules/identity/infrastructure/http/routes/routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use( express.json() );
app.use( loggerMiddleware );
app.use( '/catalog/api', sanitizeMiddleware, catalogoRoutes);
app.use( '/identity/api', sanitizeMiddleware, identityRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use( errorHandlerMiddleware );

AppDataSource.initialize().then(()=>{
    console.log("Banco de dados inicializado!");

    app.listen(PORT, (err) => {
        if(err) {
            console.error(err.message);
        }

        console.log(`App rodando na porta: ${PORT}`);
    })

}).catch(error => {
    console.log(`falha ao iniciar banco de dados, erro: ${error}`);
})