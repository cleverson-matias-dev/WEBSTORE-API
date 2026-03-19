import { Atributo } from "@modules/catalogo/domain/entities/atributo.entity" 

export interface IAtributoRepository {
    save(atributo: Atributo): Promise<Atributo>
    findAll(): Promise<Atributo[]>
    findById(id: string): Promise<Atributo | []>
    update(id: string, nome: string): Promise<boolean>
    delete(id: string): Promise<boolean>
}