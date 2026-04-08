import { Request, Response } from "express";
import { SaveCategoryUC, GetAllCategoriesUC, FindCategoryByIdUC, DeleteCategoryUC, UpdateCategoryUC } from "@modules/catalog/application/use-cases/category-use-cases";
import { ICategoryRepository } from "@modules/catalog/application/interfaces/repository/ICategoryRepository";
import { ILogger } from "@modules/catalog/application/interfaces/logs/ILogger";
import { IProductRepository } from "@modules/catalog/application/interfaces/repository/IProductRepository";



export class CategoryController {

    constructor(
        private product_repo: IProductRepository,
        private repo: ICategoryRepository,
        private logger: ILogger
    ){}

    async save(req: Request, res: Response) {
        this.logger.debug('attempt: save categories whith filter', req.body);
        const data = req.body;        
        const uc = new SaveCategoryUC(this.repo);
        return res.status(201).json(await uc.execute(data));
    }

    async all(req: Request, res: Response) {
        this.logger.debug('attempt: get categories whith filter', req.query);
        const { name, limit, page } = req.query;
        const useCase = new GetAllCategoriesUC(this.repo);

        const result = await useCase.execute({
            name: name as string,
            limit: Number(limit),
            page:  Number(page)
        });

        return res.status(200).json(result);
    }

    async findById(req: Request, res: Response) {
        this.logger.debug('attempt: find categories whith filter', req.params);
        const uc = new FindCategoryByIdUC(this.repo);
        const { id } = req.params;
        const result = await uc.execute(id as string);
        
        if(!result) {
            return res.status(404).json({status: 'error', errors: ['recurso não encontrado.']})
        }

        return res.status(200).json(result);
    }

    async delete(req: Request, res: Response) {
        const uc = new DeleteCategoryUC(this.repo, this.product_repo);
        const {id} = req.params;
        await uc.execute(id as string);

        return res.status(204).send();
    }

    async update(req: Request, res: Response) {
           this.logger.debug('attempt: update categories whith filter', {...req.params, ...req.body});
           const uc = new UpdateCategoryUC(this.repo);
           const { id } = req.params;
           const { name } = req.body;
           await uc.execute(id as string, { name });
           return res.status(204).send();
    }

}