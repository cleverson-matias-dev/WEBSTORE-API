import { SkuAttributeValue } from "@modules/catalog/domain/entities/sku-attribute-value";

describe('SkuAttributeValue Entity', () => {
  const validProps = {
    sku_id: '550e8400-e29b-41d4-a716-446655440000',
    attribute_id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    value: 'Cor Azul'
  };

  it('deve criar uma instância válida de SkuAttributeValue', () => {
    const sut = SkuAttributeValue.create(validProps);

    expect(sut).toBeDefined();
    expect(sut.id).toBeDefined(); // Verifica se o randomUUID funcionou
    expect(sut.value).toBe('Cor Azul');
  });

  it('deve lançar erro se o sku_id não for um UUID válido', () => {
    const invalidProps = { ...validProps, sku_id: 'invalid-uuid' };
    
    expect(() => SkuAttributeValue.create(invalidProps))
      .toThrow('SKU ID inválido.');
  });

  it('deve lançar erro se o attribute_id não for um UUID válido', () => {
    const invalidProps = { ...validProps, attribute_id: '123-abc' };
    
    expect(() => SkuAttributeValue.create(invalidProps))
      .toThrow('Atributo ID inválido.');
  });

  it('deve lançar erro se o valor for vazio ou apenas espaços', () => {
    const emptyProps = { ...validProps, value: '   ' };
    
    expect(() => SkuAttributeValue.create(emptyProps))
      .toThrow('O valor do atributo não pode ser vazio.');
  });

  it('deve lançar erro se o valor exceder 100 caracteres', () => {
    const longValue = 'a'.repeat(101);
    const invalidProps = { ...validProps, value: longValue };
    
    expect(() => SkuAttributeValue.create(invalidProps))
      .toThrow('O valor do atributo não pode exceder 100 caracteres.');
  });

  it('deve permitir alterar o valor e atualizar o campo updatedAt', () => {
    const sut = SkuAttributeValue.create(validProps);
    const initialUpdateDate = sut.updatedAt;

    // Simula um pequeno delay para garantir que o timestamp mude
    jest.useFakeTimers().setSystemTime(new Date().getTime() + 1000);

    sut.changeValue('Novo Valor');

    expect(sut.value).toBe('Novo Valor');
    expect(sut.updatedAt.getTime()).toBeGreaterThan(initialUpdateDate.getTime());
    
    jest.useRealTimers();
  });

  it('deve validar o novo valor ao chamar changeValue', () => {
    const sut = SkuAttributeValue.create(validProps);
    
    expect(() => sut.changeValue(''))
      .toThrow('O valor do atributo não pode ser vazio.');
  });
});
