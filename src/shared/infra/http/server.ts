import express from 'express';
import { errorHandlerMiddleware } from '@shared/middlewares/error-handler-middleware';
import { loggerMiddleware } from '@shared/middlewares/loggerMiddleware';
import cors from 'cors'
import { injectUserMetadata } from '@shared/middlewares/injectUserMetadata';
import { bootstrapInfrastructure } from '../bootstrap';
import routes from './main-routes';

const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use( express.json() );
app.use( loggerMiddleware );
app.use( injectUserMetadata );

async function startServer() {
    try {
        await bootstrapInfrastructure();

        app.use(routes);
        app.use(errorHandlerMiddleware);

        const server = app.listen(PORT, () => {
            console.log(`🚀 App rodando na porta: ${PORT}`);
        });

        process.on('SIGTERM', () => {
            console.log('SIGTERM signal received: closing HTTP server');
            server.close(() => {
                console.log('HTTP server closed');
            });
        });
        
    } catch (error) {
        console.error("❌ Falha crítica no startup:", error);
        process.exit(1);
    }
}


startServer();