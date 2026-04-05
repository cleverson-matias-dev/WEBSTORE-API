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
  private constructor(private props: UserProps) {}

  public static create(props: UserProps): User {
    const user = new User({
      ...props,
      isActive: props.isActive ?? true,
      role: props.role ?? UserRole.CLIENT,
    });
    
    return user;
  }

  public update(props: Partial<Omit<UserProps, 'id' | 'createdAt'>>) {
    if (props.email) (this.props as any).email = props.email;
    if (props.password) (this.props as any).password = props.password;
    if (props.firstName) this.props.firstName = props.firstName;
    if (props.lastName) this.props.lastName = props.lastName;
    if (props.role) this.props.role = props.role;
    if (props.isActive !== undefined) this.props.isActive = props.isActive;
    this.props.updatedAt = new Date();
  }

  get id() { return this.props.id; }
  get email() { return this.props.email.getValue; }
  get fullName() { return `${this.props.firstName} ${this.props.lastName}`; }
  
  public deactivate() {
    this.props.isActive = false;
  }
}
