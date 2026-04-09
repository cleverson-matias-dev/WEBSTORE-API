import { Image, type IImage } from "@modules/catalog/domain/entities/image.entity";
import type { Url } from "@modules/catalog/domain/value-objects/url.vo";


describe('Image Domain Entity', () => {
  // Mock simples da classe Url para o teste
  const makeUrl = (path: string) => ({
    getValue: () => path
  } as Url);

  it('deve criar uma nova instância de Image com sucesso', () => {
    const props: IImage = {
      product_id: 'uuid-produto-123',
      url: makeUrl('https://exemplo.com'),
      ordem: 1
    };

    const image = new Image(props);

    expect(image).toBeDefined();
    expect(image.url).toBe('https://exemplo.com');
    expect(image.props_read_only.product_id).toBe('uuid-produto-123');
    expect(image.props_read_only.ordem).toBe(1);
  });

  it('deve gerar datas automáticas se não forem fornecidas', () => {
    const props: IImage = {
      product_id: 'uuid-1',
      url: makeUrl('http://link.com'),
      ordem: 0
    };

    const image = new Image(props);

    expect(image.props_read_only.created_at).toBeInstanceOf(Date);
    expect(image.props_read_only.updated_at).toBeInstanceOf(Date);
  });

  it('deve manter as datas se elas forem passadas no construtor', () => {
    const dataFixa = new Date('2023-01-01');
    const props: IImage = {
      product_id: 'uuid-1',
      url: makeUrl('http://link.com'),
      ordem: 0,
      created_at: dataFixa,
      updated_at: dataFixa
    };

    const image = new Image(props);

    expect(image.props_read_only.created_at).toEqual(dataFixa);
    expect(image.props_read_only.updated_at).toEqual(dataFixa);
  });

  it('deve retornar apenas o valor da string através do getter url', () => {
    const urlString = 'https://cdn.com';
    const image = new Image({
      product_id: 'id',
      url: makeUrl(urlString),
      ordem: 5
    });

    expect(image.url).toBe(urlString);
    expect(typeof image.url).toBe('string');
  });
});
