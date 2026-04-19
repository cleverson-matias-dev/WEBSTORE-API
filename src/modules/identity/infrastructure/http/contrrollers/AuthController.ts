// controllers/auth.controller.ts
import { Request, Response } from 'express';
import { CreateUserUseCase } from '@modules/identity/application/use-cases/user-use-cases'; 
import { LoginUseCase } from '@modules/identity/application/use-cases/auth-use-cases'; 
import type { RefreshTokenUseCase } from '@modules/identity/application/use-cases/refresh-token-use-case';

export class AuthController {
  constructor(
    private registerUC: CreateUserUseCase,
    private loginUC: LoginUseCase,
    private refreshTokenUC: RefreshTokenUseCase
  ) {}

  // Rota: POST /auth/register
  async register(req: Request, res: Response) {
    const { user } = req;
    const result = await this.registerUC.execute(req.body, user);
    return res.status(201).json(result);
  }

  // Rota: POST /auth/login
  async login(req: Request, res: Response) {
    const result = await this.loginUC.execute(req.body);
    return res.json(result);
  }

  // Rota: POST /auth/refresh-token
  async refresh(req: Request, res: Response) {
    const { refreshToken } = req.body;
    const result = await this.refreshTokenUC.execute(refreshToken);
    return res.json(result);
  }
}
