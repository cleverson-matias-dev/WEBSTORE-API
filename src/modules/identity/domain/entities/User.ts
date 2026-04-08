import { Email } from "../value-objects/email-vo";
import { Password } from "../value-objects/password-vo";

export enum UserRole {
  CLIENT = 'client',
  ADMIN = 'admin',
}

export interface UserProps {
  id?: string;
  email: Email;
  password: Password;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  // Uso de 'readonly' para garantir que a referência de props não mude
  private constructor(private readonly props: UserProps) {}

  public static create(props: UserProps): User {
    return new User({
      ...props,
      isActive: props.isActive ?? true,
      role: props.role ?? UserRole.CLIENT,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
  }

  // Refatorado para evitar 'as any' e garantir type safety
  public update(props: Partial<Omit<UserProps, 'id' | 'createdAt' | 'updatedAt'>>): void {
    Object.assign(this.props, {
      ...props,
      updatedAt: new Date()
    });
  }

  public deactivate(): void {
    this.props.isActive = false;
    this.props.updatedAt = new Date();
  }

  // Getters explícitos
  get id(): string | undefined { return this.props.id; }
  
  // Segurança: acesso ao valor real do VO depende da implementação do Email VO
  get email(): string { return this.props.email.getValue; }
  
  get fullName(): string { 
    return `${this.props.firstName} ${this.props.lastName}`.trim(); 
  }

  get role(): UserRole { return this.props.role; }
  get isActive(): boolean { return this.props.isActive; }
}
