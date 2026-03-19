
import { CategoriaNome } from "../../domain/value-objects/categoria.nome.vo";
import { ICategoryRepository } from "../repository/ICategoryRepository";
import { Categoria } from "../../domain/entities/categoria.entity";
import { CreateCategoriaDTO, UpdateCategoriaDTO, CategoriaDTO } from "../dtos/categoria-dtos";
import { CategoriaMapper } from "../dtos/categoria-mapper";

export class AlterarCategoria {
    constructor(private repo: ICategoryRepository) {}

    async executar(id: string, dto: UpdateCategoriaDTO): Promise<void> {
        const nome = new CategoriaNome(dto.nome);
        await this.repo.update(id, nome.val());
    }
}

export class BuscarCategoria {
    constructor(private repositorio: ICategoryRepository){}

    async executar(id: string): Promise<CategoriaDTO | null> {
        const categoria = await this.repositorio.findById(id);
        if (categoria instanceof Categoria) {
            return CategoriaMapper.toDTO(categoria);
        }
        return null;
    }
}

export class CriarCategoria {
    constructor(private repository: ICategoryRepository) {}

    async executar(dto: CreateCategoriaDTO): Promise<CategoriaDTO> {
        const nome = new CategoriaNome(dto.nome);
        const parent_id = dto.parent_id === "" ? null : dto.parent_id;
        const categoria = new Categoria({ nome, parent_id, slug: dto.slug });
        const saved = await this.repository.save(categoria);
        return CategoriaMapper.toDTO(saved);
    }
}

export class DeletarCategoria {
    constructor(private repo: ICategoryRepository) {}

    async executar(id: string): Promise<boolean> {
        return this.repo.delete(id);
    }
}

export class ListarCategorias {
    constructor(private repository: ICategoryRepository) {}

    async executar(): Promise<CategoriaDTO[]> {
        const categorias = await this.repository.findAll();
        return categorias.map(CategoriaMapper.toDTO);
    }

}

