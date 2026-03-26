import { CreateUserDTO, UpdateUserDTO } from "@modules/identity/infrastructure/http/validation-schemas/user-schemas";
import { UserResponseDTO } from "../dtos/user-dtos";
import { IUserRepository, PaginatedResult, PaginationParams, UserFilters } from "../interfaces/repository/interface-user-repository";
import { Email } from "@modules/identity/domain/value-objects/email-vo";
import { Password } from "@modules/identity/domain/value-objects/password-vo";
import { User, UserProps } from "@modules/identity/domain/entities/User";
import { UserMapper } from "../dtos/user-mappers";
import * as bcrypt from 'bcrypt';
import { AppError } from "@shared/errors/AppError";


export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: CreateUserDTO): Promise<UserResponseDTO> {

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

    const cleanedFilters = Object.fromEntries(
          Object.entries(data).filter(([_, value]) => value !== undefined && value !== null && value !== '')
    );
    
    const user = await this.userRepository.findById(id);
    if (!user) throw new AppError('Usuário não encontrado', 404);

    if (data.password) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      cleanedFilters.password = Password.create(hashedPassword).getValue;
    }

    const updatedUser = await this.userRepository.update(id, cleanedFilters as Partial<User>);
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
