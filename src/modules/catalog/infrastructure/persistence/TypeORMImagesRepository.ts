import { Repository } from "typeorm";
import { ImageEntity } from "./entities/ImageEntity";
import { AppDataSource } from "@shared/infra/db/data-source";
import { Image } from "@modules/catalog/domain/entities/image.entity";
import { IImageRepository, ImagesFilterOptions } from "@modules/catalog/application/interfaces/repository/IImageRepository";
import { AppError } from "@shared/errors/AppError";


export class TypeORMImageRepository implements IImageRepository {
    private repository: Repository<ImageEntity> = AppDataSource.getRepository(ImageEntity);

    private toDomain(val: ImageEntity): Image {
        return new Image({
            id: val.id,
            ordem: val.ordem,
            produto_id: val.produto_id,
            url: val.url,
            created_at: val.created_at,
            updated_at: val.updated_at
        });
    }

    async save(category: Image): Promise<Image> {
        const { produto_id, url, ordem } = category.getProps();

        

        try {
            
        } catch (error) {
            throw new AppError('registro já existe', 409);
        }
       
    }

    async allPaginated(options: ImagesFilterOptions): Promise<[Image[], number]> {
        const { limit, offset, name } = options;

        const [entities, total] = await this.repository.findAndCount({
            where: name ? { name: Like(`%${name}%`)} : {},
            take: limit,
            skip: offset,
            order: { name: 'ASC' }
        });

        const domainCategories = entities.map(this.toDomain);

        return [domainCategories, total];
    }

    async findBy(id: string): Promise<Image | null> {
        const val = await this.repository.findOneBy({ id });
        return val ? this.toDomain(val) : null;
    }

    async update(id: string, name: string): Promise<boolean> {
        //const voNome = new CategoryName(name);
        const categoriaMock = new Image({ name: voNome });

        const result =  await this.repository.update(id, {
            name: voNome.val(),
            slug: categoriaMock.getProps().slug
        });

        const success = !!(result.affected && result.affected > 0);
        if(!success) throw new AppError('recurso não encontrado', 404);
        return success;
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.repository.delete(id);
        const success = !!(result.affected && result.affected > 0);
        if(!success) throw new AppError('recurso não encontrado', 404);
        return success
    }
}
