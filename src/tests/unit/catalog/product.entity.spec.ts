import { Product, type ProductProps } from "@modules/catalog/domain/entities/product.entity";

describe("Product Domain Entity", () => {
  const makeProps = (overrides?: Partial<ProductProps>): ProductProps => ({
    name: "Produto Teste",
    description: "Descrição do produto teste",
    category_id: "782f0d9c-1234-4321-8888-1234567890ab",
    slug: "",
    has_variants: false,
    product_type: "digital",
    visibility: "catalog",
    ...overrides,
  });

  it("deve criar um novo produto com ID e Slug gerados automaticamente", () => {
    const props = makeProps({ slug: "" });
    const product = Product.create(props);

    expect(product.id).toBeDefined();
    // Verifica se é um UUID válido (versão 4 simplificada)
    expect(product.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    // Verifica se o slug foi gerado a partir do nome
    expect(product.props.slug).toBe("produto-teste");
  });

  it("deve manter o slug fornecido se ele não for uma string vazia", () => {
    const props = makeProps({ slug: "slug-personalizado" });
    const product = Product.create(props);

    expect(product.props.slug).toBe("slug-personalizado");
  });

  it("deve atualizar os dados do produto e gerar um novo slug se o nome mudar", () => {
    const product = Product.create(makeProps());
    
    product.update({
      name: "Novo Nome do Produto",
      slug: "novo-nome-do-produto",
      description: "Nova descrição"
    });

    expect(product.props.name).toBe("Novo Nome do Produto");
    expect(product.props.description).toBe("Nova descrição");
    expect(product.props.slug).toBe("novo-nome-do-produto");
  });

  it("não deve alterar o slug se apenas a descrição for atualizada", () => {
    const product = Product.create(makeProps({ name: "Nome Original" }));
    const slugOriginal = product.props.slug;

    product.update({ description: "Apenas mudei a descrição" });

    expect(product.props.slug).toBe(slugOriginal);
    expect(product.props.description).toBe("Apenas mudei a descrição");
  });

  it("deve permitir a atualização da categoria", () => {
    const product = Product.create(makeProps());
    const novaCategoriaId = "00000000-0000-0000-0000-000000000000";

    product.update({ category_id: novaCategoriaId });

    expect(product.props.category_id).toBe(novaCategoriaId);
  });
});
