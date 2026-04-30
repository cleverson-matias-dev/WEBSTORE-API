import type { ICategoryRepository } from "./ICategoryRepository";
import type { IProductRepository } from "./IProductRepository";
import type { ISkuRepository } from "./ISkuRepository";

export interface IWorkManager {
  getProductRepository(): IProductRepository;
  getCategoryRepository(): ICategoryRepository;
  getSkuRepository(): ISkuRepository;
}

export interface IUnitOfWork {
  runInTransaction<T>(work: (manager: IWorkManager) => Promise<T>): Promise<T>;
}
