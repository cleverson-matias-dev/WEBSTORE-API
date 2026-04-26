import { Slug } from '../value-objects/slug.vo';
import { v4 as uuidv4 } from 'uuid';
import type { Image } from './image.entity';
import type { Category } from './category.entity';
import type { SkuDomain } from './sku.entity';

export type ProductType = 'simple' | 'variable' | 'digital' | 'service';
export type Visibility = 'catalog' | 'search' | 'hidden';

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
  images?: Image[];
  category?: Category;
  skus?: SkuDomain[];
  published_at?: Date;
  created_at?: Date;
  deleted_at?: Date;
}

export class Product {
  private _props: ProductProps;

  private constructor(props: ProductProps) {
    // 1. Resolve o Slug (Garante limpeza mesmo se for passado manualmente)
    const resolvedSlug = props.slug?.trim() 
      ? Slug.create(props.slug).getValue 
      : Slug.create(props.name).getValue;

    // 2. Garante consistência entre ProductType e has_variants
    // Se o tipo for 'variable', has_variants DEVE ser true.
    const hasVariants = props.product_type === 'variable' ? true : (props.has_variants || false);

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

  public update(props: Partial<Omit<ProductProps, 'id' | 'created_at'>>): void {
    if (props.name) this._props.name = props.name;
    
    // Atualiza o slug apenas se enviado explicitamente (Protege SEO)
    if (props.slug) {
      this._props.slug = Slug.create(props.slug).getValue;
    }

    if (props.product_type) {
      this._props.product_type = props.product_type;
      // Se mudou para 'variable', força has_variants a ser true
      if (props.product_type === 'variable') this._props.has_variants = true;
    }

    if (props.has_variants !== undefined) {
      // Se o tipo for 'variable', não permite setar has_variants como false
      this._props.has_variants = this._props.product_type === 'variable' ? true : props.has_variants;
    }

    // Demais atualizações
    if (props.description) {
      this._props.description = props.description;
      if (!this._props.short_description) {
        this._props.short_description = this.generateFallbackDescription(props.description);
      }
    }
    
    if (props.short_description) this._props.short_description = props.short_description;
    if (props.category_id) this._props.category_id = props.category_id;
    if (props.visibility) this._props.visibility = props.visibility;
    // ... outros campos
  }

  public publish(): void {
    this._props.published_at = new Date();
    this._props.visibility = 'catalog';
  }

  public delete(): void {
    this._props.deleted_at = new Date();
  }
}

