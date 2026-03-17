import { ICategoryRepository } from "../repository/ICategoryRepository";

export class BuscarCategoria {
    constructor(private repositorio: ICategoryRepository){}

    async executar(id: any){
        return this.repositorio.findById(id);
    }
}