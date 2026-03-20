import { ICategoryRepository } from "@modules/catalogo/application/repository/ICategoryRepository";
import { AppDataSource } from "@shared/infra/db/data-source";
import { Repository } from "typeorm";
import { Category } from "@modules/catalogo/domain/entities/category.entity";
import { CategoryEntity } from "./entities/CategoryEntity";
import { CategoryName } from "@modules/catalogo/domain/value-objects/category.name.vo";

export class TypeORMCategoryRepository implements ICategoryRepository {
    private repository: Repository<CategoryEntity> = AppDataSource.getRepository(CategoryEntity);

    // Helper para converter o que vem do banco para o Domínio
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

        const exists = await this.repository.findOneBy({ name: name.val() });
        if (exists) throw new Error('Essa categoria já existe.');

        if (parent_id) {
            const parentExists = await this.repository.findOneBy({ id: parent_id });
            if (!parentExists) throw new Error('Category pai não existe');
        }

        const data = this.repository.create({
            name: name.val(),
            parent_id,
            slug
        });

        const saved = await this.repository.save(data);
        return this.toDomain(saved);
    }

    async all(): Promise<Category[]> {
        const response = await this.repository.find();
        return response.map(this.toDomain);
    }

    async findBy(id: string): Promise<Category | []> {
        const val = await this.repository.findOneBy({ id });
        return val ? this.toDomain(val) : [];
    }

    async update(id: string, name: string): Promise<void> {
        const voNome = new CategoryName(name);
        // O slug é gerado no domínio, por isso instanciamos a entidade de domínio
        const categoriaMock = new Category({ name: voNome });

        await this.repository.update(id, {
            name: voNome.val(),
            slug: categoriaMock.getProps().slug
        });
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.repository.delete(id);
        return !!(result.affected && result.affected > 0);
    }
}
