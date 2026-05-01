import { AppDataSource } from "@shared/infra/db/data-source";
import { BaseCacheRepository } from "./BaseCacheRepository";
import { OutboxEntity } from "./entities/OutboxEntity";
import { transactionStorage } from "./TransactionContext";
import type { IOutBoxRepository, TEvent } from "@modules/catalog/application/interfaces/repository/IOutboxRepository";

export class TyepORMOutBoxRepository
extends BaseCacheRepository
implements IOutBoxRepository {
  
  protected CACHE_TAG: string = "product";

  private get repository() {

    const manager = transactionStorage.getStore();

    if (manager) {
      return manager.getRepository(OutboxEntity);
    }
    
    return AppDataSource.getRepository(OutboxEntity);
  }

  async save(events: TEvent[]): Promise<void> {
      const outBoxEntries = this.repository.create(events);
      await this.repository.save(outBoxEntries);
  }

}
