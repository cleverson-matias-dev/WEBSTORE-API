import { ICategoryRepository } from "@modules/catalogo/application/repository/ICategoryRepository";
import { AppDataSource } from "@shared/infra/db/data-source";
import { Repository } from "typeorm";
import { Categoria } from "@modules/catalogo/domain/entities/categoria.entity";
import { CategoriaEntity } from "./entities/CategoriaEntity";

export class TypeORMCategoryRepository implements ICategoryRepository{

    private dataSource: Repository<CategoriaEntity> = AppDataSource.getRepository(CategoriaEntity)

    async save(categoria: Categoria): Promise<void>{

        const data = this.dataSource.create({
            nome: categoria.getProps().nome.val(),
            parent_id: categoria.getProps().parent_id,
            slug: categoria.getProps().slug
        });

        this.dataSource.save(data);
    }

}