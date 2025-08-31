import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRuFieldsToProducts1755374994448 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "products"
        ADD COLUMN IF NOT EXISTS "title_ru" varchar(255),
        ADD COLUMN IF NOT EXISTS "description_ru" text,
        ADD COLUMN IF NOT EXISTS "characteristics_ru" text,
        ADD COLUMN IF NOT EXISTS "country_ru" varchar(255);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "products"
        DROP COLUMN IF EXISTS "country_ru",
        DROP COLUMN IF EXISTS "characteristics_ru",
        DROP COLUMN IF EXISTS "description_ru",
        DROP COLUMN IF EXISTS "title_ru";
    `);
  }
}
