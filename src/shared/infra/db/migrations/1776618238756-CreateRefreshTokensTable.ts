import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateRefreshTokensTable1776618238756 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "webstore_users.refresh_tokens",
                columns: [
                    {
                        name: "id",
                        type: "varchar",
                        length: "36",
                        isPrimary: true,
                        isNullable: false,
                    },
                    {
                        name: "token",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "userId",
                        type: "varchar",
                        length: "36",
                        isNullable: false,
                    },
                    {
                        name: "expiresAt",
                        type: "timestamp",
                        isNullable: false,
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "now()",
                    },
                ],
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("webstore_users.refresh_tokens");
    }

}
