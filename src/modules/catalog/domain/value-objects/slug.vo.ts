import { AppError } from "@shared/errors/AppError";

export class Slug {
  private constructor(private readonly value: string) {}

  /**
   * Cria ou corrige uma string para o formato slug.
   * Aceita tanto nomes comuns quanto slugs já formatados incorretamente.
   */
  public static create(text: string): Slug {
    if (!text) throw new AppError("O texto para o slug não pode estar vazio.", 422);

    const slugified = text
      .normalize('NFD')                 // Decompõe caracteres acentuados (ex: á -> a + ´)
      .replace(/[\u0300-\u036f]/g, '')  // Remove os acentos
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')     // Remove caracteres que não são letras, números, espaços ou hifens
      .replace(/\s+/g, '-')             // Substitui espaços por hifens
      .replace(/-+/g, '-')              // Substitui múltiplos hifens por um único
      .replace(/^-+|-+$/g, '');         // Remove hifens no início ou no fim

    if (slugified.length < 3) {
      throw new AppError("O slug resultante é muito curto (mínimo 3 caracteres).", 422);
    }

    return new Slug(slugified);
  }

  get getValue(): string {
    return this.value;
  }
}
