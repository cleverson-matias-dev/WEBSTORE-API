import { Categoria, ICategoria } from "@modules/catalogo/domain/entities/categoria.entity";

export interface ICategoryRepository {
    save(categoria: Categoria): Promise<void>
    //findAll(): Promise<Categoria[]>
    //findById(id: string): Promise<Categoria | null>
    //delete(id: string): Promise<void>
}