import { Repository } from "typeorm";
import { Image } from "@modules/catalog/domain/entities/image.entity";
import { IImageRepository, SearchResult } from "@modules/catalog/application/interfaces/repository/IImageRepository";
import { ImageEntity } from "./entities/ImageEntity";
import { ImageMapper } from "@modules/catalog/application/dtos/image-mappers";
import { AppDataSource } from "@shared/infra/db/data-source";
import { BaseCacheRepository } from "./BaseCacheRepository";
import redisClient from "@shared/infra/cache/redis";

export class TypeOrmImageRepository
extends BaseCacheRepository
implements IImageRepository {

  private readonly ormRepository: Repository<ImageEntity> = AppDataSource.getRepository(ImageEntity);
  protected CACHE_TAG: string = "image";
  
  async save(image: Image): Promise<Image> {
    const props = image.props_read_only;

    const imageEntity = this.ormRepository.create({
      id: props.id,
      product_id: props.product_id,
      url: image.url,
      ordem: props.ordem,
      created_at: props.created_at,
      updated_at: props.updated_at
    });

    const saved = await this.ormRepository.save(imageEntity);
    this.invalidateCache();

    return ImageMapper.toDomainFromPersistence(saved);
  }

  async allPaginated(page: number, limit: number): Promise<SearchResult<Image>> {

    const cacheKey = await this.getCacheKey(`p:${page}l:${limit}`);
    const cachedResult = await redisClient.get(cacheKey);
    if(cachedResult) {
      const [items, total] = JSON.parse(cachedResult);
      return {
        items: items.map( (item: ImageEntity) => ImageMapper.toDomainFromPersistence(item)),
        total,
        current_page: page,
        limit
      }
    }

    const [items, total] = await this.ormRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { ordem: "ASC" }
    });

    await redisClient.set(cacheKey, JSON.stringify([items, total]), {EX: this.TTL});

    return {
      items: items.map(item => ImageMapper.toDomainFromPersistence(item)),
      total,
      current_page: page,
      limit
    };
  }

  async findBy(prop:object): Promise<Image | null> {
    const found = await this.ormRepository.findOneBy({ ...prop });
    
    if (!found) return null;
    
    return ImageMapper.toDomainFromPersistence(found);
  }

  async update(image: Image): Promise<boolean> {
    const props = image.props_read_only;
    
    if (!props.id) return false;

    const result = await this.ormRepository.update(props.id, {
      url: image.url,
      ordem: props.ordem,
    });

    this.invalidateCache();

    return result.affected !== undefined && result.affected > 0;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.ormRepository.delete(id);
    this.invalidateCache();
    return !!(result.affected && result.affected > 0);
  }
}
