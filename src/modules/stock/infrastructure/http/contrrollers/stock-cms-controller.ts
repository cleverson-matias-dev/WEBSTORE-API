import type { CmsStockUseCases } from '@modules/stock/application/use-cases/stock-cms-use-cases';
import type { StockWarehouseUseCases } from '@modules/stock/application/use-cases/stock-warehouse-use-cases';
import { Request, Response } from 'express';

export class StockCmsController {
  constructor(
    private readonly cmsUseCases: CmsStockUseCases,
    private readonly warehouseUseCases: StockWarehouseUseCases
  ) {}

  async adjust(req: Request, res: Response) {
    await this.cmsUseCases.adjustQuantity(req.body);
    return res.status(204).send();
  }

  async getDetails(req: Request, res: Response) {
    const { sku } = req.params;
    const result = await this.cmsUseCases.getStockDetails(sku as string);
    return res.status(200).json(result);
  }

  async createWarehouse(req: Request, res: Response) {
    const result = await this.warehouseUseCases.create(req.body);
    return res.status(201).json(result);
  }

  async listWarehouses(req: Request, res: Response) {
    const result = await this.warehouseUseCases.listAll();
    return res.status(200).json(result);
  }
}
