import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddFieldsToSkus1777156218332 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('webstore_catalogo.skus', new TableColumn({
            name: 'is_default',
            type: 'boolean',
            default: false,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('webstore_catalogo.skus', 'is_default');
    }


}
