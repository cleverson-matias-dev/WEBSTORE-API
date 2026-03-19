import { Atributo } from "@modules/catalogo/domain/entities/atributo.entity";
import { MockAtributoRepository } from "./mockAtributoRepository";
import { AlterarAtributo, BuscarAtributo, CriarAtributo, DeletarAtributo, ListarAtributos } from "@modules/catalogo/application/use-cases/atributo-use-cases";


describe('Casos de Uso: Atributo', () => {
    let repo: MockAtributoRepository;

    beforeEach(() => {
        repo = new MockAtributoRepository();
    });

    test('Deve criar um novo atributo', async () => {
        const casoDeUso = new CriarAtributo(repo);
        const resultado = await casoDeUso.executar({ nome: 'Cor Primária' });

        expect(resultado).toBeInstanceOf(Atributo);
        expect(resultado.getProps().nome.val()).toBe('Cor Primária');
        expect(resultado.getProps().id).toBeDefined();
    });

    test('Deve buscar um atributo pelo ID', async () => {
        const criarUC = new CriarAtributo(repo);
        const atributoCriado = await criarUC.executar({ nome: 'Tamanho' });
        const id = atributoCriado.getProps().id;

        const buscarUC = new BuscarAtributo(repo);
        const resultado = await buscarUC.executar(id);

        expect(resultado).toBeInstanceOf(Atributo);
        if (resultado instanceof Atributo) {
            expect(resultado.getProps().id).toBe(id);
        }
    });

    test('Deve listar todos os atributos', async () => {
        const criarUC = new CriarAtributo(repo);
        await criarUC.executar({ nome: 'Atributo 1' });
        await criarUC.executar({ nome: 'Atributo 2' });

        const listarUC = new ListarAtributos(repo);
        const lista = await listarUC.executar();

        expect(lista).toHaveLength(2);
        expect(lista[0].getProps().nome.val()).toBe('Atributo 1');
    });

    test('Deve alterar o nome de um atributo', async () => {
        const criarUC = new CriarAtributo(repo);
        const atributo = await criarUC.executar({ nome: 'Nome Antigo' });
        const id = atributo.getProps().id;

        const alterarUC = new AlterarAtributo(repo);
        const sucesso = await alterarUC.executar(id, 'Nome Novo');

        const buscarUC = new BuscarAtributo(repo);
        const atualizado = await buscarUC.executar(id) as Atributo;

        expect(sucesso).toBe(true);
        expect(atualizado.getProps().nome.val()).toBe('Nome Novo');
    });

    test('Deve deletar um atributo', async () => {
        const criarUC = new CriarAtributo(repo);
        const atributo = await criarUC.executar({ nome: 'Para Deletar' });
        const id = atributo.getProps().id;

        const deletarUC = new DeletarAtributo(repo);
        const sucesso = await deletarUC.executar(id);

        const listarUC = new ListarAtributos(repo);
        const lista = await listarUC.executar();

        expect(sucesso).toBe(true);
        expect(lista).toHaveLength(0);
    });

    test('Não deve criar atributo com nome inválido (menos de 3 caracteres)', async () => {
        const casoDeUso = new CriarAtributo(repo);
        await expect(casoDeUso.executar({ nome: 'Ab' }))
            .rejects.toThrow('Nome de Atributo inválido.');
    });
});
