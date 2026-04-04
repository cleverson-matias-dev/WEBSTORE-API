import { Request, Response } from "express";
import { UpdateAttributeUC, FindAttributeUC, saveAttributeUC, DeleteAttributeUC, GetAllAttributesUC } from "@modules/catalog/application/use-cases/attribute-use-cases";
import { IAttributeRepository } from "@modules/catalog/application/interfaces/repository/IAttributeRepository";
import { ILogger } from "@modules/catalog/application/interfaces/logs/ILogger";
import { AppError } from "@shared/errors/AppError";

export class AttributesController {

    constructor(
        private repo: IAttributeRepository,
        private logger: ILogger
    ){}

    async save(req: Request, res: Response){
        this.logger.debug('attempt of create attribute', req.body);
        const uc = new saveAttributeUC(this.repo);
        const response = await uc.execute(req.body);
        res.status(201).json(response);
    }

    async all(req: Request, res: Response) {
        this.logger.debug('attempt: get all attributes whith filter', req.query);
        const { page, limit, name } = req.query;
        const uc = new GetAllAttributesUC(this.repo);
        
        const result = await uc.execute({
            page: Number(page),
            limit: Number(limit),
            name: name as string
        });

        return res.status(200).json(result);
    }

    async findById(req: Request, res: Response) {
            this.logger.debug('attempt: find attribute whith filter', req.params);
            const uc = new FindAttributeUC(this.repo);
            const { id } = req.params;
            const result = await uc.execute(id as string);

            if(!result) {
                return res.status(404).json({status: 'error', errors: ['recurso não encontrado.']})
            }

            return res.status(200).json(result);
    }

    async delete(req: Request, res: Response) {
            this.logger.debug('attempt: delete attribute whith filter', req.params);
            const uc = new DeleteAttributeUC(this.repo);
            const {id} = req.params;
            const response = await uc.execute(id as string);
            if(!response) {
                return res.status(404).json({status: 'error', errors: ['Attribute não encontrado.']});
            }
            return res.status(204).json();
    }

    async update(req: Request, res: Response) {
            const uc = new UpdateAttributeUC(this.repo);
            const { id } = req.params;
            const { name } = req.body;
            await uc.execute(id as string, { name });
            res.status(204).send();
    }

}