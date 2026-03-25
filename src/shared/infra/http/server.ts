import express from 'express';
import catalogRoutes from '@modules/catalogo/infrastructure/http/routes/routes';
import { AppDataSource } from '../db/data-source';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from 'config/swagger';
import { errorHandlerMiddleware } from '@shared/middlewares/error-handler-middleware';
import { loggerMiddleware } from '@shared/middlewares/loggerMiddleware';
import { sanitizeMiddleware } from '@shared/middlewares/sanitizeMiddleware';

const app = express();
const PORT = process.env.PORT || 3000;

app.use( express.json() );
app.use( loggerMiddleware );
app.use( '/api/catalogo', sanitizeMiddleware
    , catalogRoutes);
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