export class Url {
  private readonly value: string;

  constructor(value: string) {
    if (!this.validate(value)) {
      throw new Error(`URL inválida: ${value}`);
    }
    this.value = value;
  }

  private validate(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  public getValue(): string {
    return this.value;
  }
}
