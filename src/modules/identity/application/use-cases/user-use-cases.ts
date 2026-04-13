import { CreateUserDTO, UpdateUserDTO } from "@modules/identity/infrastructure/http/validation-schemas/user-schemas";
import { UserResponseDTO } from "../dtos/user-dtos";
import { IUserRepository, PaginatedResult, PaginationParams, UserFilters } from "../interfaces/repository/interface-user-repository";
import { Email } from "@modules/identity/domain/value-objects/email-vo";
import { Password } from "@modules/identity/domain/value-objects/password-vo";
import { User, UserProps } from "@modules/identity/domain/entities/User";
import { UserMapper } from "../dtos/user-mappers";
import * as bcrypt from 'bcrypt';
import { AppError } from "@shared/errors/AppError";
import { UserRole } from "@shared/middlewares/authorization-middleware";

type user_creator = { id:string, role: UserRole } | undefined

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: CreateUserDTO, user_creator: user_creator): Promise<UserResponseDTO> {

    if (data.role === UserRole.ADMIN) {
        if((!user_creator) || (user_creator && user_creator.role !== UserRole.ADMIN)){
          throw new AppError('Acesso negado. somente usuarios admin podem criar outros admins', 403);
        } 
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const password = Password.create(hashedPassword);
    
    const email = Email.create(data.email);

    const existing = await this.userRepository.findBy({ email: data.email });
    if (existing.length > 0) throw new AppError('Usuário já existe', 409);

    const user = User.create({ ...data, email, password } as UserProps);

    const savedUser = await this.userRepository.save(user);
    
    return UserMapper.toDTO(savedUser);
  }
}

export class ListUsersUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(params: PaginationParams): Promise<PaginatedResult<UserResponseDTO>> {
    const limit = params.limit || 10;
    const page = params.page || 1;
    const result = await this.userRepository.allPaginated({...params, limit, page});
    return {
      ...result,
      data: result.data.map(UserMapper.toDTO)
    };
  }
}

export class FindUsersUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(filters: UserFilters): Promise<UserResponseDTO[]> {
    const cleanedFilters = Object.fromEntries(
      // eslint-disable-next-line
          Object.entries(filters).filter(([_, value]) => value !== undefined && value !== null && value !== '')
      );
    const users = await this.userRepository.findBy(cleanedFilters);
    if(!users.length) throw new AppError('não encontrado', 404);
    return users.map(UserMapper.toDTO);
  }
}

export class UpdateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string, data: UpdateUserDTO): Promise<UserResponseDTO> {
    // 1. Busca o usuário existente
    const user = await this.userRepository.findById(id);
    if (!user) throw new AppError('Usuário não encontrado', 404);

    // 2. Prepara os dados de atualização (tratando Value Objects)
    const updateData: Partial<UserProps> = { ...data } as Partial<UserProps>;

    if (data.email) {
      updateData.email = Email.create(data.email);
    }

    if (data.password) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      updateData.password = Password.create(hashedPassword);
    }

    // 3. Atualiza o objeto de domínio
    user.update(updateData);

    // 4. Persiste a entidade completa (o Repositório cuida da conversão via Mapper)
    const updatedUser = await this.userRepository.save(user);

    return UserMapper.toDTO(updatedUser);
  }
}

export class DeleteUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new AppError('Usuário não encontrado', 404);
    await this.userRepository.delete(id);
  }
}
