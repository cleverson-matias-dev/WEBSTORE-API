import { Product, type ProductType, type Visibility } from "@modules/catalog/domain/entities/product.entity";
import { ProductOutputDTO } from "./product-dtos"; 
import { Produto as ProdutoEntity } from "@modules/catalog/infrastructure/persistence/entities/ProductEntity";
import { CategoryMapper } from "./category-mapper";
import { SkuMapper } from "./sku-mapper";
import { SkuDomain } from "@modules/catalog/domain/entities/sku.entity";

  export class ProductMapper {
    
    static toOutput(product: Product): ProductOutputDTO {
      return {
        id: product.props.id!,
        name: product.props.name,
        slug: product.slug,
        description: product.props.description,
        images: product.images.map(img => ({
          id: img.id || "",
          product_id: product.id,
          url: img.url,
          ordem: img.ordem,
          created_at: product.props.created_at! 
        })),
        category: product.props.category ? CategoryMapper.toDTO(product.props.category) : undefined,
        skus: product.props.skus?.length ? product.props.skus.map(sku => SkuMapper.toOutput(sku)) : [],
        has_variants: product.has_variants,
        product_type: product.product_type,
        short_description: product.short_description,
        visibility: product.props.visibility,
        brand: product.props.brand,
        min_price: product.minPrice,
        collection_id: product.props.collection_id,
        meta_description_title: product.props.meta_description_title,
        published_at: product.props.published_at,
        video_url: product.props.video_url,
        category_id: product.props.category_id,
        created_at: product.props.created_at!,

      };
    }
 
    static toPersistence(product: Product) {
      return {
        id: product.id,
        name: product.props.name,
        slug: product.slug,
        description: product.props.description,
        category_id: product.props.category_id,
        brand: product.props.brand,
        collection_id: product.props.collection_id,
        product_type: product.product_type,
        visibility: product.props.visibility,
        published_at: product.props.published_at,
        short_description: product.short_description,
        meta_description_title: product.props.meta_description_title,
        has_variants: product.has_variants,
        video_url: product.props.video_url,
        created_at: product.props.created_at,
        // Mapeamento dos SKUs para persistência
        skus: product.skus.map(sku => ({
          id: sku.id,
          produto_id: sku.product_id,
          codigo_sku: sku.sku_code,
          is_default: sku.is_default,
          preco: sku.price,
          currency: sku.currency,
          peso: sku.weight,
          dimensoes: sku.dimensions,
          attributes: sku.sku_attributes.map(attr => ({
            sku_id: sku.id,
            value: attr.value,
            attribute: attr.attribute_id ? { id: attr.attribute_id } : { name: attr.name }
          }))
        })),
        // Mapeamento das Imagens
        images: product.images.map(img => ({
          product_id: img.product_id,
          url: img.url,
          ordem: img.ordem
        }))
      };
    }


    static toDomain(raw: ProdutoEntity): Product {
        // 1. Criamos a instância base do Produto
        const product = Product.create({
          id: raw.id,
          name: raw.name,
          slug: raw.slug,
          description: raw.description,
          category_id: raw.category_id,
          brand: raw.brand,
          collection_id: raw.collection_id,
          product_type: raw.product_type as ProductType,
          visibility: raw.visibility as Visibility,
          has_variants: raw.has_variants,
          short_description: raw.short_description,
          video_url: raw.video_url,
          meta_description_title: raw.meta_description_title,
          published_at: raw.published_at,
          created_at: raw.created_at,
          deleted_at: raw.deleted_at,
          // Passamos a categoria se ela foi carregada via "relations" no TypeORM
          category: raw.category ? CategoryMapper.toDomain(raw.category) : undefined,
        });

        if (raw.images && raw.images.length > 0) {
            raw.images.forEach(image => {
              product.addImage(image.url, image.ordem, image.id);
            });
        }

        if (raw.skus && raw.skus.length > 0) {
          raw.skus.forEach(skuRaw => {

            const sku = SkuDomain.create({
              product_id: product.id,
              sku_code: skuRaw.codigo_sku,
              is_default: skuRaw.is_default,
              price: skuRaw.preco,
              currency: skuRaw.currency,
              weight: skuRaw.peso,
              dimensions: skuRaw.dimensoes,
              sku_attributes: skuRaw.attributes.map(attribute => ({
                attribute_id: attribute.attribute_id,
                name: attribute.attribute.name,
                value: attribute.value
              }))
            }, skuRaw.id);
            
            product.addSku(sku);
          });
        }

        return product;
    }

}
