import { Request, Response, Router } from "express";
import { AuthController } from "../contrrollers/AuthController";
import { validate } from "@shared/middlewares/validator";
import { CreateUserUseCase } from "@modules/identity/application/use-cases/user-use-cases";
import { TypeOrmUserRepository } from "../../persistence/UserTypeormAdapter";
import { LoginUseCase } from "@modules/identity/application/use-cases/auth-use-cases";
import { LoginSchema, RefreshSchema } from "../validation-schemas/auth-schemas";
import { CreateUserSchema } from "../validation-schemas/user-schemas";
import { RefreshTokenUseCase } from "@modules/identity/application/use-cases/refresh-token-use-case";
import { TypeOrmRefreshTokenRepository } from "../../persistence/RefreshTypeormAdapter";

export const authRoutes = Router();

const repository = new TypeOrmUserRepository();
const refreshRepository = new TypeOrmRefreshTokenRepository();
const registerUC = new CreateUserUseCase(repository);
const loginUC = new LoginUseCase(repository, refreshRepository);
const refreshUC = new RefreshTokenUseCase(repository, refreshRepository);

authRoutes.post('/register',
    validate(CreateUserSchema),
    (req: Request, res: Response) =>
        new AuthController(registerUC, loginUC, refreshUC).register(req, res));

authRoutes.post('/login',
    validate(LoginSchema),
    (req: Request, res: Response) => 
        new AuthController(registerUC, loginUC, refreshUC).login(req, res));

authRoutes.post('/refresh',
    validate(RefreshSchema),
    (req: Request, res: Response) => 
        new AuthController(registerUC, loginUC, refreshUC).refresh(req, res));
