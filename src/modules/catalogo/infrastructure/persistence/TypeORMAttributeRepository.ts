import { Attribute } from "@modules/catalogo/domain/entities/attribute.entity";
import { AttributeEntity } from "./entities/AttributeEntity";
import { AppDataSource } from "@shared/infra/db/data-source";
import { Like, Repository } from "typeorm";
import { AttributeFilterOptions, IAttributeRepository } from "@modules/catalogo/application/repository/IAttributeRepository";
import { AttributeName } from "@modules/catalogo/domain/value-objects/attribute.name.vo";
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

        const result = await this.repository.findBy({name: name.val()});
        if(result.length) throw new AppError('Esse atributo já existe.', 404);

        const data: AttributeEntity = this.repository.create({
            name: name.val()
        })

        const saved: AttributeEntity = await this.repository.save(data);
        return this.toDomain(saved);

    }

    async allPaginated(options: AttributeFilterOptions): Promise<[Attribute[], number]> {
        const { limit, offset, name } = options;

        // Criamos o objeto de busca dinamicamente
        const [entities, total] = await this.repository.findAndCount({
            where: name ? { name: Like(`%${name}%`) } : {}, // Filtra se o nome for enviado
            take: limit,    // Equivalente ao LIMIT do SQL
            skip: offset,   // Equivalente ao OFFSET do SQL
            order: { name: 'ASC' } // Opcional: mantém uma ordenação padrão
        });

        // Mapeamos as entidades do TypeORM para objetos de domínio
        const domainAttributes = entities.map(entity => this.toDomain(entity));

        return [domainAttributes, total];
    }


    async findBy(id: string): Promise<Attribute | []> {
        const result = await this.repository.findOneBy({id});
        if(!result) throw new AppError('recurso não encontrado', 404);
        return result ? this.toDomain(result) : [];
    }

    async update(id: string, name: string): Promise<boolean> {
        const voNome: AttributeName = new AttributeName(name);
        const result = await this.repository.update(id, {name: voNome.val()});
        const success = !!(result.affected && result.affected > 0);
        if(!success) throw new AppError('recurso não encontrado', 404);
        return success
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.repository.delete(id);
        const success = !!(result.affected && result.affected > 0);
        if(!success) throw new AppError('recurso não encontrado', 404);
        return success
    }
    
}