import { AtributoNome } from "@modules/catalogo/domain/value-objects/atributo.nome.vo";
import { IAtributoRepository } from "../repository/IAtributoRepository";
import { Atributo } from "@modules/catalogo/domain/entities/atributo.entity";
import { CreateAtributoDTO, UpdateAtributoDTO, AtributoDTO } from "../dtos/atributo-dtos";
import { AtributoMapper } from "../dtos/atributo-mapper";

export class AlterarAtributo {
    constructor(private repo: IAtributoRepository) {}

    async executar(id: string, dto: UpdateAtributoDTO): Promise<void> {
        const nome = new AtributoNome(dto.nome);
        await this.repo.update(id, nome.val());
    }
}

export class BuscarAtributo {
    constructor(private repositorio: IAtributoRepository){}

    async executar(id: string): Promise<AtributoDTO | null> {
        const atributo = await this.repositorio.findById(id);
        if (atributo instanceof Atributo) {
            return AtributoMapper.toDTO(atributo);
        }
        return null;
    }
}

export class CriarAtributo {
    constructor(private repository: IAtributoRepository) {}

    async executar(dto: CreateAtributoDTO): Promise<AtributoDTO> {
        const nome = new AtributoNome(dto.nome);
        const atributo = new Atributo({ nome: nome });
        const saved = await this.repository.save(atributo);
        return AtributoMapper.toDTO(saved);
    }
}

export class DeletarAtributo {
    constructor(private repo: IAtributoRepository) {}

    async executar(id: string): Promise<boolean> {
        return this.repo.delete(id);
    }
}

export class ListarAtributos {
    constructor(private repository: IAtributoRepository) {}

    async executar(): Promise<AtributoDTO[]> {
        const atributos = await this.repository.findAll();
        return atributos.map(AtributoMapper.toDTO);
    }

}

