import { User, UserRole } from "@modules/identity/domain/entities/User";

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
   * Atualiza dados parciais de um usuário
   * @param id ID do usuário
   * @param data Objeto com campos da entidade de domínio a serem alterados
   */
  update(id: string, data: Partial<User>): Promise<User>;

  /**
   * Remove um usuário permanentemente ou realiza soft delete
   */
  delete(id: string): Promise<void>;
}
