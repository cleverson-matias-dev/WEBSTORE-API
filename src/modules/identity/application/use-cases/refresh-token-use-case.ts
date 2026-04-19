import { AppError } from "@shared/errors/AppError";
import type { AuthResponseDTO } from "../dtos/auth-dtos";
import type { IUserRepository } from "../interfaces/repository/interface-user-repository";
import * as jwt from 'jsonwebtoken';
import crypto from 'crypto';
import type { IRefreshTokenRepository } from "../interfaces/repository/interface-refresh-token-repository";
import { UserMapper } from "../dtos/user-mappers";


export class RefreshTokenUseCase {
  constructor(
    private userRepository: IUserRepository,
    private refreshRepository: IRefreshTokenRepository
  ) {}

  async execute(oldRefreshToken: string): Promise<AuthResponseDTO> {
    const storedToken = await this.refreshRepository.findByToken(oldRefreshToken);
    console.log(storedToken)

    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new AppError('Refresh token inválido ou expirado', 401);
    }

    const user = await this.userRepository.findById(storedToken.userId);
    if (!user || !user.isActive) {
      throw new AppError('Usuário não autorizado', 401);
    }

    // Opcional: Deletar o token usado (Refresh Token Rotation)
    await this.refreshRepository.deleteByUserId(user.id!);

    // Gerar novos tokens
    console.log('dados_user', user, process.env.JWT_SECRET)
    const newToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '15m' });
    const newRefreshToken = crypto.randomBytes(40).toString('hex');
    
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Expira em 7 dias

    await this.refreshRepository.save(user.id!, newRefreshToken, expiresAt);

    return {
      user: UserMapper.toDTO(user),
      token: newToken,
      refreshToken: newRefreshToken
    };
  }
}
