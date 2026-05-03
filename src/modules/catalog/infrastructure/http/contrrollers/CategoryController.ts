import { Request, Response } from "express";
import { SaveCategoryUC, GetAllCategoriesUC, FindCategoryByIdUC, DeleteCategoryUC, UpdateCategoryUC } from "@modules/catalog/application/use-cases/category-use-cases";

export class CategoryController {

    constructor(
        private saveUseCase: SaveCategoryUC,
        private getAllUseCase: GetAllCategoriesUC,
        private findByIdUseCase: FindCategoryByIdUC,
        private deleteUseCase: DeleteCategoryUC,
        private updateUseCase: UpdateCategoryUC
    ){}

    async save(req: Request, res: Response) {
        const data = req.body;        
        return res.status(201).json(await this.saveUseCase.execute(data));
    }

    async all(req: Request, res: Response) {
        const { name, limit, page } = req.query;

        const result = await this.getAllUseCase.execute({
            name: name as string,
            limit: Number(limit),
            page:  Number(page)
        });

        return res.status(200).json(result);
    }

    async findById(req: Request, res: Response) {
        const { id } = req.params;
        const result = await this.findByIdUseCase.execute(id as string);
        
        if(!result) {
            return res.status(404).json({status: 'error', errors: ['recurso não encontrado.']})
        }

        return res.status(200).json(result);
    }

    async delete(req: Request, res: Response) {
        const {id} = req.params;
        await this.deleteUseCase.execute(id as string);
        return res.status(204).send();
    }

    async update(req: Request, res: Response) {
           const { id } = req.params;
           const { name } = req.body;
           await this.updateUseCase.execute(id as string, { name });
           return res.status(204).send();
    }

}