import { Attribute } from "@modules/catalog/domain/entities/attribute.entity";
import { AttributeEntity } from "./entities/AttributeEntity";
import { AppDataSource } from "@shared/infra/db/data-source";
import { Like, Repository } from "typeorm";
import { AttributeFilterOptions, IAttributeRepository } from "@modules/catalog/application/interfaces/repository/IAttributeRepository";
import { AttributeName } from "@modules/catalog/domain/value-objects/attribute.name.vo";
import { AppError } from "@shared/errors/AppError";

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
        const data = this.repository.create({ name: name.val() });
        const saved = await this.repository.save(data);
        return this.toDomain(saved);
    }

    async allPaginated(options: AttributeFilterOptions): Promise<[Attribute[], number]> {
        const { limit, offset, name } = options;

        const [entities, total] = await this.repository.findAndCount({
            where: name ? { name: Like(`%${name}%`) } : {},
            take: limit,   
            skip: offset,   
            order: { name: 'ASC' } 
        });

        const domainAttributes = entities.map(entity => this.toDomain(entity));

        return [domainAttributes, total];
    }

    async findBy(id: string): Promise<Attribute | null> {
        const result = await this.repository.findOneBy({id});
        return result ? this.toDomain(result) : null;
    }

    async findByName(name: string): Promise<Attribute | null> {
        const result = await this.repository.findOneBy({name});
        return result ? this.toDomain(result) : null;
    }

    async update(id: string, name: string): Promise<void> {
        this.repository.update(id, {name: name});
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.repository.delete(id);
        const success = !!(result.affected && result.affected > 0);
        if(!success) throw new AppError('recurso não encontrado', 404);
        return success
    }
    
}