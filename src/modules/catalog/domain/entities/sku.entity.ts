import { Price, SkuCode, Weight } from "../value-objects/sku.vo";

export interface SkuAttribute {
  attribute_id?: string;
  name: string;
  value: string;
}

export interface SkuProps {
  product_id: string;
  sku_code: SkuCode;
  initial_quantity?: number;
  warehouse_id?: string;
  is_default: boolean;
  price: Price;
  weight: Weight;
  dimensions: string;
  sku_attributes: SkuAttribute[];
}

export class SkuDomain {
  private readonly _id: string;
  private props: SkuProps;
  private readonly _created_at: Date;
  private _updated_at: Date;

  constructor(props: SkuProps, id?: string) {
    this._id = id ?? crypto.randomUUID();
    this.props = props;
    this.props.initial_quantity = props.initial_quantity;
    this.props.warehouse_id = props.warehouse_id;
    this._created_at = new Date();
    this._updated_at = new Date();
  }

  public static create(props: {
    product_id: string;
    sku_code: string; 
    initial_quantity?: number;
    warehouse_id?: string;
    is_default: boolean;
    price: number;
    currency: string;
    weight?: number;
    dimensions?: string;
    sku_attributes?: SkuAttribute[];
  }, id?: string): SkuDomain {
    
    const skuProps: SkuProps = {
      product_id: props.product_id,
      sku_code: SkuCode.create(props.sku_code),
      is_default: props.is_default,
      price: Price.create(props.price, props.currency),
      weight: Weight.create(props.weight ?? 0),
      dimensions: props.dimensions ?? "",
      sku_attributes: props.sku_attributes ?? [],
      initial_quantity: props.initial_quantity,
      warehouse_id: props.warehouse_id
    };

    return new SkuDomain(skuProps, id);
  }

  // --- Getters e Métodos ---

  public changePrice(newPrice: Price): void {
    this.props.price = newPrice;
    this.touch();
  }

  public setDefault(flag: boolean): void {
    this.props.is_default = flag;
    this.touch();
  }

  private touch(): void {
    this._updated_at = new Date();
  }

  toJSON() {
    return {
      id: this._id,
      product_id: this.props.product_id,
      sku_code: this.props.sku_code.val,
      is_default: this.props.is_default,
      inittial_quantity: this.initial_quantity,
      warehouse_id: this.warehouse_id,
      price: this.props.price.val,
      currency: this.props.price.curr,
      weight: this.props.weight.val,
      dimensions: this.props.dimensions,
      sku_attributes: this.props.sku_attributes,
      created_at: this._created_at,
      updated_at: this._updated_at
    };
  }

  get id() { return this._id; }
  get product_id() { return this.props.product_id; }
  get sku_code() { return this.props.sku_code.val; }
  get is_default() { return this.props.is_default; }
  get price() { return this.props.price.val; }
  get weight() { return this.props.weight.val; }
  get dimensions() { return this.props.dimensions; }
  get sku_attributes() { return this.props.sku_attributes; }
  get created_at() { return this._created_at; }
  get updated_at() { return this._updated_at; }
  get currency() { return this.props.price.curr; }
  get initial_quantity() { return this.props.initial_quantity; }
  get warehouse_id() { return this.props.warehouse_id; }
}
