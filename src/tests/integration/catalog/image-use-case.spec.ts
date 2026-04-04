import { CreateImageUseCase, DeleteImageUseCase } from "@modules/catalog/application/use-cases/image-use-cases";
import { InMemoryImageRepository } from "./mockImageRepository";
import { CreateImageDTO } from "@modules/catalog/application/dtos/image-dtos";
import { Image } from "@modules/catalog/domain/entities/image.entity";
import { Url } from "@modules/catalog/domain/value-objects/url.vo";
import { MockProductRepository } from "./mockProductRepository";
import { Product } from "@modules/catalog/domain/entities/product.entity";
import { MockCategoryRepository } from "./mockCategoriaRepository";
import { Category } from "@modules/catalog/domain/entities/category.entity";
import { CategoryName } from "@modules/catalog/domain/value-objects/category.name.vo";

describe('CreateImageUseCase Integration', () => {
  let repo: InMemoryImageRepository;
  let productRepo: MockProductRepository;
  let categoryRepo: MockCategoryRepository;
  let useCase: CreateImageUseCase;

  beforeEach(async () => {
    repo = new InMemoryImageRepository();
    productRepo = new MockProductRepository();
    categoryRepo = new MockCategoryRepository();
    useCase = new CreateImageUseCase(repo, productRepo);
  });

  it('deve salvar uma nova imagem com sucesso', async () => {

    const category = await categoryRepo.save(new Category({
      name: new CategoryName('Categoria A')
    }))

    const product = await productRepo.save(Product.create({
      category_id: category.id,
      name: 'Produto A',
      description: 'Descrição A',
      slug: ''
    }))


    const image: CreateImageDTO = { 
      product_id: product.id, 
      url: 'http://aws.s3/img.png', 
      ordem: 1 
    };

    const result = await useCase.execute(image);

    expect(result).toHaveProperty('id');
    expect(repo.items.length).toBe(1);
  });

  it('deve falhar se o produto não existir', async () => {
    productRepo.findBy({id:'not-a-product'}); // Produto não encontrado
    const dto: CreateImageDTO = { product_id: 'erro', url: 'http://x.com', ordem: 1 };

    await expect(useCase.execute(dto)).rejects.toThrow('produto não encontrado');
  });
});

describe('DeleteImageUseCase Integration', () => {
  it('deve remover uma imagem existente', async () => {
    const repo = new InMemoryImageRepository();
    const img = new Image({ id: 'img1', product_id: 'p1', url: new Url('http://ok.com'), ordem: 1 });
    await repo.save(img);

    const deleteUC = new DeleteImageUseCase(repo);
    await deleteUC.execute('img1');

    expect(repo.items.length).toBe(0);
  });
});
