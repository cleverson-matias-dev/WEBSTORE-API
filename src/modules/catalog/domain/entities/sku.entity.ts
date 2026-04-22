import { Price, SkuCode, Weight } from "../value-objects/sku.vo";

export interface SkuProps {
  productId: string;
  skuCode: SkuCode;
  price: Price;
  weight: Weight;
  dimensions: string;
}

export class SkuDomain {
  private readonly _id: string;
  private props: SkuProps;
  private readonly _created_at: Date;
  private _updated_at: Date;

  constructor(props: SkuProps, id?: string) {
    this._id = id ?? crypto.randomUUID();
    this.props = props;
    this._created_at = new Date();
    this._updated_at = new Date();
  }

  public changePrice(newPrice: Price): void {
    this.props.price = newPrice;
    this.touch();
  }

  public updateLogistics(weight: Weight, dimensions: string): void {
    this.props.weight = weight;
    this.props.dimensions = dimensions;
    this.touch();
  }

  private touch(): void {
    this._updated_at = new Date();
  }

  toJSON() {
    return {
      id: this._id,
      skuCode: this.props.skuCode.val,
      productId: this.props.productId,
      price: this.props.price.val,
      currency: this.props.price.curr,
      weight: this.props.weight.val,
      dimensions: this.props.dimensions,
      created_at: this._created_at,
      updated_at: this._updated_at
    }
  }


  get id() { return this._id; }
  get productId() { return this.props.productId; }
  get skuCode() { return this.props.skuCode.val; }
  get price() { return this.props.price.val; }
  get weight() { return this.props.weight.val; }
  get dimensions() { return this.props.dimensions; }
  get created_at() { return this._created_at; }
  get updated_at() { return this._updated_at; }
  get currency() { return this.props.price.curr;}
}
