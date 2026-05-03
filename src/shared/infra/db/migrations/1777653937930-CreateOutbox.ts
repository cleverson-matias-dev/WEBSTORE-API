import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOutbox1777653937930 implements MigrationInterface {
    name = 'CreateOutbox1777653937930'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`integration_outbox\` (\`id\` varchar(36) NOT NULL, \`exchange\` varchar(255) NOT NULL, \`routing_key\` varchar(255) NOT NULL, \`payload\` text NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`processed_at\` timestamp NULL, \`published\` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`produtos\` DROP COLUMN \`collection_id\``);
        await queryRunner.query(`ALTER TABLE \`produtos\` ADD \`collection_id\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`produtos\` DROP COLUMN \`deleted_at\``);
        await queryRunner.query(`ALTER TABLE \`produtos\` ADD \`deleted_at\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`webstore_users\`.\`refresh_tokens\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`webstore_users\`.\`refresh_tokens\` ADD \`userId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`webstore_users\`.\`refresh_tokens\` DROP COLUMN \`expiresAt\``);
        await queryRunner.query(`ALTER TABLE \`webstore_users\`.\`refresh_tokens\` ADD \`expiresAt\` datetime NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`webstore_users\`.\`refresh_tokens\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`webstore_users\`.\`refresh_tokens\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`UQ_PRODUCT_IMAGE_URL\` ON \`images\` (\`product_id\`, \`url\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`UQ_PRODUCT_IMAGE_URL\` ON \`images\``);
        await queryRunner.query(`ALTER TABLE \`webstore_users\`.\`refresh_tokens\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`webstore_users\`.\`refresh_tokens\` ADD \`createdAt\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`webstore_users\`.\`refresh_tokens\` DROP COLUMN \`expiresAt\``);
        await queryRunner.query(`ALTER TABLE \`webstore_users\`.\`refresh_tokens\` ADD \`expiresAt\` timestamp NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`webstore_users\`.\`refresh_tokens\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`webstore_users\`.\`refresh_tokens\` ADD \`userId\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`produtos\` DROP COLUMN \`deleted_at\``);
        await queryRunner.query(`ALTER TABLE \`produtos\` ADD \`deleted_at\` timestamp(0) NULL`);
        await queryRunner.query(`ALTER TABLE \`produtos\` DROP COLUMN \`collection_id\``);
        await queryRunner.query(`ALTER TABLE \`produtos\` ADD \`collection_id\` varchar(36) NULL`);
        await queryRunner.query(`DROP TABLE \`integration_outbox\``);
    }

}
