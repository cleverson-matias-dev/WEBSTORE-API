import { Attribute } from "@modules/catalogo/domain/entities/attribute.entity";
import { AttributeEntity } from "./entities/AttributeEntity";
import { AppDataSource } from "@shared/infra/db/data-source";
import { Repository } from "typeorm";
import { IAttributeRepository } from "@modules/catalogo/application/repository/IAttributeRepository";
import { AttributeName } from "@modules/catalogo/domain/value-objects/attribute.name.vo";

export class TypeORMAttributeRepository implements IAttributeRepository {
    private repository: Repository<AttributeEntity> = AppDataSource.getRepository(AttributeEntity);

    private toDomain(val: AttributeEntity): Attribute {
        return new Attribute({
            id: val.id,
            name: new AttributeName(val.name),
            created_at: val.created_at,
            updated_at: val.updated_at
        });
    }

    async save(attribute: Attribute): Promise<Attribute> {
        const { name } = attribute.getProps();

        const result = await this.repository.findBy({name: name.val()});
        if(result.length) throw new Error('Esse atributo já existe.');

        const data: AttributeEntity = this.repository.create({
            name: name.val()
        })

        const saved: AttributeEntity = await this.repository.save(data);
        return this.toDomain(saved);

    }

    async all(): Promise<Attribute[]> {
        const result = await this.repository.find();
        return result.map(this.toDomain);
    }

    async findBy(id: string): Promise<Attribute | []> {
        const result = await this.repository.findOneBy({id});
        return result ? this.toDomain(result) : [];
    }

    async update(id: string, name: string): Promise<boolean> {
        const voNome: AttributeName = new AttributeName(name);
        const result = await this.repository.update(id, {name: voNome.val()});
        return !!(result.affected && result.affected > 0);
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.repository.delete(id);
        return !!(result.affected && result.affected > 0);
    }
    
}