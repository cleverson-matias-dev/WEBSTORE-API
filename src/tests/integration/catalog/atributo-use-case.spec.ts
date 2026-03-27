import { MockAtributoRepository } from "./mockAtributoRepository";
import { UpdateAttributeUC, FindAttributeUC, saveAttributeUC, DeleteAttributeUC, GetAllAttributesUC } from "@modules/catalog/application/use-cases/attribute-use-cases";


describe('Casos de Uso: Attribute', () => {
    let repo: MockAtributoRepository;

    beforeEach(() => {
        repo = new MockAtributoRepository();
    });

    test('Deve criar um novo attribute', async () => {
        const casoDeUso = new saveAttributeUC(repo);
        const resultado = await casoDeUso.execute({ name: 'Cor Primária' });

        expect(resultado).toBeDefined();
        expect(resultado.name).toBe('Cor Primária');
        expect(resultado.id).toBeDefined();
    });

    test('Deve buscar um attribute pelo ID', async () => {
        const criarUC = new saveAttributeUC(repo);
        const atributoCriado = await criarUC.execute({ name: 'Tamanho' });
        const id = atributoCriado.id;

        const buscarUC = new FindAttributeUC(repo);
        const resultado = await buscarUC.execute(id);

        expect(resultado).toBeDefined();
        expect(resultado?.id).toBe(id);
    });

    test('Deve listar todos os attributes', async () => {
        const criarUC = new saveAttributeUC(repo);
        await criarUC.execute({ name: 'Attribute 1' });
        await criarUC.execute({ name: 'Attribute 2' });

        const listarUC = new GetAllAttributesUC(repo);
        const lista = await listarUC.execute({});

        expect(lista.items).toHaveLength(2);
        expect(lista.items[0].name).toBe('Attribute 1');
    });

    test('Deve alterar o name de um attribute', async () => {
        const criarUC = new saveAttributeUC(repo);
        const attribute = await criarUC.execute({ name: 'Nome Antigo' });
        const id = attribute.id;

        const alterarUC = new UpdateAttributeUC(repo);
        await alterarUC.execute(id, { name: 'Nome Novo' });

        const buscarUC = new FindAttributeUC(repo);
        const atualizado = await buscarUC.execute(id);

        expect(atualizado?.name).toBe('Nome Novo');
    });

    test('Deve deletar um attribute', async () => {
        const criarUC = new saveAttributeUC(repo);
        const attribute = await criarUC.execute({ name: 'Para Deletar' });
        const id = attribute.id;

        const deletarUC = new DeleteAttributeUC(repo);
        const sucesso = await deletarUC.execute(id);

        const listarUC = new GetAllAttributesUC(repo);
        const lista = await listarUC.execute({});

        expect(sucesso).toBe(true);
        expect(lista.items).toHaveLength(0);
    });

    test('Não deve criar attribute com name inválido (menos de 3 caracteres)', async () => {
        const casoDeUso = new saveAttributeUC(repo);
        await expect(casoDeUso.execute({ name: 'Ab' }))
            .rejects.toThrow('Nome de Attribute inválido.');
    });
});
