import { ICategoryRepository } from "@modules/catalogo/application/repository/ICategoryRepository";
import { AppDataSource } from "@shared/infra/db/data-source";
import { Equal, Repository } from "typeorm";
import { Categoria, ICategoria } from "@modules/catalogo/domain/entities/categoria.entity";
import { CategoriaEntity } from "./entities/CategoriaEntity";
import { CategoriaNome } from "@modules/catalogo/domain/value-objects/categoria.nome.vo";

export class TypeORMCategoryRepository implements ICategoryRepository{

    private dataSource: Repository<CategoriaEntity> = AppDataSource.getRepository(CategoriaEntity)

    async save(categoria: Categoria): Promise<Categoria>{

        const cat_exists = await this.dataSource.findOneBy({nome: categoria.getProps().nome.val()});

        if(cat_exists) {
            throw new Error('Essa categoria já existe.');
        }

        const data = this.dataSource.create({
            nome: categoria.getProps().nome.val(),
            parent_id: categoria.getProps().parent_id,
            slug: categoria.getProps().slug
        });

        const val = await this.dataSource.save(data);

        return new Categoria({
                id: val.id,
                nome: new CategoriaNome(val.nome),
                created_at: val.created_at,
                parent_id: val.parent_id,
                slug: val.slug,
                updated_at: val.updated_at
            })
    }

    async findAll(): Promise<Categoria[]> {
        const response =  await this.dataSource.find();

        return response.map(val => {
            return new Categoria({
                id: val.id,
                nome: new CategoriaNome(val.nome),
                created_at: val.created_at,
                parent_id: val.parent_id,
                slug: val.slug,
                updated_at: val.updated_at
            })
        })
    }

    async findById(id: string): Promise<Categoria | []> {

        const _val = await this.dataSource.findBy({id: Equal(id)});

        if(_val.length === 0) {
            return [];
        }

        const val = _val[0];

        return new Categoria({
                id: val.id,
                nome: new CategoriaNome(val.nome),
                created_at: val.created_at,
                parent_id: val.parent_id,
                slug: val.slug,
                updated_at: val.updated_at
            })

    }

    async update(id: string, nome: string): Promise<void> {

        try {
            const newCat = new Categoria({
                nome: new CategoriaNome(nome),
            })

            const categoria = await this.dataSource.update(id, {
                nome: newCat.getProps().nome.val(),
                slug: newCat.getProps().slug
            })

        } catch (error: any) {
            throw new Error(error.message)
        }

    }

    async delete(id: string): Promise<number | null | undefined> {

        try {
            const result = await this.dataSource.delete(id);
            return result.affected
        } catch (error: any) {
            throw new Error(error.message)
        }
       
    }

}