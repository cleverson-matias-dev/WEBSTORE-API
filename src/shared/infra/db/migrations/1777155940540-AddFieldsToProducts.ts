import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddFieldsToProducts1777155940540 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns('webstore_catalogo.produtos', [
            new TableColumn({
                name: 'brand',
                type: 'varchar',
                length: '100',
                isNullable: true,
            }),
            new TableColumn({
                name: 'collection_id',
                type: 'varchar',
                length: '36',
                isNullable: true,
            }),
            new TableColumn({
                name: 'product_type',
                type: 'enum',
                enum: ['simple', 'variable', 'digital', 'service'],
                default: "'simple'",
            }),
            new TableColumn({
                name: 'visibility',
                type: 'enum',
                enum: ['catalog', 'search', 'hidden'],
                default: "'catalog'",
            }),
            new TableColumn({
                name: 'published_at',
                type: 'timestamp',
                isNullable: true,
            }),
            new TableColumn({
                name: 'short_description',
                type: 'text',
                isNullable: true,
            }),
            new TableColumn({
                name: 'meta_description_title',
                type: 'varchar',
                length: '255',
                isNullable: true,
            }),
            new TableColumn({
                name: 'has_variants',
                type: 'boolean',
                default: false,
            }),
            new TableColumn({
                name: 'video_url',
                type: 'varchar',
                length: '255',
                isNullable: true,
            }),
            new TableColumn({
                name: 'deleted_at',
                type: 'timestamp',
                isNullable: true,
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumns('webstore_catalogo.produtos', [
            'brand',
            'collection_id',
            'product_type',
            'visibility',
            'published_at',
            'short_description',
            'meta_description_title',
            'has_variants',
            'video_url',
            'deleted_at',
        ]);
    }
}
