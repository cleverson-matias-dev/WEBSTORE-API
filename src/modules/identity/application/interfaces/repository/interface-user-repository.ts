import { User, UserProps, UserRole } from "@modules/identity/domain/entities/User";

export interface UserFilters {
  id?: string;
  email?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
}

export interface IUserRepository {
  /**
   * Persiste um novo usuário ou atualiza um existente
   */
  save(user: User): Promise<User>;

  /**
   * Retorna uma lista paginada de usuários do domínio
   */
  allPaginated(params: PaginationParams): Promise<PaginatedResult<User>>;

  /**
   * Busca usuários com base em filtros flexíveis
   */
  findBy(filters: UserFilters): Promise<User[]>;

  /**
   * Busca um único usuário por ID
   */
  findById(id: string): Promise<User | null>;

  /**
   * Remove um usuário permanentemente ou realiza soft delete
   */
  delete(id: string): Promise<void>;
}
