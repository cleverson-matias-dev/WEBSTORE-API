import { Request, Response } from "express";
import { TypeORMAttributeRepository } from "../persistence/TypeORMAttributeRepository";
import { UpdateAttributeUC, FindAttributeUC, saveAttributeUC, DeleteAttributeUC, GetAllAttributesUC } from "@modules/catalogo/application/use-cases/attribute-use-cases";
import { SaveCategoryUC } from "@modules/catalogo/application/use-cases/category-use-cases";

const repo = new TypeORMAttributeRepository();

export class AttributesController {

    async save(req: Request, res: Response){
        try {
            const uc = new saveAttributeUC(repo);
            res.status(201).json(await uc.execute(req.body));
        } catch (error: any) {
            res.status(400).json({status: 'error', errors: [error.message]});
        }
    }

    async all(req: Request, res: Response) {
        try {
            const uc = new GetAllAttributesUC(repo);
            return res.status(200).json(await uc.execute());
        } catch (error: any){
            return res.status(400).json({status: 'error', errors: [error.message]});
        }
    }

    async findById(req: Request, res: Response) {
        try {

            const uc = new FindAttributeUC(repo);
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
            const uc = new DeleteAttributeUC(repo);
            const {id} = req.params;
            const response = await uc.execute(id as string);
            if(!response) {
                return res.status(404).json({status: 'error', errors: ['Attribute não encontrado.']});
            }
            return res.status(204).json();
        } catch (error: any){
            return res.status(400).json({status: 'error', errors: [error.message]});
        }
    }

    async update(req: Request, res: Response) {
           
        try {
            const uc = new UpdateAttributeUC(repo);
            const {id} = req.params;
            const { name } = req.body;
            await uc.execute(id as string, { name });

            res.status(204).json()
        } catch (error: any){
            return res.status(400).json({status: 'error', errors: [error.message]});
        }
    }


}