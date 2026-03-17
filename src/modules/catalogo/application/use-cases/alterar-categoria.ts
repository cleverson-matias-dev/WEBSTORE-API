import { ICategoryRepository } from "../repository/ICategoryRepository";

export class AlterarCategoria {
    constructor(private repo: ICategoryRepository) {}

    async executar(id: any, nome: any) {
        return this.repo.update(id, nome);
    }
}