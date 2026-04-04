import { Product } from "@modules/catalog/domain/entities/product.entity";
import { ProductOutputDTO } from "./product-dtos"; 
import { Produto as ProdutoEntity } from "@modules/catalog/infrastructure/persistence/entities/ProductEntity";
import { ImageMapper } from "./image-mappers";
import { CategoryMapper } from "./category-mapper";

  export class ProductMapper {
    
    static toOutput(product: Product): ProductOutputDTO {
      return {
        id: product.props.id!,
        name: product.props.name,
        slug: product.props.slug,
        description: product.props.description,
        images: product.props.images?.map(image => ImageMapper.toDTO(ImageMapper.toDomainFromPersistence(image))) || [],
        category: product.props.category ? CategoryMapper.toDTO(CategoryMapper.toDomain(product.props.category)) : undefined,
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
        category_id: product.props.category_id
      };
    }

    static toDomain(raw: ProdutoEntity): Product {
      return Product.create({
        id: raw.id,
        name: raw.name,
        slug: raw.slug,
        images: raw.images,
        category: raw.category,
        description: raw.description,
        category_id: raw.category_id,
        created_at: raw.created_at,
      });
    }
  }
