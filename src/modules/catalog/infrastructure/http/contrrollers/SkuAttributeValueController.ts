import { SkuAttributeValueService } from '@modules/catalog/application/use-cases/sku-attribute-value-use-cases';
import { Request, Response } from 'express';

export class SkuAttributeValueController {
  constructor(private readonly service: SkuAttributeValueService) {}

  async create(req: Request, res: Response) {
    const result = await this.service.assignAttribute(req.body);
    return res.status(201).json(result);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { novoValor } = req.body;
    
    const result = await this.service.updateValue({ id: id as string, novoValor });
    return res.status(200).json(result);
  }

  async listBySku(req: Request, res: Response) {
    const { skuId } = req.params;
    const result = await this.service.listBySku(skuId as string);
    return res.status(200).json(result);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await this.service.remove(id as string);
    return res.status(204).send();
  }
}
