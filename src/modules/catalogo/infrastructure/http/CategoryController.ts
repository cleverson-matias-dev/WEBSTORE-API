import { Request, Response } from "express";
import { TypeORMCategoryRepository } from "../persistence/TypeORMCategoryRepository";
import { SaveCategoryUC, GetAllCategoriesUC, FindCategoryByIdUC, DeleteCategoryUC, UpdateCategoryUC } from "@modules/catalogo/application/use-cases/category-use-cases";

const repo = new TypeORMCategoryRepository();

export class CategoryController {
    async save(req: Request, res: Response) {
        try {
            const data = req.body;        
            const uc = new SaveCategoryUC(repo);
            return res.status(201).json(await uc.execute(data));

        } catch (error: any) {
            return res.status(400).json({status: 'error', errors: [error.message]})
        }
    }

    async all(req: Request, res: Response) {
        try {
           const useCase = new GetAllCategoriesUC(repo);
           return res.status(200).json(await useCase.execute());
        } catch (error: any){
            return res.status(400).json({status: 'error', errors: [error.message]});
        }
    }

    async findById(req: Request, res: Response) {
        try {

           const uc = new FindCategoryByIdUC(repo);
           const {id} = req.params;
           const result = await uc.execute(id as string);

           if(!result) {
                return res.status(404).json({status: 'error', errors: ['recurso não encontrado.']})
           }

           return res.status(200).json(result);

        } catch (error: any){
            return res.status(400).json({status: 'error', errors: [error.message]});
        }
    }

    async delete(req: Request, res: Response) {
        try {
           const uc = new DeleteCategoryUC(repo);
           const {id} = req.params;
           const response = await uc.execute(id as string);
           if(!response) {
             return res.status(404).json({status: 'error', errors: ['Category não encontrada.']});
           }
           return res.status(204).json();
        } catch (error: any){
            return res.status(400).json({status: 'error', errors: [error.message]});
        }
    }

    async update(req: Request, res: Response) {
       
        try {
           const uc = new UpdateCategoryUC(repo);
           const {id} = req.params;
           const { name } = req.body;
           await uc.execute(id as string, { name });
           return res.status(204).json();

        } catch (error: any){
           return res.status(400).json({status: 'error', errors: [error.message]});
        }
    }

}