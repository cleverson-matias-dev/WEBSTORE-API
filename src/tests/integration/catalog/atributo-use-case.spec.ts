import { GetAllAttributesUC, saveAttributeUC } from "@modules/catalog/application/use-cases/attribute-use-cases";
import { InMemoryAttributeRepository } from "./mockAtributoRepository";

// tests/integration/AttributeFlow.spec.ts
describe('Attribute Integration Flow', () => {
    let repo: InMemoryAttributeRepository;
    let saveUC: saveAttributeUC;
    let getAllUC: GetAllAttributesUC;

    beforeAll(() => {
        repo = new InMemoryAttributeRepository();
        saveUC = new saveAttributeUC(repo);
        getAllUC = new GetAllAttributesUC(repo);
    });

    it('deve persistir e recuperar atributos paginados', async () => {
        // 1. Salva múltiplos registros
        await saveUC.execute({ name: 'Voltagem' });
        await saveUC.execute({ name: 'Amperagem' });

        // 2. Recupera via GetAllUC
        const result = await getAllUC.execute({ page: 1, limit: 10 });

        expect(result.total).toBe(2);
        expect(result.items[0]).toHaveProperty('id');
        expect(result.items.some(i => i.name === 'Voltagem')).toBe(true);
    });

    it('deve aplicar filtros corretamente na listagem', async () => {
        const result = await getAllUC.execute({ name: 'Volt' });
        expect(result.items).toHaveLength(1);
        expect(result.items[0].name).toBe('Voltagem');
    });
});
