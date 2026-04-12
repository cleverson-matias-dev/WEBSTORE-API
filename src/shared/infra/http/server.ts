import express from 'express';
import { AppDataSource } from '../db/data-source';
import swaggerUi from 'swagger-ui-express';
import { createOption } from '@config/swagger';
import { errorHandlerMiddleware } from '@shared/middlewares/error-handler-middleware';
import { loggerMiddleware } from '@shared/middlewares/loggerMiddleware';
import { sanitizeMiddleware } from '@shared/middlewares/sanitizeMiddleware';
import catalogoRoutes from '@modules/catalog/infrastructure/http/routes/routes';
import { identityRoutes } from '@modules/identity/infrastructure/http/routes/routes';
import cors from 'cors'
import { injectUserMetadata } from '@shared/middlewares/injectUserMetadata';
import health_router from '../health/routes';

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

app.use( express.json() );
app.use( loggerMiddleware );
app.use(injectUserMetadata);
app.get('/health', health_router);
app.use( '/catalog/api', sanitizeMiddleware, catalogoRoutes);
app.use( '/identity/api', sanitizeMiddleware, identityRoutes);
app.use('/docs/identity/api-docs', 
    swaggerUi.serveFiles(createOption('Identity')), 
    swaggerUi.setup(createOption('Identity')));
app.use('/docs/catalog/api-docs', 
    swaggerUi.serveFiles(createOption('Catalog')), 
    swaggerUi.setup(createOption('Catalog')));
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