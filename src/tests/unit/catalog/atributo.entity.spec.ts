import { saveAttributeUC } from "@modules/catalog/application/use-cases/attribute-use-cases";
import { Attribute } from "@modules/catalog/domain/entities/attribute.entity";
import { InMemoryAttributeRepository } from "../../../tests/integration/catalog/mockAtributoRepository";

// tests/unit/SaveAttributeUC.spec.ts
describe('SaveAttributeUC', () => {
    let repo: InMemoryAttributeRepository;
    let sut: saveAttributeUC;

    beforeEach(() => {
        repo = new InMemoryAttributeRepository();
        sut = new saveAttributeUC(repo);
    });

    it('deve criar um atributo com sucesso', async () => {
        const dto = { name: 'Tamanho' };
        const result = await sut.execute(dto);

        expect(result.name).toBe('Tamanho');
        expect(await repo.findByName('Tamanho')).toBeDefined();
    });

    it('deve lançar erro se o atributo já existir', async () => {
        await repo.save(Attribute.create("Cor"));
        
        await expect(sut.execute({ name: 'Cor' }))
            .rejects.toThrow('Attributo já existe');
    });
});
