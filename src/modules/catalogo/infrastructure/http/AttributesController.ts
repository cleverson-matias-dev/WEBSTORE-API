import { Request, Response } from "express";
import { TypeORMAttributeRepository } from "../persistence/TypeORMAttributeRepository";
import { UpdateAttributeUC, FindAttributeUC, saveAttributeUC, DeleteAttributeUC, GetAllAttributesUC } from "@modules/catalogo/application/use-cases/attribute-use-cases";

const repo = new TypeORMAttributeRepository();

export class AttributesController {

    async save(req: Request, res: Response){
        const uc = new saveAttributeUC(repo);
        const response = await uc.execute(req.body);
        res.status(201).json(response);
    }

    async all(req: Request, res: Response) {

        const { page, limit, name } = req.query;
        const uc = new GetAllAttributesUC(repo);
        
        const result = await uc.execute({
            page: Number(page),
            limit: Number(limit),
            name: name as string
        });

        return res.status(200).json(result);
    }

    async findById(req: Request, res: Response) {

            const uc = new FindAttributeUC(repo);
            const { id } = req.params;
            const result = await uc.execute(id as string);

            if(!result) {
                return res.status(404).json({status: 'error', errors: ['recurso não encontrado.']})
            }

            return res.status(200).json(result);
    }

    async delete(req: Request, res: Response) {
            const uc = new DeleteAttributeUC(repo);
            const {id} = req.params;
            const response = await uc.execute(id as string);
            if(!response) {
                return res.status(404).json({status: 'error', errors: ['Attribute não encontrado.']});
            }
            return res.status(204).json();
    }

    async update(req: Request, res: Response) {
           
            const uc = new UpdateAttributeUC(repo);
            const { id } = req.params;
            const { name } = req.body;
            await uc.execute(id as string, { name });
            res.status(204).send();
    }

}