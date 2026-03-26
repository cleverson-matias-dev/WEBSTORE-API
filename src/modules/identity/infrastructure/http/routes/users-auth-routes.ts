import { Request, Response, Router } from "express";
import { AuthController } from "../contrrollers/AuthController";
import { validate } from "@shared/middlewares/validator";
import { CreateUserUseCase } from "@modules/identity/application/use-cases/user-use-cases";
import { TypeOrmUserRepository } from "../../persistence/UserTypeormAdapter";
import { LoginUseCase } from "@modules/identity/application/use-cases/auth-use-cases";
import { LoginSchema } from "../validation-schemas/auth-schemas";
import { CreateUserSchema } from "../validation-schemas/user-schemas";

export const authRoutes = Router();

const repository = new TypeOrmUserRepository();
const registerUC = new CreateUserUseCase(repository);
const loginUC = new LoginUseCase(repository);

authRoutes.post('/register',
    validate(CreateUserSchema),
    (req: Request, res: Response) =>
        new AuthController(registerUC, loginUC).register(req, res));

authRoutes.post('/login',
    validate(LoginSchema),
    (req: Request, res: Response) => 
        new AuthController(registerUC, loginUC).login(req, res));
