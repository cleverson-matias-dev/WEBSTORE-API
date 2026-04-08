// Attribute.spec.ts
import { AttributeName } from "@modules/catalog/domain/value-objects/attribute.name.vo"; // ajuste o caminho
import { Attribute, IAttribute } from "@modules/catalog/domain/entities/attribute.entity";

describe('AttributeName Value Object', () => {
    test('deve criar um name de attribute válido', () => {
        const name = "Cor do Produto";
        const vo = AttributeName.create(name);
        expect(vo.val()).toBe(name);
    });

    test('deve lançar erro se o name tiver menos de 3 caracteres', () => {
        expect(() => AttributeName.create('Ab')).toThrow('Nome de Attribute inválido.');
    });

    test('deve lançar erro se o name tiver mais de 100 caracteres', () => {
        const nomeLongo = 'a'.repeat(101);
        expect(() => AttributeName.create(nomeLongo)).toThrow('Nome de Attribute inválido.');
    });

    test('deve aceitar caracteres especiais permitidos (acentos e símbolos)', () => {
        const nomeEspecial = 'Tamanho/Peso (Kg!) @2023';
        const vo = AttributeName.create(nomeEspecial);
        expect(vo.val()).toBe(nomeEspecial);
    });

    test('deve invalidar strings vazias ou nulas', () => {
        expect(() => AttributeName.create('')).toThrow();
        // @ts-expect-error null
        expect(() => AttributeName.create(null)).toThrow();
    });
});

describe('Attribute Entity', () => {
    test('deve instanciar a entidade Attribute com sucesso', () => {
        const nomeVO = AttributeName.create('Material Principal');
        const dataCriacao = new Date();
        
        const props: IAttribute = {
            id: 'uuid-123',
            name: nomeVO,
            created_at: dataCriacao
        };

        const attribute = new Attribute(props);

        expect(attribute.getProps().name).toBeInstanceOf(AttributeName);
        expect(attribute.getProps().name.val()).toBe('Material Principal');
        expect(attribute.getProps().id).toBe('uuid-123');
        expect(attribute.getProps().created_at).toBe(dataCriacao);
    });

    test('deve garantir que a entidade retorne as props corretamente via getProps', () => {
        const nomeVO = AttributeName.create('Voltagem');
        const attribute = new Attribute({ name: nomeVO });

        expect(attribute.getProps()).toHaveProperty('name');
        expect(attribute.getProps().name.val()).toBe('Voltagem');
    });
});
