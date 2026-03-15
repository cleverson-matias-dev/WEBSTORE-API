import { Request, Response } from "express";

export class CategoryController {
    async create(req: Request, res: Response) {
        try {
            return res.status(201).json([]);
        } catch (error: any) {
            return res.status(400).json({error: error.message})
        }
    }
}