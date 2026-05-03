import type { IUnitOfWork } from "@modules/catalog/application/interfaces/repository/IUnitOfWork";
import type { DataSource } from "typeorm";
import { transactionStorage } from "./TransactionContext";

export class TypeormUnitOfWork implements IUnitOfWork {
  constructor(private dataSource: DataSource) {}

  async run<T>(work: () => Promise<T>): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    return await transactionStorage.run(queryRunner.manager, async () => {
      try {
        const result = await work();
        await queryRunner.commitTransaction();
        return result;
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
    });
  }
}
