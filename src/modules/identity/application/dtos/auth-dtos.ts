import { UserResponseDTO } from "./user-dtos";

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponseDTO {
  user: UserResponseDTO;
  token: string;
}

