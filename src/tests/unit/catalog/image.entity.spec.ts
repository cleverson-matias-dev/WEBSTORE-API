// image.entity.spec.ts

import { Image } from "@modules/catalog/domain/entities/image.entity";
import { Url } from "@modules/catalog/domain/value-objects/url.vo";

describe("Image Domain Unit Tests", () => {
  
  describe("Url Value Object", () => {
    it("deve criar uma URL válida", () => {
      const validUrl = "https://google.com";
      const urlVo = new Url(validUrl);
      expect(urlVo.getValue()).toBe(validUrl);
    });

    it("deve lançar erro para URL inválida", () => {
      const invalidUrl = "url-invalida";
      expect(() => new Url(invalidUrl)).toThrow(`URL inválida: ${invalidUrl}`);
    });
  });

  describe("Image Entity", () => {
    const validProps = {
      produto_id: "prod-123",
      url: new Url("https://meusite.com"),
      ordem: 1
    };

    it("deve instanciar uma imagem com valores padrão para datas", () => {
      const image = new Image(validProps);
      
      expect(image.url).toBe("https://meusite.com");
      expect(image.props_read_only.produto_id).toBe("prod-123");
      expect(image.props_read_only.created_at).toBeInstanceOf(Date);
      expect(image.props_read_only.updated_at).toBeInstanceOf(Date);
    });

    it("deve permitir recuperar as propriedades via props_read_only", () => {
      const id = "uuid-1";
      const image = new Image({ ...validProps, id });
      
      expect(image.props_read_only.id).toBe(id);
      expect(image.props_read_only.ordem).toBe(1);
    });

    it("deve garantir que a url retornada pelo getter seja uma string", () => {
      const image = new Image(validProps);
      expect(typeof image.url).toBe("string");
    });

    it("deve manter as datas fornecidas manualmente no construtor", () => {
      const customDate = new Date("2023-01-01");
      const image = new Image({
        ...validProps,
        created_at: customDate
      });

      expect(image.props_read_only.created_at).toEqual(customDate);
    });
  });
});
