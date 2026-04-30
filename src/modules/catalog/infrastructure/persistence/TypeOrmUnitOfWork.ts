import { AppDataSource } from "@shared/infra/db/data-source";
import { QueryRunner, EntityManager } from "typeorm";

export class TypeormUnitOfWork {
  private queryRunner: QueryRunner;

  constructor() {
    this.queryRunner = AppDataSource.createQueryRunner();
  }

  async start(): Promise<void> {
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
  }

  async commit(): Promise<void> {
    await this.queryRunner.commitTransaction();
    await this.queryRunner.release();
  }

  async rollback(): Promise<void> {
    await this.queryRunner.rollbackTransaction();
    await this.queryRunner.release();
  }

  getManager(): EntityManager {
    return this.queryRunner.manager;
  }
}
