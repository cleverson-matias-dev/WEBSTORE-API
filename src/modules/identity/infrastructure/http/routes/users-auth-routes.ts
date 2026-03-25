import { Request, Response, Router } from "express";
import { AuthController } from "../contrrollers/AuthController";
import { validate } from "@shared/middlewares/validator";
import { loginUserSchema, registerUserSchema } from "../validation-schemas/user-schemas";

export const authRoutes = Router();

authRoutes.post('/register',
    validate(registerUserSchema),
    (req: Request, res: Response) => new AuthController().register(req, res));

authRoutes.post('/login',
    validate(loginUserSchema),
    (req: Request, res: Response) => new AuthController().login(req, res));