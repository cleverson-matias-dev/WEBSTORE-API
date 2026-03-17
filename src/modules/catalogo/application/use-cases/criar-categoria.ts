import { Categoria, ICategoria } from "@modules/catalogo/domain/entities/categoria.entity";
import { ICategoryRepository } from "../repository/ICategoryRepository";
import { CategoriaNome } from "@modules/catalogo/domain/value-objects/categoria.nome.vo";

export class CriarCategoria {
    constructor(private repository: ICategoryRepository) {}

    async executar(data: any) {
        const nome = new CategoriaNome(data.nome);
        data.parent_id = (data.parent_id === "") ? null : data.parent_id;
        const categoria = new Categoria({nome, parent_id: data.parent_id, slug: data.slug});
        return await this.repository.save(categoria);
    }
}