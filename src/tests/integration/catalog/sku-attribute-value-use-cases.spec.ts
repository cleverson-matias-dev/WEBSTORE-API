
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
        skuId: validSkuId,
        atributoId: validAtributoId,
        valor: "Azul",
      };

      const result = await service.assignAttribute(data);

      expect(result).toHaveProperty("id");
      expect(result.valor).toBe("Azul");
      expect(await repository.findAllBySku(validSkuId)).toHaveLength(1);
    });

    it("deve lançar erro se o atributo já estiver definido para o SKU", async () => {
      const data = {
        skuId: validSkuId,
        atributoId: validAtributoId,
        valor: "Verde",
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
        skuId: validSkuId,
        atributoId: validAtributoId,
        valor: "Pequeno",
      });

      const updated = await service.updateValue({
        id: original.id,
        novoValor: "Grande",
      });

      expect(updated.valor).toBe("Grande");
      expect(updated.id).toBe(original.id);
    });

    it("deve lançar erro ao tentar atualizar um ID inexistente", async () => {
      await expect(
        service.updateValue({ id: randomUUID(), novoValor: "Novo" })
      ).rejects.toThrow("Atributo de SKU não encontrado.");
    });
  });

  describe("listBySku", () => {
    it("deve listar todos os atributos de um SKU específico", async () => {
      await service.assignAttribute({ skuId: validSkuId, atributoId: randomUUID(), valor: "V1" });
      await service.assignAttribute({ skuId: validSkuId, atributoId: randomUUID(), valor: "V2" });
      await service.assignAttribute({ skuId: randomUUID(), atributoId: randomUUID(), valor: "Outro" });

      const list = await service.listBySku(validSkuId);

      expect(list).toHaveLength(2);
      expect(list[0].valor).toBe("V1");
    });
  });

  describe("remove", () => {
    it("deve remover um atributo com sucesso", async () => {
      const item = await service.assignAttribute({
        skuId: validSkuId,
        atributoId: validAtributoId,
        valor: "Remover",
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
