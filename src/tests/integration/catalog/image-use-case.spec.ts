import { CreateImageUseCase, GetImageByIdUseCase, UpdateImageUseCase } from "@modules/catalog/application/use-cases/imgage-use-cases";
import { MockImageRepository } from "./mockImageRepository";

describe("Image Use Cases Integration Tests", () => {
  let repository: MockImageRepository;

  beforeEach(() => {
    repository = new MockImageRepository();
  });

  it("deve criar uma imagem e recuperá-la do repositório", async () => {
    const createUseCase = new CreateImageUseCase(repository);
    const input = {
      produto_id: "prod-1",
      url: "https://teste.com",
      ordem: 1
    };

    const result = await createUseCase.execute(input);

    expect(result.id).toBeDefined();
    expect(result.url).toBe(input.url);
    
    // Verifica se realmente está no "banco"
    const savedInDb = await repository.findById(result.id);
    expect(savedInDb?.url).toBe(input.url);
  });

  it("deve lançar erro ao tentar buscar imagem inexistente", async () => {
    const getUseCase = new GetImageByIdUseCase(repository);
    await expect(getUseCase.execute("id-inexistente")).rejects.toThrow("Imagem não encontrada");
  });

  it("deve atualizar a URL de uma imagem existente", async () => {
    const createUseCase = new CreateImageUseCase(repository);
    const updateUseCase = new UpdateImageUseCase(repository);

    // 1. Cria
    const created = await createUseCase.execute({
      produto_id: "p1",
      url: "https://old.com",
      ordem: 1
    });

    // 2. Atualiza
    const newUrl = "https://new.com";
    const success = await updateUseCase.execute({
      id: created.id,
      url: newUrl
    });

    // 3. Valida
    expect(success).toBe(true);
    const updated = await repository.findById(created.id);
    expect(updated?.url).toBe(newUrl);
  });

  it("deve validar a URL mesmo durante a atualização", async () => {
    const createUseCase = new CreateImageUseCase(repository);
    const updateUseCase = new UpdateImageUseCase(repository);

    const created = await createUseCase.execute({
      produto_id: "p1",
      url: "https://ok.com",
      ordem: 1
    });

    await expect(updateUseCase.execute({
      id: created.id,
      url: "url-invalida"
    })).rejects.toThrow("URL inválida");
  });
});
