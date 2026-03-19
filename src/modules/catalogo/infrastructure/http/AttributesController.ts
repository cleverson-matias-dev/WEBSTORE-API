import { Request, Response } from "express";
import { TypeORMAttributeRepository } from "../persistence/TypeORMAttributeRepository";
import { AlterarAtributo, BuscarAtributo, CriarAtributo, DeletarAtributo, ListarAtributos } from "@modules/catalogo/application/use-cases/atributo-use-cases";
import { Atributo } from "@modules/catalogo/domain/entities/atributo.entity";

const repo = new TypeORMAttributeRepository();

export class AttributesController {

    async create(req: Request, res: Response){
        try {
            res.status(201).json(await (new CriarAtributo(repo)).executar(req.body));
        } catch (error: any) {
            res.status(400).json({status: 'error', errors: [error.message]});
        }
    }

    async all(req: Request, res: Response) {
        try {
            const useCase = new ListarAtributos(repo);
            return res.status(200).json(await useCase.executar());
        } catch (error: any){
            return res.status(400).json({status: 'error', errors: [error.message]});
        }
    }

    async find(req: Request, res: Response) {
        try {

            const useCase = new BuscarAtributo(repo);
            const {id} = req.params;
            const result = await useCase.executar(id);

            if(!(result instanceof Atributo)) {
                return res.status(404).json({status: 'error', errors: ['recuso não encontrado.']})
            }

            return res.status(200).json(result);

        } catch (error: any){
            return res.status(400).json({status: 'error', errors: [error.message]});
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const useCase = new DeletarAtributo(repo);
            const {id} = req.params;
            const response = await useCase.executar(id);
            if(!response) {
                return res.status(404).json({status: 'error', errors: ['Atributo não encontrado.']});
            }
            return res.status(204).json(response);
        } catch (error: any){
            return res.status(400).json({status: 'error', errors: [error.message]});
        }
    }

    async update(req: Request, res: Response) {
           
        try {
            const useCase = new AlterarAtributo(repo);
            const {id, nome} = req.body;
            const result = await useCase.executar(id, nome);

            if(!result) {
                return res.status(404).json({status: 'error', errors: ['Atributo não encontrado.']})
            }

            res.status(204).json()
        } catch (error: any){
            return res.status(400).json({status: 'error', errors: [error.message]});
        }
    }


}