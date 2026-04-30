import { MeilisearchService } from "@shared/infra/meilisearch/MeilisearchService";
import { ProductCreatedConsumer } from "../consumers/ProductCreatedConsumer";


export class ProductCreatedConsumerFactory {
  static make(): ProductCreatedConsumer {
    const meiliService = new MeilisearchService();
    return new ProductCreatedConsumer(meiliService);
  }
}
