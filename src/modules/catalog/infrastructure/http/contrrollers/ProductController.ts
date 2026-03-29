
import { Request, Response } from "express";
import { CreateProductUseCase, ListProductsUseCase, GetProductUseCase, UpdateProductUseCase, DeleteProductUseCase } from "@modules/catalog/application/use-cases/product-use-cases";

export class ProductController {
  constructor(
    private createProductUseCase: CreateProductUseCase,
    private listProductsUseCase: ListProductsUseCase,
    private getProductUseCase: GetProductUseCase,
    private updateProductUseCase: UpdateProductUseCase,
    private deleteProductUseCase: DeleteProductUseCase
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    const output = await this.createProductUseCase.execute(req.body);
    res.status(201).json(output);
  }

  async list(req: Request, res: Response): Promise<void> {
    const { page, limit, name, slug, description } = req.query;
    
    const output = await this.listProductsUseCase.execute(
      Number(page) || 1,
      Number(limit) || 10,
      { 
        name: name as string, 
        slug: slug as string, 
        description: description as string 
      }
    );
    
    res.status(200).json(output);
  }

  async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const output = await this.getProductUseCase.execute({id});
    res.status(200).json(output);
  }

  async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const output = await this.updateProductUseCase.execute({
      id,
      ...req.body
    });
    res.status(200).json(output);
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const output = await this.deleteProductUseCase.execute(id as string);
    res.status(204).send();
  }
}
