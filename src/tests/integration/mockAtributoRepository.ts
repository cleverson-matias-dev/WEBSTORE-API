import { IAtributoRepository } from '@modules/catalogo/application/repository/IAtributoRepository';
import { Atributo } from '@modules/catalogo/domain/entities/atributo.entity';
import { AtributoNome } from '@modules/catalogo/domain/value-objects/atributo.nome.vo';
import { v4 as uuidv4 } from 'uuid';

export class MockAtributoRepository implements IAtributoRepository {
    private items: Atributo[] = [];

    async save(atributo: Atributo): Promise<Atributo> {
        const props = atributo.getProps();
        
        const novoAtributo = new Atributo({
            ...props,
            id: props.id || uuidv4(), 
            created_at: props.created_at || new Date(),
            updated_at: props.updated_at || new Date()
        });

        this.items.push(novoAtributo);
        return novoAtributo;
    }

    async findAll(): Promise<Atributo[]> {
        return this.items;
    }

    async findById(id: string): Promise<Atributo | []> {
        const item = this.items.find(i => i.getProps().id === id);
        return item ? item : [];
    }

    async update(id: string, nome: string): Promise<boolean> {
        const index = this.items.findIndex(i => i.getProps().id === id);
        
        if (index === -1) return false;

        const propsAntigas = this.items[index].getProps();
        
        this.items[index] = new Atributo({
            ...propsAntigas,
            nome: AtributoNome.create(nome),
            updated_at: new Date()
        });

        return true;
    }

    async delete(id: string): Promise<boolean> {
        const index = this.items.findIndex(i => i.getProps().id === id);
        
        if (index === -1) return false;

        this.items.splice(index, 1);
        return true;
    }
}
