import type { Message } from "amqplib";
import type { ProductCreatedDTO } from "./ProductCreatedDTO";
import type { MeilisearchService } from "@shared/infra/meilisearch/MeilisearchService";

export class ProductCreatedConsumer {
  constructor(private readonly meiliService: MeilisearchService) {}

  async handle(msg: Message) {
    const product: ProductCreatedDTO = JSON.parse(msg.content.toString());

    const document = {
      // Informações Básicas
      id: product.id,
      name: product.name,
      slug: product.slug,
      brand: product.brand || "Sem Marca",
      description: product.description,
      short_description: product.short_description,
      product_type: product.product_type,
      visibility: product.visibility,
      video_url: product.video_url,
      
      // Categorização (Flat para facilitar filtros)
      category_id: product.category_id,
      category_name: product.category?.name,
      category_slug: product.category?.slug,
      collection_id: product.collection_id,

      // Preços e Variantes
      min_price: product.min_price || 0,
      has_variants: product.has_variants,

      // SKUs (Indexamos o array para permitir busca por código interno)
      skus: (product.skus || []).map(sku => ({
        id: sku.id,
        sku_code: sku.sku_code,
        price: sku.price,
        quantity: sku.quantity ?? 0,
        is_default: sku.is_default,
        // Concatenamos os atributos no SKU para busca textual se necessário
        attributes: sku.attributes?.map(a => `${a.name}: ${a.value}`) || []
      })),

      // Facetas Dinâmicas (O que aparece no filtro lateral: Cor, Tamanho, etc)
      facets: (product.skus || []).reduce((acc: Record<string, string[]>, sku) => {
        sku.attributes?.forEach((attr) => {
          if (!acc[attr.name]) acc[attr.name] = [];
          if (!acc[attr.name].includes(attr.value)) {
            acc[attr.name].push(attr.value);
          }
        });
        return acc;
      }, {}),

      // Imagens (Ordenadas para garantir que a capa [ordem 0] venha primeiro)
      images: (product.images || [])
        .map(img => ({
          url: img.url,
          order: img.ordem
        }))
        .sort((a, b) => a.order - b.order),

      // Thumbnail (Capa do produto)
      thumbnail_url: product.images?.find(img => img.ordem === 0)?.url 
        || product.images?.[0]?.url 
        || null,

      // Datas (Convertidas para Timestamp para permitir SORT no Meilisearch)
      published_at: product.published_at ? new Date(product.published_at).getTime() : null,
      created_at: new Date(product.created_at).getTime(),
    };

    try {
      // await this.meiliService.index('products').addDocuments([document]);
      const productIndex = await this.meiliService.index('products');
      await productIndex.addDocuments([document]);

      console.log(`✅ Produto ${document.id} preparado para Meilisearch.`);
    } catch (error) {
      console.error("❌ Erro ao indexar:", error);
    }
  }
}
