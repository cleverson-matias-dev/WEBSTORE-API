import { ICategoryRepository } from "../repository/ICategoryRepository";

export class listarCategorias {
    constructor(private repository: ICategoryRepository) {}

    async executar() {
        return this.repository.findAll();
    }

}