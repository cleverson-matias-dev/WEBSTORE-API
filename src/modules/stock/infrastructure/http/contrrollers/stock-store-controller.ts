import type { StoreStockUseCases } from '@modules/stock/application/use-cases/stock-store-use-cases';
import { Request, Response } from 'express';

export class StockStoreController {
  constructor(private readonly storeUseCases: StoreStockUseCases) {}

  async checkAvailability(req: Request, res: Response) {
    const { sku, warehouseId } = req.query;
    
    const result = await this.storeUseCases.checkAvailability({
      sku: String(sku),
      warehouseId: String(warehouseId)
    });

    return res.status(200).json(result);
  }

  async reserve(req: Request, res: Response) {
    const result = await this.storeUseCases.reserve(req.body);
    return res.status(201).json(result);
  }
}
