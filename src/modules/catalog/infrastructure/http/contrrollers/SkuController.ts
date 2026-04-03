import { CreateSkuInputDto } from '@modules/catalog/application/dtos/sku-dtos';
import { SkuUseCases } from '@modules/catalog/application/use-cases/sku-use-cases';
import { Request, Response } from 'express';

export class SkuController {
  constructor(private readonly skuUseCases: SkuUseCases) {}

  async create(req: Request, res: Response): Promise<void> {
    const input: CreateSkuInputDto = req.body;
    const output = await this.skuUseCases.create(input);
    res.status(201).json(output);
  }

  async getByProductId(req: Request, res: Response): Promise<void> {
    const { product_id } = req.params;
    const output = await this.skuUseCases.getByProductId(product_id as string);
    res.status(200).json(output);
  }

  async updatePrice(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { newPrice, currency } = req.body;
    
    const output = await this.skuUseCases.updatePrice({ 
      id: id as string, 
      newPrice: Number(newPrice), 
      currency: currency
    });
    
    res.status(200).json(output);
  }

  async updateLogistics(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { weight, dimensions } = req.body;
    
    const output = await this.skuUseCases.updateLogistics({ 
      id: id as string, 
      weight: Number(weight), 
      dimensions 
    });
    
    res.status(200).json(output);
  }

  async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const output = await this.skuUseCases.getById(id as string);
    res.status(200).json(output);
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await this.skuUseCases.delete(id as string);
    res.status(204).send();
  }
}
