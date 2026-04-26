import { Product, type ProductType, type Visibility } from "@modules/catalog/domain/entities/product.entity";
import { ProductOutputDTO } from "./product-dtos"; 
import { Produto as ProdutoEntity } from "@modules/catalog/infrastructure/persistence/entities/ProductEntity";
import { ImageMapper } from "./image-mappers";
import { CategoryMapper } from "./category-mapper";
import { SkuMapper } from "./sku-mapper";

  export class ProductMapper {
    
    static toOutput(product: Product): ProductOutputDTO {
      return {
        id: product.props.id!,
        name: product.props.name,
        slug: product.slug,
        description: product.props.description,
        images: product.props.images?.map(image => ImageMapper.toDTO(image))|| [],
        category: product.props.category ? CategoryMapper.toDTO(product.props.category) : undefined,
        skus: product.props.skus?.length ? product.props.skus.map(sku => SkuMapper.toOutput(sku)) : [],
        has_variants: product.has_variants,
        product_type: product.product_type,
        short_description: product.short_description,
        visibility: product.props.visibility,
        brand: product.props.brand,
        collection_id: product.props.collection_id,
        meta_description_title: product.props.meta_description_title,
        published_at: product.props.published_at,
        video_url: product.props.video_url,
        category_id: product.props.category_id,
        created_at: product.props.created_at!,

      };
    }
 
    static toPersistence(product: Product): Partial<ProdutoEntity> {
      return {
        id: product.props.id,
        name: product.props.name,
        slug: product.props.slug,
        description: product.props.description,
        category_id: product.props.category_id,
        brand: product.props.brand,
        collection_id: product.props.collection_id,
        has_variants: product.has_variants,
        meta_description_title: product.props.meta_description_title,
        product_type: product.product_type,
        published_at: product.props.published_at,
        short_description: product.props.short_description,
        video_url: product.props.video_url,
        visibility: product.props.visibility
      };
    }

    static toDomain(raw: ProdutoEntity): Product {
      return Product.create({
        id: raw.id,
        name: raw.name,
        slug: raw.slug,
        images: raw.images ? raw.images.map(image => ImageMapper.toDomain(image)) : undefined,
        category: raw.category ? CategoryMapper.toDomain(raw.category) : undefined,
        skus: raw.skus ? raw.skus.map(sku => SkuMapper.toDomain(sku)) : undefined,
        description: raw.description,
        category_id: raw.category_id,
        created_at: raw.created_at,
        has_variants: raw.has_variants,
        product_type: raw.product_type as ProductType,
        visibility: raw.visibility as Visibility,
        brand: raw.brand,
        collection_id: raw.collection_id,
        deleted_at: raw.deleted_at,
        meta_description_title: raw.meta_description_title,
        published_at: raw.published_at,
        short_description: raw.short_description,
        video_url: raw.video_url
      });
    }
  }
