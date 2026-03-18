import { Categoria } from '@modules/catalogo/domain/entities/categoria.entity';
import { CategoriaNome } from '../../modules/catalogo/domain/value-objects/categoria.nome.vo';

describe('Categoria Entity', () => {
    
    // Helper para criar o Value Object de nome
    const makeNome = (nome: string) => new CategoriaNome(nome);

    it('deve criar uma categoria válida com slug gerado automaticamente', () => {
        const nome = 'Eletrônicos e Celulares';
        const categoria = new Categoria({
            nome: makeNome(nome)
        });

        const props = categoria.getProps();
        
        expect(props.nome.val()).toBe(nome);
        expect(props.slug).toBe('eletronicos-e-celulares');
    });

    it('deve manter o slug fornecido se ele já existir nas props', () => {
        const categoria = new Categoria({
            nome: makeNome('Computadores'),
            slug: 'slug-customizado-manual'
        });

        expect(categoria.getProps().slug).toBe('slug-customizado-manual');
    });

    it('deve gerar slug corretamente com caracteres especiais e acentuação', () => {
        const categoria = new Categoria({
            nome: makeNome('  Cozinha & Decoração Ávida!  ')
        });

        // Esperado: minúsculo, sem acento, sem símbolos, espaços viram hífens
        expect(categoria.getProps().slug).toBe('cozinha-decoracao-avida');
    });

    it('deve aceitar e armazenar um parent_id opcional', () => {
        const parentId = 'uuid-pai-123';
        const categoria = new Categoria({
            nome: makeNome('Subcategoria'),
            parent_id: parentId
        });

        expect(categoria.getProps().parent_id).toBe(parentId);
    });

    it('deve garantir que múltiplos hífens seguidos no slug sejam normalizados', () => {
        const categoria = new Categoria({
            nome: makeNome('Teste --- Espaçamento')
        });

        expect(categoria.getProps().slug).toBe('teste-espacamento');
    });
});
