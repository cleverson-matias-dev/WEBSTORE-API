export class Password {
  private constructor(private readonly value: string) {}

  public static create(password: string): Password {
    
    if (password.length < 8) {
      throw new Error('A senha deve ter no mínimo 8 caracteres');
    }
    return new Password(password);
  }

  get getValue(): string { return this.value; }
}