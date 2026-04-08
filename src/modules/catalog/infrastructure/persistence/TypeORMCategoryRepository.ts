import { CategoryFilterOptions, ICategoryRepository } from "@modules/catalog/application/interfaces/repository/ICategoryRepository";
import { AppDataSource } from "@shared/infra/db/data-source";
import { Like, Repository } from "typeorm";
import { Category } from "@modules/catalog/domain/entities/category.entity";
import { CategoryEntity } from "./entities/CategoryEntity";
import { CategoryName } from "@modules/catalog/domain/value-objects/category.name.vo";
import { AppError } from "@shared/errors/AppError";

export class TypeORMCategoryRepository implements ICategoryRepository {
    private repository: Repository<CategoryEntity> = AppDataSource.getRepository(CategoryEntity);

    private toDomain(val: CategoryEntity): Category {
        return new Category({
            id: val.id,
            name: new CategoryName(val.name),
            created_at: val.created_at,
            parent_id: val.parent_id,
            slug: val.slug,
            updated_at: val.updated_at
        });
    }

    async save(category: Category): Promise<Category> {
        const { name, parent_id, slug } = category.getProps();

        if(parent_id) {
            const parentExists = await this.repository.findOneBy({ id: parent_id });
            if (!parentExists) throw new AppError('categoria pai não existe', 404);
        }

        const data = this.repository.create({
            name: name.val(),
            parent_id,
            slug
        });

        try {
            const saved = await this.repository.save(data);
            return this.toDomain(saved);
        } catch (error) {
            console.log(error)
            throw new AppError('registro já existe', 409);
        }
       
    }

    async allPaginated(options: CategoryFilterOptions): Promise<[Category[], number]> {
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

    async findBy(id: string): Promise<Category | null> {
        const val = await this.repository.findOneBy({ id });
        return val ? this.toDomain(val) : null;
    }

    async update(id: string, name: string): Promise<boolean> {
        const voNome = new CategoryName(name);
        const categoriaMock = new Category({ name: voNome });

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
