import { User, UserRole } from '@modules/identity/domain/entities/User'; 
import { Email } from '@modules/identity/domain/value-objects/email-vo'; 
import { Password } from '@modules/identity/domain/value-objects/password-vo'; 
describe('User Domain Entity', () => {
  const makeValidUserProps = () => ({
    email: Email.create('test@example.com'),
    password: Password.create('password123'),
    firstName: 'John',
    lastName: 'Doe',
    role: UserRole.CLIENT,
    isActive: true,
  });

  describe('Value Objects', () => {
    it('should throw error for invalid email', () => {
      expect(() => Email.create('invalid-email')).toThrow('Email inválido');
    });

    it('should throw error for short password', () => {
      expect(() => Password.create('123')).toThrow('A senha deve ter no mínimo 8 caracteres');
    });

    it('should create valid value objects', () => {
      const email = Email.create('valid@mail.com');
      const password = Password.create('securepassword');
      expect(email.getValue).toBe('valid@mail.com');
      expect(password.getValue).toBe('securepassword');
    });
  });

  describe('User Entity', () => {
    it('should create a valid user instance', () => {
      const props = makeValidUserProps();
      const user = User.create(props);

      expect(user).toBeInstanceOf(User);
      expect(user.email).toBe('test@example.com');
      expect(user.fullName).toBe('John Doe');
      expect(user.id).toBeUndefined(); // ID é gerado pelo banco ou passado opcionalmente
    });

    it('should default isActive to true if not provided', () => {
      const props = { ...makeValidUserProps(), isActive: undefined as any };
      const user = User.create(props);
      
      expect((user as any).props.isActive).toBe(true);
    });

    it('should default role to CLIENT if not provided', () => {
      const props = { ...makeValidUserProps(), role: undefined as any };
      const user = User.create(props);
      
      expect((user as any).props.role).toBe(UserRole.CLIENT);
    });

    it('should deactivate a user correctly', () => {
      const user = User.create(makeValidUserProps());
      user.deactivate();

      expect((user as any).props.isActive).toBe(false);
    });
  });
});
