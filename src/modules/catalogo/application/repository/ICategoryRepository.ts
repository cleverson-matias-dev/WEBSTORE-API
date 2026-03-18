import { Categoria } from "@modules/catalogo/domain/entities/categoria.entity";

export interface ICategoryRepository {
    save(categoria: Categoria): Promise<Categoria>
    findAll(): Promise<Categoria[]>
    findById(id: string): Promise<Categoria | []>
    update(id: string, nome: string): Promise<void>
    delete(id: string): Promise<boolean>
}