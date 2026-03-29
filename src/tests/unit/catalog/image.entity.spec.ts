import { Image } from "@modules/catalog/domain/entities/image.entity";
import { Url } from "@modules/catalog/domain/value-objects/url.vo";

describe("Image Entity Unit Tests", () => {
  it("should instantiate an image entity correctly", () => {
    const props = {
      produto_id: "prod-123",
      url: new Url("https://store.com"),
      ordem: 1,
    };

    const image = new Image(props);

    expect(image.props_read_only.produto_id).toBe("prod-123");
    expect(image.url).toBe("https://store.com");
    expect(image.props_read_only.ordem).toBe(1);
  });

  it("should allow creating with an existing ID and dates (persistence mode)", () => {
    const now = new Date();
    const image = new Image({
      id: "uuid-123",
      produto_id: "prod-123",
      url: new Url("https://store.com"),
      ordem: 2,
      created_at: now,
    });

    expect(image.props_read_only.id).toBe("uuid-123");
    expect(image.props_read_only.created_at).toEqual(now);
  });
});
