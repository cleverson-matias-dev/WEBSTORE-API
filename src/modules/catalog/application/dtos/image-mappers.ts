import { Image } from "@modules/catalog/domain/entities/image.entity";
import { CreateImageDTO, ImageResponseDTO } from "./image-dtos";
import { Url } from "@modules/catalog/domain/value-objects/url.vo";
import type { ImageEntity } from "@modules/catalog/infrastructure/persistence/entities/ImageEntity";

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

  static toDomainFromPersistence(image: ImageEntity): Image {
    return new Image({
      id: image.id,
      product_id: image.product_id,
      url: new Url(image.url),
      ordem: image.ordem,
      created_at: image.created_at,
      updated_at: image.updated_at
    });
  }
}
