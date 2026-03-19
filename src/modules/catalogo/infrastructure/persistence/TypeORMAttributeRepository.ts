import { IAtributoRepository } from "@modules/catalogo/application/repository/IAtributoRepository";
import { Atributo } from "@modules/catalogo/domain/entities/atributo.entity";
import { AtributoEntity } from "./entities/AtributoEntity";
import { AtributoNome } from "@modules/catalogo/domain/value-objects/atributo.nome.vo";
import { AppDataSource } from "@shared/infra/db/data-source";
import { Repository } from "typeorm";

export class TypeORMAttributeRepository implements IAtributoRepository {
    private repository: Repository<AtributoEntity> = AppDataSource.getRepository(AtributoEntity);

    private toDomain(val: AtributoEntity): Atributo {
        return new Atributo({
            id: val.id,
            nome: new AtributoNome(val.nome),
            created_at: val.created_at,
            updated_at: val.updated_at
        });
    }

    async save(atributo: Atributo): Promise<Atributo> {
        const { nome } = atributo.getProps();

        const result = await this.repository.findBy({nome: nome.val()});
        if(result.length) throw new Error('Esse atributo já existe.');

        const data: AtributoEntity = this.repository.create({
            nome: nome.val()
        })

        const saved: AtributoEntity = await this.repository.save(data);
        return this.toDomain(saved);

    }

    async findAll(): Promise<Atributo[]> {
        const result = await this.repository.find();
        return result.map(this.toDomain);
    }

    async findById(id: string): Promise<Atributo | []> {
        const result = await this.repository.findOneBy({id});
        return result ? this.toDomain(result) : [];
    }

    async update(id: string, nome: string): Promise<boolean> {
        const voNome: AtributoNome = new AtributoNome(nome);
        const result = await this.repository.update(id, {nome: voNome.val()});
        return !!(result.affected && result.affected > 0);
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.repository.delete(id);
        return !!(result.affected && result.affected > 0);
    }
    
}