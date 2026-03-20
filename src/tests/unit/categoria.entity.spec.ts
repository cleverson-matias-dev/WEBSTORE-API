import { Category } from '@modules/catalogo/domain/entities/category.entity';
import { CategoryName } from '../../modules/catalogo/domain/value-objects/category.name.vo';

describe('Category Entity', () => {
    
    // Helper para criar o Value Object de name
    const makeNome = (name: string) => new CategoryName(name);

    it('deve criar uma category válida com slug gerado automaticamente', () => {
        const name = 'Eletrônicos e Celulares';
        const category = new Category({
            name: makeNome(name)
        });

        const props = category.getProps();
        
        expect(props.name.val()).toBe(name);
        expect(props.slug).toBe('eletronicos-e-celulares');
    });

    it('deve manter o slug fornecido se ele já existir nas props', () => {
        const category = new Category({
            name: makeNome('Computadores'),
            slug: 'slug-customizado-manual'
        });

        expect(category.getProps().slug).toBe('slug-customizado-manual');
    });

    it('deve gerar slug corretamente com caracteres especiais e acentuação', () => {
        const category = new Category({
            name: makeNome('  Cozinha & Decoração Ávida!  ')
        });

        // Esperado: minúsculo, sem acento, sem símbolos, espaços viram hífens
        expect(category.getProps().slug).toBe('cozinha-decoracao-avida');
    });

    it('deve aceitar e armazenar um parent_id opcional', () => {
        const parentId = 'uuid-pai-123';
        const category = new Category({
            name: makeNome('Subcategoria'),
            parent_id: parentId
        });

        expect(category.getProps().parent_id).toBe(parentId);
    });

    it('deve garantir que múltiplos hífens seguidos no slug sejam normalizados', () => {
        const category = new Category({
            name: makeNome('Teste --- Espaçamento')
        });

        expect(category.getProps().slug).toBe('teste-espacamento');
    });
});
