// dtos/user.dto.ts
export interface CreateUserDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'client' | 'admin';
}

export interface UpdateUserDTO extends Partial<Omit<CreateUserDTO, 'email'>> {
  isActive?: boolean;
}

export interface UserResponseDTO {
  id: string;
  email: string;
  fullName: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
}

export interface PaginatedResultDTO<T> {
  data: T[];
  total: number;
  page: number;
  lastPage: number;
}