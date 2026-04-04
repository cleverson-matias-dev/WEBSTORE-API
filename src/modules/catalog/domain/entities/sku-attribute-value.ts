import { randomUUID } from "crypto";

export interface SkuAttributeValueProps {
  sku_id: string;
  attribute_id: string;
  value: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class SkuAttributeValue {
  private readonly _id: string;
  private _skuId: string;
  private _attribute_id: string;
  private _value: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: SkuAttributeValueProps, id?: string) {
    this._id = id ?? randomUUID();
    this._skuId = props.sku_id;
    this._attribute_id = props.attribute_id;
    this._value = props.value;
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();

    this.validate();
  }


  public static create(props: SkuAttributeValueProps, id?: string): SkuAttributeValue {
    return new SkuAttributeValue(props, id);
  }

  get id(): string { return this._id; }
  get skuId(): string { return this._skuId; }
  get attribute_id(): string { return this._attribute_id; }
  get value(): string { return this._value; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }


  public changeValue(new_value: string): void {
    this.validateValue(new_value);
    this._value = new_value;
    this.touch();
  }

  private validate(): void {
    if (!this.isValidUUID(this._skuId)) throw new Error("SKU ID inválido.");
    if (!this.isValidUUID(this._attribute_id)) throw new Error("Atributo ID inválido.");
    this.validateValue(this._value);
  }

  private validateValue(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error("O valor do atributo não pode ser vazio.");
    }
    if (value.length > 100) {
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
