
import { SkuAttributeValueService } from "@modules/catalog/application/use-cases/sku-attribute-value-use-cases";
import { randomUUID } from "crypto";
import { MockSkuAttributeValueRepository } from "./MockSkuAttributeValueRepository";

describe("SkuAttributeValueService", () => {
  let service: SkuAttributeValueService;
  let repository: MockSkuAttributeValueRepository;

  const validSkuId = "11111111-1111-4111-a111-111111111111";
  const validAtributoId = "22222222-2222-4222-b222-222222222222";

  beforeEach(() => {
    repository = new MockSkuAttributeValueRepository();
    service = new SkuAttributeValueService(repository);
  });

  describe("assignAttribute", () => {
    it("deve atribuir um novo valor de atributo com sucesso", async () => {
      const data = {
        sku_id: validSkuId,
        attribute_id: validAtributoId,
        value: "Azul",
      };

      const result = await service.assignAttribute(data);

      expect(result).toHaveProperty("id");
      expect(result.value).toBe("Azul");
      expect(await repository.findAllBySku(validSkuId)).toHaveLength(1);
    });

    it("deve lançar erro se o atributo já estiver definido para o SKU", async () => {
      const data = {
        sku_id: validSkuId,
        attribute_id: validAtributoId,
        value: "Verde",
      };

      // Simula existência prévia
      await service.assignAttribute(data);

      await expect(service.assignAttribute(data)).rejects.toThrow(
        "Este atributo já está definido para este SKU."
      );
    });
  });

  describe("updateValue", () => {
    it("deve atualizar o valor de um atributo existente", async () => {
      // Criar um registro inicial
      const original = await service.assignAttribute({
        sku_id: validSkuId,
        attribute_id: validAtributoId,
        value: "Pequeno",
      });

      const updated = await service.updateValue({
        id: original.id,
        new_value: "Grande",
      });

      expect(updated.value).toBe("Grande");
      expect(updated.id).toBe(original.id);
    });

    it("deve lançar erro ao tentar atualizar um ID inexistente", async () => {
      await expect(
        service.updateValue({ id: randomUUID(), new_value: "Novo" })
      ).rejects.toThrow("Atributo de SKU não encontrado.");
    });
  });

  describe("listBySku", () => {
    it("deve listar todos os atributos de um SKU específico", async () => {
      await service.assignAttribute({ sku_id: validSkuId, attribute_id: randomUUID(), value: "V1" });
      await service.assignAttribute({ sku_id: validSkuId, attribute_id: randomUUID(), value: "V2" });
      await service.assignAttribute({ sku_id: randomUUID(), attribute_id: randomUUID(), value: "Outro" });

      const list = await service.listBySku(validSkuId);

      expect(list).toHaveLength(2);
      expect(list[0].value).toBe("V1");
    });
  });

  describe("remove", () => {
    it("deve remover um atributo com sucesso", async () => {
      const item = await service.assignAttribute({
        sku_id: validSkuId,
        attribute_id: validAtributoId,
        value: "Remover",
      });

      await service.remove(item.id);
      const list = await repository.findAllBySku(validSkuId);

      expect(list).toHaveLength(0);
    });

    it("deve lançar erro ao tentar remover ID inexistente", async () => {
      await expect(service.remove(randomUUID())).rejects.toThrow(
        "Atributo de SKU não encontrado para remoção."
      );
    });
  });
});
