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
import RabbitMQServer from '../messaging/RabbitMQServer';
import { StockCreateItemUC } from '@modules/stock/application/use-cases/stock-create-use-case';
import { TypeOrmStockItemRepository } from '@modules/stock/infrastructure/persistence/stock-items-repository-adapter';
import { ProductCreatedSubscriber } from '@modules/stock/infrastructure/messaging/product-created-subscriber';
import { stockRoutes } from '@modules/stock/infrastructure/http/routes/stock-routes';

// Express
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use( express.json() );
app.use( loggerMiddleware );
app.use( injectUserMetadata );

// Rota healthCheck
app.get('/health', health_router);

// Rotas [módulos]
app.use( '/catalog/api', sanitizeMiddleware, catalogoRoutes);
app.use( '/identity/api', sanitizeMiddleware, identityRoutes);
app.use(  '/stock/api', sanitizeMiddleware, stockRoutes);

// Rotas [documentação]
app.use('/docs/identity/api-docs', 
    swaggerUi.serveFiles(createOption('Identity')), 
    swaggerUi.setup(createOption('Identity')));
app.get('/docs/identity/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(createOption('Identity'));
});

app.use('/docs/catalog/api-docs', 
    swaggerUi.serveFiles(createOption('Catalog')), 
    swaggerUi.setup(createOption('Catalog')));
app.get('/docs/catalog/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(createOption('Catalog'));
});

app.use('/docs/stock/api-docs', 
    swaggerUi.serveFiles(createOption('Stock')), 
    swaggerUi.setup(createOption('Stock')));
app.get('/docs/stock/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(createOption('Stock'));
});


// Erros
app.use( errorHandlerMiddleware );

// Banco de dados
AppDataSource.initialize().then(async ()=>{
    console.log("Banco de dados inicializado!");

    // Mensageria
    const rabbit = RabbitMQServer.getInstance(
    `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBIT_URI}:5672/`)
    await rabbit.start();

    // Subscribers
    const itemRepository = new TypeOrmStockItemRepository();
    const stockUseCase = new StockCreateItemUC(itemRepository);
    const productSubscriber = new ProductCreatedSubscriber(stockUseCase);
    await productSubscriber.execute();

    // App
    app.listen(PORT, (err) => {
        if(err) {
            console.error(err.message);
        }

        console.log(`App rodando na porta: ${PORT}`);
    })

}).catch(error => {
    console.log(`falha ao iniciar banco de dados, erro: ${error}`);
})