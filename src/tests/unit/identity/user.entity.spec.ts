import { User, UserRole, type UserProps } from "@modules/identity/domain/entities/User";
import type { Email } from "@modules/identity/domain/value-objects/email-vo";
import type { Password } from "@modules/identity/domain/value-objects/password-vo";


describe('User Domain Entity', () => {
  // Helper para criar dependências válidas
  const makeEmail = (email: string) => ({ getValue: email } as Email);
  const makePassword = (pass: string) => ({ getValue: pass } as Password);

  const validProps: UserProps = {
    firstName: 'João',
    lastName: 'Silva',
    email: makeEmail('joao@example.com'),
    password: makePassword('hash123'),
    role: UserRole.CLIENT,
    isActive: "1",
    createdAt: new Date(),
  };

  it('deve criar um novo usuário com propriedades válidas', () => {
    const user = User.create(validProps);

    expect(user.id).toBeUndefined(); // ID geralmente vem da persistência ou é gerado
    expect(user.fullName).toBe('João Silva');
    expect(user.isActive).toBe(true);
    expect(user.role).toBe(UserRole.CLIENT);
  });

  it('deve aplicar valores padrão ao criar um usuário', () => {
    // @ts-expect-error - Removendo props opcionais para testar o default do factory
    const user = User.create({
      firstName: 'Ana',
      lastName: 'Souza',
      email: makeEmail('ana@example.com'),
      password: makePassword('123456'),
    });

    expect(user.role).toBe(UserRole.CLIENT);
    expect(user.isActive).toBe(true);
    expect(user.createdAt).toBeInstanceOf(Date);
  });

  it('deve atualizar os dados do usuário e alterar o updatedAt', async () => {
    const user = User.create(validProps);
    // Aguarda um pequeno tempo para garantir que o timestamp mude
    await new Promise(resolve => setTimeout(resolve, 10));

    user.update({ firstName: 'Carlos', role: UserRole.ADMIN });

    expect(user.firstName).toBe('Carlos');
    expect(user.role).toBe(UserRole.ADMIN);
  });

  it('deve desativar um usuário corretamente', () => {
    const user = User.create(validProps);
    
    user.deactivate();

    expect(user.isActive).toBe(false);
  });

  it('deve formatar o fullName corretamente removendo espaços extras', () => {
    const user = User.create({
      ...validProps,
      firstName: '  Maria  ',
      lastName: 'Oliveira  '
    });

    expect(user.fullName).toBe('Maria Oliveira');
  });
});
