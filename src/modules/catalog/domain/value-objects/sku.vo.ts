// SKU: Identificador único comercial (ex: IPHONE-15-PRETO-128GB)
export class SkuCode {
  constructor(private readonly value: string) {
    if (!value || value.trim().length < 3) {
      throw new Error("SKU Code deve ter no mínimo 3 caracteres.");
    }
    this.value = value.toUpperCase();
  }
  get val() { return this.value; }
}

// Preço: Garante que o valor e a moeda sejam consistentes
export class Price {
  constructor(private readonly amount: number, private readonly currency: string = "BRL") {
    if (amount < 0) throw new Error("O preço não pode ser negativo.");
  }
  get val() { return this.amount; }
  get curr() { return this.currency; }
}

// Peso: Unidade padrão em gramas para evitar confusão decimal
export class Weight {
  constructor(private readonly grams: number) {
    if (grams <= 0) throw new Error("O peso deve ser maior que zero.");
  }
  get val() { return this.grams; }
}
