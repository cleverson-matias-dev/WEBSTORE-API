import { Image as ImageDomain } from "@modules/catalog/domain/entities/image.entity";
import { Url } from "@modules/catalog/domain/value-objects/url.vo";

describe('Image Domain Entity', () => {
  it('deve criar uma instância de imagem válida', () => {
    const url = new Url('http://imagem.com');
    const image = new ImageDomain({ produto_id: '123', url, ordem: 1 });
    
    expect(image).toBeInstanceOf(ImageDomain);
    expect(image.url).toBe('http://imagem.com');
  });

  it('deve lançar erro se a URL for inválida', () => {
    expect(() => new Url('url-sem-http')).toThrow(`URL inválida: url-sem-http`);
  });
});
