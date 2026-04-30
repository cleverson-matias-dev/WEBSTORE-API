import { Meilisearch } from 'meilisearch';

export class MeilisearchService {
  private client: Meilisearch;

  constructor() {
    this.client = new Meilisearch({
      host: process.env.MEILI_HOST || 'http://localhost:7700',
      apiKey: process.env.MEILI_MASTER_KEY || 'masterKey',
    });
  }

  async index(indexName: string) {
    return this.client.index(indexName);
  }

  async setupIndex(indexName: string) {
    const index = this.client.index(indexName);
    
    await index.updateFilterableAttributes([
      'category_name',
      'category_id',
      'brand',
      'min_price',
      'has_variants',
      'facets', // Meilisearch permite filtrar por chaves dinâmicas dentro de objetos
      'visibility'
    ]);

    await index.updateSortableAttributes([
      'min_price',
      'created_at',
      'published_at'
    ]);

    // Opcional: Melhora a busca por código de SKU
    await index.updateSearchableAttributes([
      'name',
      'skus.sku_code',
      'brand',
      'description'
    ]);

    console.log(`⚙️ [Meilisearch] Índice ${indexName} configurado com sucesso.`);
  }
}
