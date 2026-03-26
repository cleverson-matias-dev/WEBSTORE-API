import { Image } from "@modules/catalog/domain/entities/image.entity"

export interface ImagesFilterOptions {
    name?: string,
    limit: number,
    offset: number
}

export interface IImageRepository {
    save(image: Image): Promise<Image>
    allPaginated(options: ImagesFilterOptions): Promise<[Image[], number]>
    findBy(id: string): Promise<Image | null>
    update(id: string, name: string): Promise<boolean>
    delete(id: string): Promise<boolean>
}