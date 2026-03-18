import { Categoria } from "../../../catalogo/domain/entities/categoria.entity";
import { AlterarCategoria, BuscarCategoria, CriarCategoria, DeletarCategoria, ListarCategorias } from "./categoria-use-cases";
import { MockCategoryRepository } from "./mockRepository"

describe('Use Cases: Categoria (com Mock Repository Real)', () => {
    let repo: MockCategoryRepository;

    beforeEach(() => {
        repo = new MockCategoryRepository();
    });

    describe('CriarCategoria', () => {
        it('deve persistir uma nova categoria no repositório', async () => {
            const useCase = new CriarCategoria(repo);
            const input = { nome: 'Eletrônicos', slug: 'eletronicos', parent_id: '' };

            const resultado = await useCase.executar(input);
            const itens = await repo.findAll();

            expect(itens).toHaveLength(1);
            expect(resultado.getProps().nome.val()).toBe('Eletrônicos');
            expect(resultado.getProps().parent_id).toBeNull();
        });
    });

    describe('BuscarCategoria', () => {
        it('deve encontrar uma categoria existente pelo ID', async () => {
            const useCaseCriar = new CriarCategoria(repo);
            const categoriaCriada = await useCaseCriar.executar({ nome: 'Games', slug: 'games' });
            const id = categoriaCriada.getProps().id;

            const useCaseBuscar = new BuscarCategoria(repo);
            const resultado = await useCaseBuscar.executar(id);

            // Garante que não é false antes de acessar as propriedades
            expect(resultado).not.toBe(false);
            
            if (resultado instanceof Categoria) {
                expect(resultado.getProps().nome.val()).toBe('Games');
            }
        });


        it('deve retornar null se a categoria não existir', async () => {
            const useCase = new BuscarCategoria(repo);
            const resultado = await useCase.executar('id-inexistente');
            expect(resultado).toEqual([]);
        });
    });

    describe('AlterarCategoria', () => {
        it('deve atualizar o nome de uma categoria existente', async () => {
            const useCaseCriar = new CriarCategoria(repo);
            const categoria = await useCaseCriar.executar({ nome: 'Antigo', slug: 'antigo' });
            const id = categoria.getProps().id;

            const useCaseAlterar = new AlterarCategoria(repo);
            await useCaseAlterar.executar(id, 'Novo Nome');

            const categoriaAtualizada = await repo.findById(id as string);

            if(categoriaAtualizada instanceof Categoria) {
                expect(categoriaAtualizada?.getProps().nome.val()).toBe('Novo Nome');
            }
        });
    });

    describe('DeletarCategoria', () => {
        it('deve remover a categoria e retornar 1 se deletado com sucesso', async () => {
            const useCaseCriar = new CriarCategoria(repo);
            const categoria = await useCaseCriar.executar({ nome: 'Para Deletar', slug: 'delete' });
            const id = categoria.getProps().id;

            const useCaseDeletar = new DeletarCategoria(repo);
            const resultado = await useCaseDeletar.executar(id);

            const itens = await repo.findAll();
            expect(resultado).toBe(1);
            expect(itens).toHaveLength(0);
        });
    });

    describe('ListarCategorias', () => {
        it('deve listar todas as categorias cadastradas', async () => {
            const useCaseCriar = new CriarCategoria(repo);
            await useCaseCriar.executar({ nome: 'Cat 1', slug: 'cat-1' });
            await useCaseCriar.executar({ nome: 'Cat 2', slug: 'cat-2' });

            const useCaseListar = new ListarCategorias(repo);
            const resultado = await useCaseListar.executar();

            expect(resultado).toHaveLength(2);
        });
    });
});
