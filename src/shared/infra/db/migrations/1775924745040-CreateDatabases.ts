import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDatabases1775924745040 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE DATABASE IF NOT EXISTS webstore_catalogo`);
        await queryRunner.query(`CREATE DATABASE IF NOT EXISTS webstore_users`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP DATABASE webstore_catalogo`);
        await queryRunner.query(`DROP DATABASE webstore_users`);
    }

}
