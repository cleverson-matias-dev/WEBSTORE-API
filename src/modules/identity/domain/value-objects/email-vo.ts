import { AppError } from "@shared/errors/AppError";

export class Email {
  private constructor(private readonly value: string) {}

  public static create(email: string): Email {
    if (!email.includes('@') || email.length < 5) {
      throw new AppError('Email inválido', 400);
    }
    return new Email(email.toLowerCase());
  }

  get getValue(): string { return this.value; }
}


