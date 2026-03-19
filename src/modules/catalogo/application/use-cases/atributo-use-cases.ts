import { AtributoNome } from "@modules/catalogo/domain/value-objects/atributo.nome.vo";
import { IAtributoRepository } from "../repository/IAtributoRepository";
import { Atributo } from "@modules/catalogo/domain/entities/atributo.entity";

export class AlterarAtributo {
    constructor(private repo: IAtributoRepository) {}

    async executar(id: any, nome: any) {
        return this.repo.update(id, nome);
    }
}

export class BuscarAtributo {
    constructor(private repositorio: IAtributoRepository){}

    async executar(id: any){
        return this.repositorio.findById(id);
    }
}

export class CriarAtributo {
    constructor(private repository: IAtributoRepository) {}

    async executar(data: any) {
        const nome = new AtributoNome(data.nome);
        const atributo = new Atributo({ nome: nome });
        return await this.repository.save(atributo);
    }
}

export class DeletarAtributo {
    constructor(private repo: IAtributoRepository) {}

    async executar(id: any) {
        return this.repo.delete(id);
    }
}

export class ListarAtributos {
    constructor(private repository: IAtributoRepository) {}

    async executar() {
        return this.repository.findAll();
    }

}

