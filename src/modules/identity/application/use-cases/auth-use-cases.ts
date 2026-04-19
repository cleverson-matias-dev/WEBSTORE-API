import { IUserRepository } from '../interfaces/repository/interface-user-repository';
// Adicione a interface do repositório de refresh token
import { IRefreshTokenRepository } from '../interfaces/repository/interface-refresh-token-repository'; 
import { UserMapper } from '../dtos/user-mappers'; 
import * as bcrypt from 'bcrypt'; 
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import { AuthResponseDTO, LoginDTO } from '../dtos/auth-dtos';
import { AppError } from '@shared/errors/AppError';

export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private refreshTokenRepository: IRefreshTokenRepository // Novo repositório
  ) {}

  async execute(data: LoginDTO): Promise<AuthResponseDTO> {
    // 1. Busca o usuário e valida existência
    const [userDomain] = await this.userRepository.findBy({ email: data.email });
    
    if (!userDomain) {
      throw new AppError('Credenciais inválidas', 401);
    }

    // 2. Valida se o usuário está ativo
    if (userDomain.isActive === "0") {
      throw new AppError('Usuário desativado ou inativo', 403);
    }

    // 3. Valida a senha
    const isPasswordValid = await bcrypt.compare(data.password, userDomain.password);

    if (!isPasswordValid) {
      throw new AppError('Credenciais inválidas', 401);
    }

    // 4. Geração do Access Token (JWT) - Curta duração
    const token = jwt.sign(
      { 
        id: userDomain.id, 
        role: userDomain.role,
        iss: 'api-modular-node' 
      },
      process.env.JWT_SECRET || 'secret',
      { 
        expiresIn: '15m', // Tempo reduzido por segurança
        algorithm: 'HS256' 
      }
    );

    // 5. Geração do Refresh Token - Longa duração e persistente
    const refreshToken = crypto.randomBytes(40).toString('hex');
    
    const refreshTokenExpiresAt = new Date();
    refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + 7); // 7 dias

    // 6. Persistência do Refresh Token (Invalida tokens anteriores do usuário se desejar)
    await this.refreshTokenRepository.deleteByUserId(userDomain.id!);
    await this.refreshTokenRepository.save(
      userDomain.id!,
      refreshToken,
      refreshTokenExpiresAt
    );

    return {
      user: UserMapper.toDTO(userDomain),
      token,
      refreshToken
    };
  }
}
