import { Like } from "typeorm";
import { Product } from "@modules/catalog/domain/entities/product.entity";
import { Produto as ProdutoEntity } from "@modules/catalog/infrastructure/persistence/entities/ProductEntity";
import { IProductRepository, PagedProductOutput, ProductFilter } from "@modules/catalog/application/interfaces/repository/IProductRepository";
import { ProductMapper } from "@modules/catalog/application/dtos/product-mappers";
import { AppDataSource } from "@shared/infra/db/data-source";
import { BaseCacheRepository } from "./BaseCacheRepository";
import redisClient from "@shared/infra/cache/redis";
import { transactionStorage } from "./TransactionContext";

export class TypeormProductRepository 
extends BaseCacheRepository
implements IProductRepository {
  
  protected CACHE_TAG: string = "product";

  private get repository() {

    const manager = transactionStorage.getStore();

    if (manager) {
      return manager.getRepository(ProdutoEntity);
    }
    
    return AppDataSource.getRepository(ProdutoEntity);
  }

  async save(product: Product): Promise<Product> {
    const raw = ProductMapper.toPersistence(product);
    const saved = await this.repository.save(raw);
    
    // Busca o produto novamente com os joins necessários
    const completeProduct = await this.repository.findOne({
      where: { id: saved.id },
      relations: {
        images: true,
        skus: {
          attributes: {
            attribute: true
          }
        },
        category: { parent: true }
      }
  });

  this.invalidateCache();
  
  if (!completeProduct) throw new Error('Erro ao recuperar produto salvo');
  
  return ProductMapper.toDomain(completeProduct);
  }


  async findBy(prop: object): Promise<Product | null> {
    const raw = await this.repository.findOne({ 
      where: {...prop}, 
      relations: {
        images: true,
        category: { parent: true }
      }});
    return raw ? ProductMapper.toDomain(raw) : null;
  }

  async allPaginated(
    page: number = 1, 
    limit: number = 10, 
    filter?: ProductFilter
  ): Promise<PagedProductOutput> {
    const skip = (page - 1) * limit;

    const filterParts = [
        `p:${page}`,
        `l:${limit}`,
        `n:${filter?.name || 'all'}`,
        `s:${filter?.slug || 'all'}`,
        `d:${filter?.description ? 'custom' : 'all'}`
    ];
    const suffix = filterParts.join(':');
    const cacheKey = await this.getCacheKey(suffix);
    const cachedData = await redisClient.get(cacheKey);

    if(cachedData) {
      const [items, total] = JSON.parse(cachedData);
      return {
        items: items.map((item: ProdutoEntity) => ProductMapper.toOutput(ProductMapper.toDomain(item))),
        total,
        page: page,
        limit
      };
    }
    
    // eslint-disable-next-line
    const where: any = {};
    if (filter?.name) where.name = Like(`%${filter.name}%`);
    if (filter?.slug) where.slug = filter.slug;
    if (filter?.description) where.description = Like(`%${filter.description}%`);

    const [items, total] = await this.repository.findAndCount({
      where,
      take: limit,
      skip,
      order: { created_at: "DESC" },
      relations: {
        images: true,
        category: {
          parent: true
        },
        skus: {
          attributes: true
        }
      }
    });

    await redisClient.set(cacheKey, JSON.stringify([items, total]), {EX: this.TTL})

    return {
      items: items.map(item => ProductMapper.toOutput(ProductMapper.toDomain(item))),
      total,
      page: page,
      limit
    };
  }

  async update(product: Product): Promise<boolean> {
    const raw = ProductMapper.toPersistence(product);
    const result = await this.repository.update(product.props.id!, raw);
    this.invalidateCache();
    return result.affected! > 0;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    this.invalidateCache();
    return result.affected! > 0;
  }
}
