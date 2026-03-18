
import { CategoriaNome } from "../../domain/value-objects/categoria.nome.vo";
import { ICategoryRepository } from "../repository/ICategoryRepository";
import { Categoria } from "../../domain/entities/categoria.entity";

export class AlterarCategoria {
    constructor(private repo: ICategoryRepository) {}

    async executar(id: any, nome: any) {
        return this.repo.update(id, nome);
    }
}

export class BuscarCategoria {
    constructor(private repositorio: ICategoryRepository){}

    async executar(id: any){
        return this.repositorio.findById(id);
    }
}

export class CriarCategoria {
    constructor(private repository: ICategoryRepository) {}

    async executar(data: any) {
        const nome = new CategoriaNome(data.nome);
        data.parent_id = (data.parent_id === "") ? null : data.parent_id;
        const categoria = new Categoria({nome, parent_id: data.parent_id, slug: data.slug});
        return await this.repository.save(categoria);
    }
}

export class DeletarCategoria {
    constructor(private repo: ICategoryRepository) {}

    async executar(id: any) {
        return this.repo.delete(id);
    }
}

export class ListarCategorias {
    constructor(private repository: ICategoryRepository) {}

    async executar() {
        return this.repository.findAll();
    }

}

