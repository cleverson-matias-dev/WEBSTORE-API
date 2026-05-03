import { Router, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import { createOption } from '@config/swagger';
import { sanitizeMiddleware } from '@shared/middlewares/sanitizeMiddleware';
import catalogRoutes from '@modules/catalog/infrastructure/http/routes/routes';
import { identityRoutes } from '@modules/identity/infrastructure/http/routes/routes';
import { stockRoutes } from '@modules/stock/infrastructure/http/routes/stock-routes';
import health_router from '../health/routes';

const routes = Router();

/**
 * Setup simplificado de documentação Swagger
 */
const setupSwagger = (path: string, name: string): void => {
  const options = createOption(name);
  routes.use(`/docs/${path}/api-docs`, swaggerUi.serveFiles(options), swaggerUi.setup(options));
  routes.get(`/docs/${path}/swagger.json`, (_req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(options);
  });
};

// Health Check
routes.get('/health', health_router);

// API Modules
routes.use('/catalog/api', sanitizeMiddleware, catalogRoutes);
routes.use('/identity/api', sanitizeMiddleware, identityRoutes);
routes.use('/stock/api', sanitizeMiddleware, stockRoutes);

// Documentation Modules
setupSwagger('identity', 'Identity');
setupSwagger('catalog', 'Catalog');
setupSwagger('stock', 'Stock');

export default routes;
