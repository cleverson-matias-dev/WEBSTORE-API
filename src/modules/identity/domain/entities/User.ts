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
  isActive: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class User {
  private constructor(private readonly props: UserProps) {}

  public static create(props: UserProps): User {
    return new User({
      ...props,
      isActive: props.isActive ?? "1",
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
    this.props.isActive = "0";
    this.props.updatedAt = new Date();
  }

  get password(): string { return this.props.password.getValue }
  get firstName(): string { return this.props.firstName }
  get lastName(): string { return this.props.lastName }
  get createdAt(): Date { return this.props.createdAt }
  get updatedAt(): Date | undefined { return this.props.updatedAt }

  // Getters explícitos
  get id(): string | undefined { return this.props.id; }
  
  // Segurança: acesso ao valor real do VO depende da implementação do Email VO
  get email(): string { return this.props.email.getValue; }
  
  get fullName(): string { 
    return `${this.props.firstName.trim()} ${this.props.lastName.trim()}`.trim(); 
  }

  get role(): UserRole { return this.props.role; }
  get isActive(): string { return this.props.isActive; }
}
