import { ICategoryRepository } from "../repository/ICategoryRepository";

export class DeletarCategoria {
    constructor(private repo: ICategoryRepository) {}

    async executar(id: any) {
        return this.repo.delete(id);
    }
}