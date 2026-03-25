import { Request, Response } from "express";

export class AuthController {

    register(req: Request, res: Response){
        res.json(req.body);
    }
    
    login(req: Request, res: Response){
        res.json(req.body);
    }
}