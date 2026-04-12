import { Router, Request, Response } from 'express';
import { getHealthStatus } from './health.service';
import { AppDataSource } from '../db/data-source';

const health_router = Router();

health_router.get('/health', async (req: Request, res: Response) => {
  const health = await getHealthStatus(AppDataSource);

  if (health.status === 'error') {
    return res.status(503).json(health);
  }

  return res.status(200).json(health);
});

export default health_router;
