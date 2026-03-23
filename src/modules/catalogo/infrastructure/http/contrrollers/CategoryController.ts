import { Request, Response } from "express";
import { TypeORMCategoryRepository } from "../../persistence/TypeORMCategoryRepository";
import { SaveCategoryUC, GetAllCategoriesUC, FindCategoryByIdUC, DeleteCategoryUC, UpdateCategoryUC } from "@modules/catalogo/application/use-cases/category-use-cases";
import { PinoLoggerAdapter } from "../../../../../shared/logger/PinoLoggerAdapter";

const repo = new TypeORMCategoryRepository();
const logger = new PinoLoggerAdapter();

export class CategoryController {

    async save(req: Request, res: Response) {
        logger.info('attempt: save categories whith filter', req.body);
        const data = req.body;        
        const uc = new SaveCategoryUC(repo);
        return res.status(201).json(await uc.execute(data));
    }

    async all(req: Request, res: Response) {
        logger.info('attempt: get categories whith filter', req.query);
        const { name, limit, page } = req.query;
        const useCase = new GetAllCategoriesUC(repo);

        const result = await useCase.execute({
            name: name as string,
            limit: Number(limit),
            page:  Number(page)
        });

        return res.status(200).json(result);
    }

    async findById(req: Request, res: Response) {
        logger.info('attempt: find categories whith filter', req.params);
        const uc = new FindCategoryByIdUC(repo);
        const { id } = req.params;
        const result = await uc.execute(id as string);

        if(!result) {
            return res.status(404).json({status: 'error', errors: ['recurso não encontrado.']})
        }

        return res.status(200).json(result);
    }

    async delete(req: Request, res: Response) {
        logger.info('attempt: delete categories whith filter', req.params);
        const uc = new DeleteCategoryUC(repo);
        const {id} = req.params;
        const response = await uc.execute(id as string);

        if(!response) {
            return res.status(404).json({status: 'error', errors: ['Category não encontrada.']});
        }

        return res.status(204).json();
    }

    async update(req: Request, res: Response) {
           logger.info('attempt: update categories whith filter', {...req.params, ...req.body});
           const uc = new UpdateCategoryUC(repo);
           const { id } = req.params;
           const { name } = req.body;
           const result = await uc.execute(id as string, { name });
           return res.status(204).send();
    }

}