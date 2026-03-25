import { Category } from "../../modules/catalog/domain/entities/category.entity";
import { UpdateCategoryUC, FindCategoryByIdUC, SaveCategoryUC, DeleteCategoryUC, GetAllCategoriesUC } from "../../modules/catalog/application/use-cases/category-use-cases";
import { MockCategoryRepository } from "./mockCategoriaRepository"
import { AppError } from "@shared/errors/AppError";

describe('Use Cases: Category (com Mock Repository Real)', () => {
    let repo: MockCategoryRepository;

    beforeEach(() => {
        repo = new MockCategoryRepository();
    });

    describe('SaveCategoryUC', () => {
        it('deve persistir uma nova category no repositório', async () => {
            const useCase = new SaveCategoryUC(repo);
            const input = { name: 'Eletrônicos', slug: 'eletronicos', parent_id: '' };

            const resultado = await useCase.execute(input);
            const itens = await repo.all();

            expect(itens).toHaveLength(1);
            expect(resultado.name).toBe('Eletrônicos');
            expect(resultado.parent_id).toBeNull();
        });
    });

    describe('FindCategoryByIdUC', () => {
        it('deve encontrar uma category existente pelo ID', async () => {
            const useCaseCriar = new SaveCategoryUC(repo);
            const categoriaCriada = await useCaseCriar.execute({ name: 'Games', slug: 'games' });
            const id = categoriaCriada.id;

            const useCaseBuscar = new FindCategoryByIdUC(repo);
            const resultado = await useCaseBuscar.execute(id);

            expect(resultado).toBeDefined();
            expect(resultado?.name).toBe('Games');
        });


        it('deve emitir um erro se a category não existir', async () => {
            const useCase = new FindCategoryByIdUC(repo);
            
            await expect(useCase.execute('id-inexistente'))
                .rejects.toThrow(new AppError('categoria não encontrada', 404));
        });
    });

    describe('UpdateCategoryUC', () => {
        it('deve atualizar o name de uma category existente', async () => {
            const useCaseCriar = new SaveCategoryUC(repo);
            const category = await useCaseCriar.execute({ name: 'Antigo', slug: 'antigo' });
            const id = category.id;

            const useCaseAlterar = new UpdateCategoryUC(repo);
            await useCaseAlterar.execute(id, { name: 'Novo Nome' });

            const categoriaAtualizada = await repo.findBy(id);

            if(categoriaAtualizada instanceof Category) {
                expect(categoriaAtualizada?.getProps().name.val()).toBe('Novo Nome');
            }
        });
    });

    describe('DeleteCategoryUC', () => {
        it('deve remover a category e retornar 1 se deletado com sucesso', async () => {
            const useCaseCriar = new SaveCategoryUC(repo);
            const category = await useCaseCriar.execute({ name: 'Para Deletar', slug: 'delete' });
            const id = category.id;

            const useCaseDeletar = new DeleteCategoryUC(repo);
            const resultado = await useCaseDeletar.execute(id);

            const itens = await repo.all();
            expect(resultado).toBe(true);
            expect(itens).toHaveLength(0);
        });
    });

    describe('GetAllCategoriesUC', () => {
        it('deve listar todas as categories cadastradas', async () => {
            const useCaseCriar = new SaveCategoryUC(repo);
            await useCaseCriar.execute({ name: 'Cat 1', slug: 'cat-1' });
            await useCaseCriar.execute({ name: 'Cat 2', slug: 'cat-2' });

            const useCaseListar = new GetAllCategoriesUC(repo);
            const resultado = await useCaseListar.execute({});

            expect(resultado.items).toHaveLength(2);
        });
    });
});
