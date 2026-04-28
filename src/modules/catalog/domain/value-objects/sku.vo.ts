// SKU: Identificador único comercial
export class SkuCode {
  constructor(private readonly value: string) {
    if (!value || value.trim().length < 3) {
      throw new Error("SKU Code deve ter no mínimo 3 caracteres.");
    }
    this.value = value.toUpperCase();
  }

  public static create(value: string): SkuCode {
    return new SkuCode(value);
  }

  get val() { return this.value; }
}

export class Price {
  constructor(private readonly amount: number, private readonly currency: string = "BRL") {
    if (amount < 0) throw new Error("O preço não pode ser negativo.");
  }

  public static create(amount: number, currency?: string): Price {
    return new Price(amount, currency);
  }

  get val() { return this.amount; }
  get curr() { return this.currency; }
}

export class Weight {
  // O nome do parâmetro 'grams' já ajuda internamente
  constructor(private readonly grams: number) {
    if (grams < 0) throw new Error("O peso não pode ser negativo.");
  }

  public static create(value: number): Weight {
    // Se você quiser ser ultra defensivo, pode validar se o valor 
    // parece um erro (ex: algo pesando 0.001 gramas)
    return new Weight(value);
  }
  get val() { return this.grams; }
}

