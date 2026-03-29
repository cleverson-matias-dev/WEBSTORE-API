  import { Product } from "@modules/catalog/domain/entities/product.entity";
  import { ProductOutputDto } from "./product-dtos"; 
  import { Produto as ProdutoEntity } from "@modules/catalog/infrastructure/persistence/entities/ProductEntity";

  export class ProductMapper {
    
    static toOutput(product: Product): ProductOutputDto {
      return {
        id: product.props.id!,
        name: product.props.name,
        slug: product.props.slug,
        description: product.props.description,
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
        description: raw.description,
        category_id: raw.category_id,
        created_at: raw.created_at,
      });
    }
  }
