import { Request, Response } from "express";
import { TypeORMCategoryRepository } from "../persistence/TypeORMCategoryRepository";
import { CriarCategoria } from "@modules/catalogo/application/use-cases/criar-categoria";

const repo = new TypeORMCategoryRepository();

export class CategoryController {
    async create(req: Request, res: Response) {
        try {
            
            const data = req.body;
            const useCase = new CriarCategoria(repo);
            await useCase.executar(data);
            return res.status(201).json([]);
            
        } catch (error: any) {
            return res.status(400).json({error: error.message})
        }
    }
}