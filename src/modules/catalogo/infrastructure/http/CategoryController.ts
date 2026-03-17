import { Request, Response } from "express";
import { TypeORMCategoryRepository } from "../persistence/TypeORMCategoryRepository";
import { CriarCategoria } from "@modules/catalogo/application/use-cases/criar-categoria";
import { listarCategorias } from "@modules/catalogo/application/use-cases/listar-categorias";
import { BuscarCategoria } from "@modules/catalogo/application/use-cases/buscar-categoria";
import { DeletarCategoria } from "@modules/catalogo/application/use-cases/deletar-categoria";
import { AlterarCategoria } from "@modules/catalogo/application/use-cases/alterar-categoria";

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
           const useCase = new listarCategorias(repo);
           return res.status(200).json(await useCase.executar());
        } catch (error: any){
            return res.status(400).json({status: 'error', errors: [error.message]});
        }
    }

    async find(req: Request, res: Response) {
        try {

           const useCase = new BuscarCategoria(repo);
           const {id} = req.params;
           const result = await useCase.executar(id);
           if(!result) {
                return res.status(404).json({status: 'error', errors: ['recuso não encontrado.']})
           }

           return res.status(200).json(await useCase.executar(id));

        } catch (error: any){
            return res.status(400).json({status: 'error', errors: [error.message]});
        }
    }

    async delete(req: Request, res: Response) {
        try {
           const useCase = new DeletarCategoria(repo);
           const {id} = req.params;
           const response = await useCase.executar(id);
           if(!response) {
             return res.status(404).json({status: 'error', errors: ['Categoria não encontrada.']});
           }
           return res.status(204).json(response);
        } catch (error: any){
            return res.status(400).json({status: 'error', errors: [error.message]});
        }
    }

    async update(req: Request, res: Response) {
       
        try {
           const useCase = new AlterarCategoria(repo);
           const {id, nome} = req.body;
           return res.status(200).json(await useCase.executar(id, nome));

        } catch (error: any){
           return res.status(400).json({status: 'error', errors: [error.message]});
        }
    }

}