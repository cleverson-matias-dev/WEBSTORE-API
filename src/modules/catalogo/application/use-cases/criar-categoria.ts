import { CategoriaDomain, CategoriaDomainProps } from "@modules/catalogo/domain/entities/categoria.entity";
import { CategoriaRepository } from "@modules/catalogo/domain/ports/categoria-repository";

export class CriarCategoria {
    constructor(private repo: CategoriaRepository) {}

    async executar(dados: CategoriaDomainProps): Promise<CategoriaDomain> {
        const categoria = new CategoriaDomain(dados);
        await this.repo.salvar(categoria);
        return categoria;
    }
}