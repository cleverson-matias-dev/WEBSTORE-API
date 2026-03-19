// Atributo.spec.ts
import { AtributoNome } from "@modules/catalogo/domain/value-objects/atributo.nome.vo"; // ajuste o caminho
import { Atributo, IAtributo } from "@modules/catalogo/domain/entities/atributo.entity";

describe('AtributoNome Value Object', () => {
    test('deve criar um nome de atributo válido', () => {
        const nome = "Cor do Produto";
        const vo = AtributoNome.create(nome);
        expect(vo.val()).toBe(nome);
    });

    test('deve lançar erro se o nome tiver menos de 3 caracteres', () => {
        expect(() => AtributoNome.create('Ab')).toThrow('Nome de Atributo inválido.');
    });

    test('deve lançar erro se o nome tiver mais de 100 caracteres', () => {
        const nomeLongo = 'a'.repeat(101);
        expect(() => AtributoNome.create(nomeLongo)).toThrow('Nome de Atributo inválido.');
    });

    test('deve aceitar caracteres especiais permitidos (acentos e símbolos)', () => {
        const nomeEspecial = 'Tamanho/Peso (Kg!) @2023';
        const vo = AtributoNome.create(nomeEspecial);
        expect(vo.val()).toBe(nomeEspecial);
    });

    test('deve invalidar strings vazias ou nulas', () => {
        expect(() => AtributoNome.create('')).toThrow();
        // @ts-ignore
        expect(() => AtributoNome.create(null)).toThrow();
    });
});

describe('Atributo Entity', () => {
    test('deve instanciar a entidade Atributo com sucesso', () => {
        const nomeVO = AtributoNome.create('Material Principal');
        const dataCriacao = new Date();
        
        const props: IAtributo = {
            id: 'uuid-123',
            nome: nomeVO,
            created_at: dataCriacao
        };

        const atributo = new Atributo(props);

        expect(atributo.getProps().nome).toBeInstanceOf(AtributoNome);
        expect(atributo.getProps().nome.val()).toBe('Material Principal');
        expect(atributo.getProps().id).toBe('uuid-123');
        expect(atributo.getProps().created_at).toBe(dataCriacao);
    });

    test('deve garantir que a entidade retorne as props corretamente via getProps', () => {
        const nomeVO = AtributoNome.create('Voltagem');
        const atributo = new Atributo({ nome: nomeVO });

        expect(atributo.getProps()).toHaveProperty('nome');
        expect(atributo.getProps().nome.val()).toBe('Voltagem');
    });
});
