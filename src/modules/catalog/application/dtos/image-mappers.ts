import { Image } from "@modules/catalog/domain/entities/image.entity";
import { CreateImageDTO, ImageResponseDTO } from "./image-dtos";
import { Url } from "@modules/catalog/domain/value-objects/url.vo";

export class ImageMapper {
  
  static toDomain(dto: CreateImageDTO): Image {
    return new Image({
      product_id: dto.product_id,
      url: new Url(dto.url),
      ordem: dto.ordem
    });
  }

  static toDTO(image: Image): ImageResponseDTO {
    const props = image.props_read_only;
    return {
      id: props.id!,
      product_id: props.product_id,
      url: image.url,
      ordem: props.ordem,
      created_at: props.created_at!
    };
  }

  static toDomainFromPersistence(raw: any): Image {
    return new Image({
      id: raw.id,
      product_id: raw.product_id,
      url: new Url(raw.url),
      ordem: raw.ordem,
      created_at: raw.created_at,
      updated_at: raw.updated_at
    });
  }
}
