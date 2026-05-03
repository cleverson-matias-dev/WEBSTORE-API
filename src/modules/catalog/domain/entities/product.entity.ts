import { Slug } from '../value-objects/slug.vo';
import { v4 as uuidv4 } from 'uuid';
import type { Category } from './category.entity';
import type { SkuDomain } from './sku.entity';
import { Entity } from './base-entity';

export type ProductType = 'simple' | 'variable' | 'digital' | 'service';
export type Visibility = 'catalog' | 'search' | 'hidden';
export type ProductImage = { id?: string; url: string; ordem: number; product_id: string }
type UpdateProductInput = Partial<Pick<ProductProps, 
  'name' | 'description' | 'short_description' | 'brand' | 'visibility' | 'category_id'
>>;
export interface ProductProps {
  id?: string;
  name: string;
  slug?: string;
  description: string;
  short_description?: string;
  brand?: string;
  collection_id?: string;
  product_type: ProductType;
  visibility: Visibility;
  has_variants: boolean;
  video_url?: string;
  meta_description_title?: string;
  category_id: string;
  images?: ProductImage[];
  category?: Category;
  skus?: SkuDomain[];
  published_at?: Date;
  created_at?: Date;
  deleted_at?: Date;
}

type ProductCreatedEvent = {
  type: "product.created";
  data: { product_id: string };
};

type ProductUpdatedEvent = {
  type: "product.updated";
  data: { product_id: string };
};

type ProductDeletedEvent = {
  type: "product.deleted";
  data: { product_id: string };
};

type TEvents = ProductCreatedEvent | ProductUpdatedEvent | ProductDeletedEvent;


export class Product extends Entity<TEvents>{
  private _props: ProductProps;

  private constructor(props: ProductProps) {
    super();
    // 1. Resolve o Slug (Garante limpeza mesmo se for passado manualmente)
    const resolvedSlug = props.slug?.trim() 
      ? Slug.create(props.slug).getValue 
      : Slug.create(props.name).getValue;

    const hasVariants = props.product_type === 'variable' ? true : (props.has_variants || false);

    if (props.product_type === 'variable' && props.has_variants === false) {
      throw new Error("Produtos variáveis devem obrigatoriamente possuir variantes.");
    }

    // 3. Fallback inteligente para short_description
    const shortDesc = props.short_description?.trim() 
      ? props.short_description 
      : this.generateFallbackDescription(props.description);

    this._props = {
      ...props,
      id: props.id || uuidv4(),
      slug: resolvedSlug,
      product_type: props.product_type || 'simple',
      visibility: props.visibility || 'catalog',
      has_variants: hasVariants,
      short_description: shortDesc,
      created_at: props.created_at || new Date()
    };

    if(!props.id) {
      this.addDomainEvent({ type: "product.created",  data: {product_id: this.id}})
    }
  }

  public addImage(url: string, order: number, id?: string) {
    if (!this._props.images) this._props.images = [];

    const alreadyExists = this._props.images.some(img => img.url === url);
    if (alreadyExists) return;

    this._props.images.push({ id, ordem: order, product_id: this.id, url })

    this.addDomainEvent({ type: "product.updated", data: { product_id: this.id } });
  }

  get images() {
    return this._props.images || [];
  }

  public static create(props: ProductProps): Product {
    return new Product(props);
  }

  // Helper privado para não poluir o constructor
  private generateFallbackDescription(desc: string): string {
    if (!desc) return '';
    return desc.length > 160 ? desc.substring(0, 157) + "..." : desc;
  }

  // Getters
  get id() { return this._props.id!; }
  get slug() { return this._props.slug!; }
  get product_type() { return this._props.product_type; }
  get has_variants() { return this._props.has_variants; }
  get short_description() { return this._props.short_description!;}
  
  get props(): Readonly<ProductProps> {
    return this._props;
  }

  public update(input: UpdateProductInput): void {
    Object.assign(this._props, input);
    
    if (input.name && !input.short_description) {
      this._props.short_description = this.generateFallbackDescription(this._props.description);
    }

    this.addDomainEvent({ type: "product.updated", data: { product_id: this.id } });
  }

  get skus() {
    return this._props.skus || []
  }

  public addSku(sku: SkuDomain) {
    if (!this._props.skus) this._props.skus = [];

    if (sku.is_default) {
      this._props.skus.forEach(s => s.setDefault(false));
    }

    const index = this._props.skus.findIndex(s => s.id === sku.id);

    if (index >= 0) {
      this._props.skus[Number(index)] = sku;
    } else {
      if (this._props.skus.length === 0) {
        sku.setDefault(true);
      }
      this._props.skus.push(sku);
    }

    this.addDomainEvent({ 
      type: "product.updated", 
      data: { product_id: this.id } 
    });
  }

  public removeSku(skuId: string): void {
    if (!this._props.skus) return;
    
    this._props.skus = this._props.skus.filter(s => s.id !== skuId);
    
    this.addDomainEvent({ 
      type: "product.updated", 
      data: { product_id: this.id } 
    });
  }

  get minPrice(): number {
    if (this.skus.length === 0) return 0;
    return Math.min(...this.skus.map(s => s.price));
  }

  public publish(): void {
    this._props.published_at = new Date();
    this._props.visibility = 'catalog';
    this.addDomainEvent({ type: "product.updated",  data: {product_id: this.id}})
  }

  public delete(): void {
    this._props.deleted_at = new Date();
    this.addDomainEvent({ type: "product.deleted",  data: {product_id: this.id}})
  }
}

