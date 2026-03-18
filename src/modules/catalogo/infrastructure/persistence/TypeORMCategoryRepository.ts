import { ICategoryRepository } from "@modules/catalogo/application/repository/ICategoryRepository";
import { AppDataSource } from "@shared/infra/db/data-source";
import { Repository } from "typeorm";
import { Categoria } from "@modules/catalogo/domain/entities/categoria.entity";
import { CategoriaEntity } from "./entities/CategoriaEntity";
import { CategoriaNome } from "@modules/catalogo/domain/value-objects/categoria.nome.vo";

export class TypeORMCategoryRepository implements ICategoryRepository {
    private repository: Repository<CategoriaEntity> = AppDataSource.getRepository(CategoriaEntity);

    // Helper para converter o que vem do banco para o Domínio
    private toDomain(val: CategoriaEntity): Categoria {
        return new Categoria({
            id: val.id,
            nome: new CategoriaNome(val.nome),
            created_at: val.created_at,
            parent_id: val.parent_id,
            slug: val.slug,
            updated_at: val.updated_at
        });
    }

    async save(categoria: Categoria): Promise<Categoria> {
        const { nome, parent_id, slug } = categoria.getProps();

        const exists = await this.repository.findOneBy({ nome: nome.val() });
        if (exists) throw new Error('Essa categoria já existe.');

        if (parent_id) {
            const parentExists = await this.repository.findOneBy({ id: parent_id });
            if (!parentExists) throw new Error('Categoria pai não existe');
        }

        const data = this.repository.create({
            nome: nome.val(),
            parent_id,
            slug
        });

        const saved = await this.repository.save(data);
        return this.toDomain(saved);
    }

    async findAll(): Promise<Categoria[]> {
        const response = await this.repository.find();
        return response.map(this.toDomain);
    }

    async findById(id: string): Promise<Categoria | []> {
        const val = await this.repository.findOneBy({ id });
        return val ? this.toDomain(val) : [];
    }

    async update(id: string, nome: string): Promise<void> {
        const voNome = new CategoriaNome(nome);
        // O slug é gerado no domínio, por isso instanciamos a entidade de domínio
        const categoriaMock = new Categoria({ nome: voNome });

        await this.repository.update(id, {
            nome: voNome.val(),
            slug: categoriaMock.getProps().slug
        });
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.repository.delete(id);
        return !!(result.affected && result.affected > 0);
    }
}
