import { Repository, Like } from "typeorm";
import { Product } from "@modules/catalog/domain/entities/product.entity";
import { Produto as ProdutoEntity } from "@modules/catalog/infrastructure/persistence/entities/ProductEntity";
import { IProductRepository, PagedProductOutput, ProductFilter } from "@modules/catalog/application/interfaces/repository/IProductRepository";
import { ProductMapper } from "@modules/catalog/application/dtos/product-mappers";
import { AppDataSource } from "@shared/infra/db/data-source";
import { BaseCacheRepository } from "./BaseCacheRepository";
import redisClient from "@shared/infra/cache/redis";

export class TypeormProductRepository 
extends BaseCacheRepository
implements IProductRepository {
  
  private readonly ormRepository: Repository<ProdutoEntity> = AppDataSource.getRepository(ProdutoEntity);
  protected CACHE_TAG: string = "product";

  async save(product: Product): Promise<Product> {
    const raw = ProductMapper.toPersistence(product);
    const saved = await this.ormRepository.save(raw);
    this.invalidateCache();
    return ProductMapper.toDomain(saved);
  }

  async findBy(prop: object): Promise<Product | null> {
    const raw = await this.ormRepository.findOne({ 
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

    const [items, total] = await this.ormRepository.findAndCount({
      where,
      take: limit,
      skip,
      order: { created_at: "DESC" },
      relations: {
        images: true,
        category: {
          parent: true
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
    const result = await this.ormRepository.update(product.props.id!, raw);
    this.invalidateCache();
    return result.affected! > 0;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.ormRepository.delete(id);
    this.invalidateCache();
    return result.affected! > 0;
  }
}
