import { randomUUID } from "crypto";

export interface SkuAttributeValueProps {
  skuId: string;
  atributoId: string;
  valor: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class SkuAttributeValue {
  private readonly _id: string;
  private _skuId: string;
  private _atributoId: string;
  private _valor: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: SkuAttributeValueProps, id?: string) {
    this._id = id ?? randomUUID();
    this._skuId = props.skuId;
    this._atributoId = props.atributoId;
    this._valor = props.valor;
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();

    this.validate();
  }


  public static create(props: SkuAttributeValueProps, id?: string): SkuAttributeValue {
    return new SkuAttributeValue(props, id);
  }

  get id(): string { return this._id; }
  get skuId(): string { return this._skuId; }
  get atributoId(): string { return this._atributoId; }
  get valor(): string { return this._valor; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }


  public changeValue(novoValor: string): void {
    this.validateValue(novoValor);
    this._valor = novoValor;
    this.touch();
  }

  private validate(): void {
    if (!this.isValidUUID(this._skuId)) throw new Error("SKU ID inválido.");
    if (!this.isValidUUID(this._atributoId)) throw new Error("Atributo ID inválido.");
    this.validateValue(this._valor);
  }

  private validateValue(valor: string): void {
    if (!valor || valor.trim().length === 0) {
      throw new Error("O valor do atributo não pode ser vazio.");
    }
    if (valor.length > 100) {
      throw new Error("O valor do atributo não pode exceder 100 caracteres.");
    }
  }

  private isValidUUID(uuid: string): boolean {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return regex.test(uuid);
  }

  private touch(): void {
    this._updatedAt = new Date();
  }
}
