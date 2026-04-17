import { MigrationInterface, QueryRunner } from "typeorm";

export class CriaTabelasStock1776276199908 implements MigrationInterface {
    name = 'CriaTabelasStock1776276199908'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`categories\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(100) NOT NULL, \`slug\` varchar(100) NOT NULL, \`parent_id\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_8b0be371d28245da6e4f4b6187\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`attributes\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(100) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_89afb34fd1fdb2ceb1cea6c57d\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`sku_atributo_valor\` (\`id\` varchar(36) NOT NULL, \`sku_id\` varchar(255) NOT NULL, \`attribute_id\` varchar(255) NOT NULL, \`value\` varchar(100) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_bb96f995e817c95638e3d74581\` (\`sku_id\`, \`attribute_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`skus\` (\`id\` varchar(36) NOT NULL, \`product_id\` varchar(255) NOT NULL, \`codigo_sku\` varchar(50) NOT NULL, \`preco\` decimal(10,2) NOT NULL, \`currency\` varchar(3) NOT NULL DEFAULT 'BRL', \`peso\` decimal(8,2) NOT NULL, \`dimensoes\` varchar(50) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_a3eaa9cd77a96bc704cf2addc7\` (\`codigo_sku\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`images\` (\`id\` varchar(36) NOT NULL, \`product_id\` varchar(255) NOT NULL, \`url\` varchar(255) NOT NULL, \`ordem\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_a4d7e908a3574e21ca5f06d0aa\` (\`url\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`produtos\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(100) NOT NULL, \`slug\` varchar(100) NOT NULL, \`description\` text NOT NULL, \`category_id\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_c6933880d8176ac1543ff5a0f0\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`webstore_stock\`.\`stock_items\` (\`id\` varchar(255) NOT NULL, \`sku\` varchar(255) NOT NULL, \`warehouseId\` varchar(255) NOT NULL, \`quantityOnHand\` int NOT NULL, \`quantityReserved\` int NOT NULL, \`version\` int NOT NULL, UNIQUE INDEX \`IDX_d09ffc6b80a318bc98be1272cb\` (\`sku\`, \`warehouseId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`webstore_stock\`.\`stock_reservations\` (\`id\` varchar(255) NOT NULL, \`orderId\` varchar(255) NOT NULL, \`sku\` varchar(255) NOT NULL, \`warehouseId\` varchar(255) NOT NULL, \`quantity\` int NOT NULL, \`expiresAt\` datetime NOT NULL, \`status\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`webstore_users\`.\`users\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, \`role\` enum ('client', 'admin') NOT NULL DEFAULT 'client', \`isActive\` int NOT NULL DEFAULT 1, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`webstore_stock\`.\`stock_warehouses\` (\`id\` varchar(255) NOT NULL, \`code\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`isActive\` tinyint NOT NULL, UNIQUE INDEX \`IDX_572844c1f38a96bb1369885a94\` (\`code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`categories\` ADD CONSTRAINT \`FK_88cea2dc9c31951d06437879b40\` FOREIGN KEY (\`parent_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`sku_atributo_valor\` ADD CONSTRAINT \`FK_ca2009a65163524517c931c5793\` FOREIGN KEY (\`sku_id\`) REFERENCES \`skus\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`sku_atributo_valor\` ADD CONSTRAINT \`FK_3e9438da118733c20ea3bb21de3\` FOREIGN KEY (\`attribute_id\`) REFERENCES \`attributes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`skus\` ADD CONSTRAINT \`FK_05f424c6f46cec6e6a196d57036\` FOREIGN KEY (\`product_id\`) REFERENCES \`produtos\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`images\` ADD CONSTRAINT \`FK_96fabbb1202770b8e6a58bf6f1d\` FOREIGN KEY (\`product_id\`) REFERENCES \`produtos\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`produtos\` ADD CONSTRAINT \`FK_b8fe5f645c7694d5543dc553a87\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`produtos\` DROP FOREIGN KEY \`FK_b8fe5f645c7694d5543dc553a87\``);
        await queryRunner.query(`ALTER TABLE \`images\` DROP FOREIGN KEY \`FK_96fabbb1202770b8e6a58bf6f1d\``);
        await queryRunner.query(`ALTER TABLE \`skus\` DROP FOREIGN KEY \`FK_05f424c6f46cec6e6a196d57036\``);
        await queryRunner.query(`ALTER TABLE \`sku_atributo_valor\` DROP FOREIGN KEY \`FK_3e9438da118733c20ea3bb21de3\``);
        await queryRunner.query(`ALTER TABLE \`sku_atributo_valor\` DROP FOREIGN KEY \`FK_ca2009a65163524517c931c5793\``);
        await queryRunner.query(`ALTER TABLE \`categories\` DROP FOREIGN KEY \`FK_88cea2dc9c31951d06437879b40\``);
        await queryRunner.query(`DROP INDEX \`IDX_572844c1f38a96bb1369885a94\` ON \`webstore_stock\`.\`stock_warehouses\``);
        await queryRunner.query(`DROP TABLE \`webstore_stock\`.\`stock_warehouses\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`webstore_users\`.\`users\``);
        await queryRunner.query(`DROP TABLE \`webstore_users\`.\`users\``);
        await queryRunner.query(`DROP TABLE \`webstore_stock\`.\`stock_reservations\``);
        await queryRunner.query(`DROP INDEX \`IDX_d09ffc6b80a318bc98be1272cb\` ON \`webstore_stock\`.\`stock_items\``);
        await queryRunner.query(`DROP TABLE \`webstore_stock\`.\`stock_items\``);
        await queryRunner.query(`DROP INDEX \`IDX_c6933880d8176ac1543ff5a0f0\` ON \`produtos\``);
        await queryRunner.query(`DROP TABLE \`produtos\``);
        await queryRunner.query(`DROP INDEX \`IDX_a4d7e908a3574e21ca5f06d0aa\` ON \`images\``);
        await queryRunner.query(`DROP TABLE \`images\``);
        await queryRunner.query(`DROP INDEX \`IDX_a3eaa9cd77a96bc704cf2addc7\` ON \`skus\``);
        await queryRunner.query(`DROP TABLE \`skus\``);
        await queryRunner.query(`DROP INDEX \`IDX_bb96f995e817c95638e3d74581\` ON \`sku_atributo_valor\``);
        await queryRunner.query(`DROP TABLE \`sku_atributo_valor\``);
        await queryRunner.query(`DROP INDEX \`IDX_89afb34fd1fdb2ceb1cea6c57d\` ON \`attributes\``);
        await queryRunner.query(`DROP TABLE \`attributes\``);
        await queryRunner.query(`DROP INDEX \`IDX_8b0be371d28245da6e4f4b6187\` ON \`categories\``);
        await queryRunner.query(`DROP TABLE \`categories\``);
    }

}
