// use-cases/auth/login.usecase.ts
import { IUserRepository } from '../interfaces/repository/interface-user-repository'; 
import { UserMapper } from '../dtos/user-mappers'; 
import * as bcrypt from 'bcrypt'; 
import * as jwt from 'jsonwebtoken';
import { AuthResponseDTO, LoginDTO } from '../dtos/auth-dtos';
import { AppError } from '@shared/errors/AppError';

export class LoginUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: LoginDTO): Promise<AuthResponseDTO> {
   
    const [userDomain] = await this.userRepository.findBy({ email: data.email });
    
    if (!userDomain) {
      throw new AppError('Credenciais inválidas', 401);
    }

    const isPasswordValid = await bcrypt.compare(
      data.password, 
      (userDomain as any).props.password.getValue 
    );

    if (!isPasswordValid) {
      throw new AppError('Credenciais inválidas', 401);
    }

    if (!(userDomain as any).props.isActive) {
      throw new Error('Usuário desativado');
    }

    const token = jwt.sign(
      { id: userDomain.id, role: (userDomain as any).props.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );

    return {
      user: UserMapper.toDTO(userDomain),
      token
    };
  }
}
