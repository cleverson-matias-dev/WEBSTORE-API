import { AppError } from "@shared/errors/AppError";
import { CreateImageDTO, ImageResponseDTO, PaginatedImagesDTO, UpdateImageDTO } from "../dtos/image-dtos";
import { ImageMapper } from "../dtos/image-mappers";
import { IImageRepository } from "../interfaces/repository/IImageRepository";
import { Image } from "@modules/catalog/domain/entities/image.entity";
import { Url } from "@modules/catalog/domain/value-objects/url.vo";

export class CreateImageUseCase {
  constructor(private imageRepo: IImageRepository) {}

  async execute(input: CreateImageDTO): Promise<ImageResponseDTO> {
    const image = ImageMapper.toDomain(input);
    const savedImage = await this.imageRepo.save(image);
    return ImageMapper.toDTO(savedImage);
  }
}

export class GetImageByIdUseCase {
  constructor(private imageRepo: IImageRepository) {}

  async execute(id: string): Promise<ImageResponseDTO> {
    const image = await this.imageRepo.findById(id);
    if (!image) throw new AppError("Imagem não encontrada", 404);
    
    return ImageMapper.toDTO(image);
  }
}

export class UpdateImageUseCase {
  constructor(private imageRepo: IImageRepository) {}

  async execute(input: UpdateImageDTO): Promise<boolean> {
    const imageExists = await this.imageRepo.findById(input.id);
    if (!imageExists) throw new AppError("Imagem não encontrada", 404);

    const props = imageExists.props_read_only;

    const updatedImage = new Image({
      ...props,
      url: input.url ? new Url(input.url) : props.url,
      ordem: input.ordem ?? props.ordem,
      updated_at: new Date()
    });

    return this.imageRepo.update(updatedImage);
  }
}

export class ListImagesUseCase {
  constructor(private imageRepo: IImageRepository) {}

  async execute(page: number, limit: number): Promise<PaginatedImagesDTO> {
    const result = await this.imageRepo.allPaginated(page, limit);

    return {
      data: result.items.map(image => ImageMapper.toDTO(image)),
      total: result.total,
      page: result.current_page
    };
  }
}

export class DeleteImageUseCase {
  constructor(private imageRepo: IImageRepository) {}

  async execute(id: string): Promise<boolean> {
    const image = await this.imageRepo.findById(id);
    if (!image) throw new AppError("Imagem não encontrada", 404);
    
    return this.imageRepo.delete(id);
  }
}
