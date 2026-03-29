import { CreateImageUseCase, DeleteImageUseCase, GetImageByIdUseCase, ListImagesUseCase, UpdateImageUseCase } from '@modules/catalog/application/use-cases/image-use-cases';
import { Request, Response } from 'express';

export class ImageController {
  constructor(
    private createUC: CreateImageUseCase,
    private getByIdUC: GetImageByIdUseCase,
    private listUC: ListImagesUseCase,
    private updateUC: UpdateImageUseCase,
    private deleteUC: DeleteImageUseCase
  ) {}

  async create(req: Request, res: Response) {
    const result = await this.createUC.execute(req.body);
    res.status(201).json(result);
  }

  async findById(req: Request, res: Response) {
    const result = await this.getByIdUC.execute(req.params.id as string);
    res.status(200).json(result);
  }

  async index(req: Request, res: Response) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    
    const result = await this.listUC.execute(page, limit);
    res.status(200).json(result);
  }

  async update(req: Request, res: Response) {
    const success = await this.updateUC.execute({
      id: req.params.id,
      ...req.body
    });
    res.status(204).send();
  }

  async delete(req: Request, res: Response) {
    await this.deleteUC.execute(req.params.id as string);
    res.status(204).send();
  }
}
