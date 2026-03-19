import { Request, Response } from "express";
import { TypeORMCategoryRepository } from "../persistence/TypeORMCategoryRepository";
import { CriarCategoria, ListarCategorias, BuscarCategoria, DeletarCategoria, AlterarCategoria } from "@modules/catalogo/application/use-cases/categoria-use-cases";
import { Categoria } from "@modules/catalogo/domain/entities/categoria.entity";

const repo = new TypeORMCategoryRepository();

export class CategoryController {
    async create(req: Request, res: Response) {
        try {
            const data = req.body;
            const useCase = new CriarCategoria(repo);
            return res.status(201).json(await useCase.executar(data));

        } catch (error: any) {
            return res.status(400).json({status: 'error', errors: [error.message]})
        }
    }

    async all(req: Request, res: Response) {
        try {
           const useCase = new ListarCategorias(repo);
           return res.status(200).json(await useCase.executar());
        } catch (error: any){
            return res.status(400).json({status: 'error', errors: [error.message]});
        }
    }

    async find(req: Request, res: Response) {
        try {

           const useCase = new BuscarCategoria(repo);
           const {id} = req.params;
           const result = await useCase.executar(id as string);

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
           const useCase = new DeletarCategoria(repo);
           const {id} = req.params;
           const response = await useCase.executar(id as string);
           if(!response) {
             return res.status(404).json({status: 'error', errors: ['Categoria não encontrada.']});
           }
           return res.status(204).json();
        } catch (error: any){
            return res.status(400).json({status: 'error', errors: [error.message]});
        }
    }

    async update(req: Request, res: Response) {
       
        try {
           const useCase = new AlterarCategoria(repo);
           const {id} = req.params;
           const { nome } = req.body;
           await useCase.executar(id as string, { nome });
           return res.status(204).json();

        } catch (error: any){
           return res.status(400).json({status: 'error', errors: [error.message]});
        }
    }

}