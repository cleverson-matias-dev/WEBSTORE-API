import { Categoria } from "../entities/categoria.entity";

export interface CategoriaRepository {
    salvar(categoria: Categoria): Promise<void>;
    all(): Promise<Categoria[] | null>;
    buscarPorId(id: string): Promise<Categoria | null>;
}