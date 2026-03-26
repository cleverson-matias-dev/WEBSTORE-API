import { Request, Response } from "express";
import { ILogger } from "@modules/catalog/application/interfaces/logs/ILogger";



export class ImagesController {

    constructor(
        private repo: IImageRepository,
        private logger: ILogger
    ){}

    async save(req: Request, res: Response) {
        this.logger.debug('attempt: save images whith filter', req.body);
        const data = req.body;        
        const uc = new SaveImageUC(this.repo);
        return res.status(201).json(await uc.execute(data));
    }

    async all(req: Request, res: Response) {
        res.json('in construction')
        this.logger.debug('attempt: get images whith filter', req.query);
        const { name, limit, page } = req.query;
        const useCase = new GetAllImagesUC(this.repo);

        const result = await useCase.execute({
            name: name as string,
            limit: Number(limit),
            page:  Number(page)
        });

        return res.status(200).json(result);
    }

    async findById(req: Request, res: Response) {
        res.json('in construction')
        this.logger.debug('attempt: find images whith filter', req.params);
        const uc = new FindImageByIdUC(this.repo);
        const { id } = req.params;
        const result = await uc.execute(id as string);
        
        if(!result) {
            return res.status(404).json({status: 'error', errors: ['recurso não encontrado.']})
        }

        return res.status(200).json(result);
    }

    async delete(req: Request, res: Response) {
        res.json('in construction')
        this.logger.debug('attempt: delete images whith filter', req.params);
        const uc = new DeleteImageUC(this.repo);
        const {id} = req.params;
        const response = await uc.execute(id as string);

        if(!response) {
            return res.status(404).json({status: 'error', errors: ['Category não encontrada.']});
        }

        return res.status(204).json();
    }

    async update(req: Request, res: Response) {
           res.json('in construction')
           this.logger.debug('attempt: update images whith filter', {...req.params, ...req.body});
           const uc = new UpdateImageUC(this.repo);
           const { id } = req.params;
           const { name } = req.body;
           const result = await uc.execute(id as string, { name });
           return res.status(204).send();
    }

}