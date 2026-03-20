import { Attribute } from "@modules/catalogo/domain/entities/attribute.entity" 

export interface IAttributeRepository {
    save(attribute: Attribute): Promise<Attribute>
    all(): Promise<Attribute[]>
    findBy(id: string): Promise<Attribute | []>
    update(id: string, name: string): Promise<boolean>
    delete(id: string): Promise<boolean>
}