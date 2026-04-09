import { SkuAttributeValueService } from "@modules/catalog/application/use-cases/sku-attribute-value-use-cases";
import { InMemorySkuAttributeValueRepository } from "./mockAttributeValueRepo";
import type { CreateSkuAttributeValueRequestDTO } from "@modules/catalog/application/dtos/sku-attribute-value-dtos";


describe('SkuAttributeValueService (Use Cases)', () => {
  let repository: InMemorySkuAttributeValueRepository;
  let sut: SkuAttributeValueService;

  // UUIDs válidos para os testes
  const validSkuId = '550e8400-e29b-41d4-a716-446655440000';
  const validAttrId = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

  beforeEach(() => {
    repository = new InMemorySkuAttributeValueRepository();
    sut = new SkuAttributeValueService(repository);
  });

  describe('assignAttribute', () => {
    it('deve vincular um atributo a um SKU com sucesso', async () => {
      const data: CreateSkuAttributeValueRequestDTO = {
        sku_id: validSkuId,
        attribute_id: validAttrId,
        value: 'Algodão 100%'
      };

      const result = await sut.assignAttribute(data);

      expect(result).toHaveProperty('id');
      expect(result.value).toBe('Algodão 100%');
      
      const savedInRepo = await repository.findById(result.id);
      expect(savedInRepo).toBeTruthy();
    });

    it('não deve permitir vincular o mesmo atributo ao mesmo SKU duas vezes', async () => {
      const data: CreateSkuAttributeValueRequestDTO = {
        sku_id: validSkuId,
        attribute_id: validAttrId,
        value: 'Valor 1'
      };

      await sut.assignAttribute(data);

      // Segunda tentativa deve lançar erro 409 (Conflict)
      await expect(sut.assignAttribute(data))
        .rejects.toThrow('Este atributo já está definido para este SKU.');
    });
  });

  describe('updateValue', () => {
    it('deve atualizar o valor de um atributo existente', async () => {
      // Setup: Cria um registro inicial
      const created = await sut.assignAttribute({
        sku_id: validSkuId,
        attribute_id: validAttrId,
        value: 'Antigo'
      });

      const updated = await sut.updateValue({
        id: created.id,
        new_value: 'Novo'
      });

      expect(updated.value).toBe('Novo');
      const inRepo = await repository.findById(created.id);
      expect(inRepo?.value).toBe('Novo');
    });

    it('deve lançar erro 404 ao tentar atualizar atributo inexistente', async () => {
      await expect(sut.updateValue({ id: 'non-existent-id', new_value: 'teste' }))
        .rejects.toThrow('Atributo de SKU não encontrado.');
    });
  });

  describe('listBySku', () => {
    it('deve listar todos os atributos de um SKU específico', async () => {
      await sut.assignAttribute({ sku_id: validSkuId, attribute_id: validAttrId, value: 'V1' });
      await sut.assignAttribute({ sku_id: validSkuId, attribute_id: '8910b810-9dad-11d1-80b4-00c04fd430c9', value: 'V2' });

      const list = await sut.listBySku(validSkuId);

      expect(list).toHaveLength(2);
      expect(list[0].sku_id).toBe(validSkuId);
    });
  });

  describe('remove', () => {
    it('deve deletar um vínculo de atributo', async () => {
      const created = await sut.assignAttribute({
        sku_id: validSkuId,
        attribute_id: validAttrId,
        value: 'Deletar'
      });

      await sut.remove(created.id);

      const inRepo = await repository.findById(created.id);
      expect(inRepo).toBeNull();
    });

    it('deve lançar erro ao tentar remover ID inválido', async () => {
      await expect(sut.remove('id-fake'))
        .rejects.toThrow('Atributo de SKU não encontrado para remoção.');
    });
  });
});
