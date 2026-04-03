import { Slug } from '../value-objects/slug.vo';
import { v4 as uuidv4 } from 'uuid';

export interface ProductProps {
  id?: string;
  name: string;
  slug: string;
  description: string;
  category_id: string;
  images?: any[],
  category?: any,
  created_at?: Date;
  deleted_at?: Date;
}

export class Product {
  private _props: ProductProps;

  private constructor(props: ProductProps) {
    this._props = {
      ...props,
      id: props.id || uuidv4(),
      slug: props.slug && props.slug.trim() !== "" 
      ? props.slug 
      : Slug.create(props.name).getValue
    };
  }

  get id() {
    return this.props.id!;
  }

  public static create(props: ProductProps): Product {
    return new Product(props);
  }

  get props(): Readonly<ProductProps> {
    return this._props;
  }

  public update(props: Partial<Omit<ProductProps, 'id' | 'created_at'>>): void {
    if (props.name) {
      this._props.name = props.name;
      // Atualiza o slug automaticamente se o nome mudar
      this._props.slug = Slug.create(props.name).getValue;
    }
    
    if (props.description) this._props.description = props.description;
    if (props.category_id) this._props.category_id = props.category_id;
  }

}
