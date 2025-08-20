import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSubCategoryColumn1755370994443 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Categories: new meta + position
    await queryRunner.query(`
      ALTER TABLE "categories"
        ADD COLUMN IF NOT EXISTS "title" varchar(255),
        ADD COLUMN IF NOT EXISTS "description" text,
        ADD COLUMN IF NOT EXISTS "heading" varchar(255),
        ADD COLUMN IF NOT EXISTS "position" integer NOT NULL DEFAULT 10000,
        ADD COLUMN IF NOT EXISTS "keywords" text;
    `);

    // Subcategories: new meta + position
    await queryRunner.query(`
      ALTER TABLE "subcategories"
        ADD COLUMN IF NOT EXISTS "title" varchar(255),
        ADD COLUMN IF NOT EXISTS "description" text,
        ADD COLUMN IF NOT EXISTS "heading" varchar(255),
        ADD COLUMN IF NOT EXISTS "position" integer NOT NULL DEFAULT 10000,
        ADD COLUMN IF NOT EXISTS "keywords" text;
    `);

    // Seed SEO fields if empty
    await queryRunner.query(`
      UPDATE "categories"
      SET
        "title" = "name" || ' - купити медтехніку в Україні - інтеренет-магазин Medix',
        "heading" = "name"
      WHERE "title" IS NULL OR "heading" IS NULL;
    `);

    await queryRunner.query(`
      UPDATE "subcategories"
      SET
        "title" = "name" || ' - купити медтехніку в Україні - інтеренет-магазин Medix',
        "heading" = "name"
      WHERE "title" IS NULL OR "heading" IS NULL;
    `);

    // Set category positions (original list order)
    await queryRunner.query(`
      UPDATE "categories" SET "position" = CASE "id"
        WHEN 1  THEN 1   -- Хірургія
        WHEN 2  THEN 2   -- Кардіологія
        WHEN 3  THEN 3   -- Реанімація
        WHEN 4  THEN 4   -- Меблі для медичних закладів
        WHEN 5  THEN 5   -- Фізіотерапевтичне та реабілітаційне обладнання
        WHEN 6  THEN 6   -- Офтальмологія
        WHEN 7  THEN 7   -- Неонатологія/Акушерство/Гінекологія
        WHEN 8  THEN 8   -- Кисневе обладнання
        WHEN 9  THEN 9   -- Стерилізація
        WHEN 10 THEN 10  -- Лабораторне обладнання
        WHEN 11 THEN 11  -- Ендоскопічне обладнання
        WHEN 12 THEN 12  -- Радіологія
        WHEN 13 THEN 13  -- УЗД
        WHEN 14 THEN 14  -- Лазери медичні
        WHEN 15 THEN 15  -- ЛОР
        WHEN 16 THEN 16  -- Стоматологія
        WHEN 17 THEN 17  -- Косметологія та дерматологія
        WHEN 18 THEN 18  -- Б/в обладнання
        ELSE 10000       -- any future categories go to the end
      END;
    `);

    // Subcategory positions per category (original list order)

    // 1: Хірургія
    await queryRunner.query(`
      UPDATE "subcategories" SET "position" = CASE "id"
        WHEN 4  THEN 1  -- Інфузійне обладнання
        WHEN 3  THEN 2  -- Відсмоктувачі хірургічні
        WHEN 77 THEN 3  -- Діодні хірургічні лазери
        WHEN 6  THEN 4  -- Електрохірургія
        WHEN 9  THEN 5  -- Набори інструментів
        WHEN 7  THEN 6  -- Нейрохірургія
        WHEN 5  THEN 7  -- Операційні мікроскопи
        WHEN 2  THEN 8  -- Операційні світильники
        WHEN 1  THEN 9  -- Операційні столи
        WHEN 78 THEN 10 -- Хірургічні лазери
        WHEN 8  THEN 11 -- Хірургічні інструменти
        ELSE 10000
      END
      WHERE "categoryid" = 1;
    `);

    // 2: Кардіологія
    await queryRunner.query(`
      UPDATE "subcategories" SET "position" = CASE "id"
        WHEN 10 THEN 1  -- Електрокардіографи
        WHEN 13 THEN 2  -- Зовнішні кардіостимулятори
        WHEN 11 THEN 3  -- Монітори пацієнтів
        WHEN 14 THEN 4  -- Пояси для ЕКГ
        WHEN 12 THEN 5  -- Холтери ЕКГ та АТ
        ELSE 10000
      END
      WHERE "categoryid" = 2;
    `);

    // 3: Реанімація
    await queryRunner.query(`
      UPDATE "subcategories" SET "position" = CASE "id"
        WHEN 16 THEN 1  -- Апарати наркозно-дихальні
        WHEN 15 THEN 2  -- ШВЛ
        WHEN 17 THEN 3  -- Дефібрилятори
        WHEN 18 THEN 4  -- Ларингоскопи
        ELSE 10000
      END
      WHERE "categoryid" = 3;
    `);

    // 4: Меблі для медичних закладів
    await queryRunner.query(`
      UPDATE "subcategories" SET "position" = CASE "id"
        WHEN 25 THEN 1  -- Візки...
        WHEN 27 THEN 2  -- Крісла медичні
        WHEN 24 THEN 3  -- Кушетки...
        WHEN 19 THEN 4  -- Ліжка
        WHEN 20 THEN 5  -- Столики
        WHEN 22 THEN 6  -- Стійки
        WHEN 28 THEN 7  -- Тумби
        WHEN 23 THEN 8  -- Шафи
        WHEN 21 THEN 9  -- Штативи
        ELSE 10000
      END
      WHERE "categoryid" = 4;
    `);

    // 5: Фізіотерапевтичне та реабілітаційне обладнання
    await queryRunner.query(`
      UPDATE "subcategories" SET "position" = CASE "id"
        WHEN 31 THEN 1  -- Електротерапія
        WHEN 33 THEN 2  -- Комбінована терапія
        WHEN 34 THEN 3  -- Лазерна терапія
        WHEN 86 THEN 4  -- Магнітотерапія
        WHEN 32 THEN 5  -- Опромінювачі
        WHEN 35 THEN 6  -- Реабілітаційне обладнання
        WHEN 30 THEN 7  -- Терапія
        WHEN 29 THEN 8  -- Ультразвукова терапія
        ELSE 10000
      END
      WHERE "categoryid" = 5;
    `);

    // 6: Офтальмологія
    await queryRunner.query(`
      UPDATE "subcategories" SET "position" = CASE "id"
        WHEN 39 THEN 1  -- Діагностика
        WHEN 37 THEN 2  -- Лампи щілинні
        WHEN 80 THEN 3  -- Опер. мікроскопи для офтальмології
        WHEN 79 THEN 4  -- Набори окулярних лінз
        WHEN 36 THEN 5  -- Офтальмологічні мікроскопи
        WHEN 38 THEN 6  -- Офтальмоскопи
        WHEN 81 THEN 7  -- Столи операційні
        ELSE 10000
      END
      WHERE "categoryid" = 6;
    `);

    // 7: Неонатологія/Акушерство/Гінекологія
    await queryRunner.query(`
      UPDATE "subcategories" SET "position" = CASE "id"
        WHEN 42 THEN 1  -- Інкубатори
        WHEN 46 THEN 2  -- Білірубінометри
        WHEN 41 THEN 3  -- Гінекологічні крісла-столи
        WHEN 45 THEN 4  -- Кольпоскопи
        WHEN 44 THEN 5  -- Ліжка акушерські
        WHEN 43 THEN 6  -- Меблі для неонатології
        WHEN 47 THEN 7  -- Фототерапія
        WHEN 40 THEN 8  -- Фетальні монітори та доплери
        ELSE 10000
      END
      WHERE "categoryid" = 7;
    `);

    // 8: Кисневе обладнання
    await queryRunner.query(`
      UPDATE "subcategories" SET "position" = CASE "id"
        WHEN 76 THEN 1  -- Концентратори
        ELSE 10000
      END
      WHERE "categoryid" = 8;
    `);

    // 9: Стерилізація
    await queryRunner.query(`
      UPDATE "subcategories" SET "position" = CASE "id"
        WHEN 50 THEN 1  -- Аквадистилятори
        WHEN 51 THEN 2  -- Мийні машини
        WHEN 48 THEN 3  -- Стерилізатори
        WHEN 49 THEN 4  -- Сухожарові шафи
        ELSE 10000
      END
      WHERE "categoryid" = 9;
    `);

    // 10: Лабораторне обладнання
    await queryRunner.query(`
      UPDATE "subcategories" SET "position" = CASE "id"
        WHEN 58 THEN 1  -- ІФА
        WHEN 57 THEN 2  -- Електроліти/газ
        WHEN 90 THEN 3  -- Аналізатори сечі
        WHEN 55 THEN 4  -- Біохімія
        WHEN 56 THEN 5  -- Гематологія
        WHEN 82 THEN 6  -- Мікроскопи
        WHEN 59 THEN 7  -- Розхідні матеріали
        ELSE 10000
      END
      WHERE "categoryid" = 10;
    `);

    // 11: Ендоскопічне обладнання
    await queryRunner.query(`
      UPDATE "subcategories" SET "position" = CASE "id"
        WHEN 53 THEN 1  -- Гнучка ендоскопія
        WHEN 54 THEN 2  -- Додаткове обладнання
        WHEN 52 THEN 3  -- Жорстка ендоскопія
        ELSE 10000
      END
      WHERE "categoryid" = 11;
    `);

    // 12: Радіологія
    await queryRunner.query(`
      UPDATE "subcategories" SET "position" = CASE "id"
        WHEN 63 THEN 1  -- Ангіографи
        WHEN 65 THEN 2  -- Денситометри
        WHEN 60 THEN 3  -- КТ
        WHEN 61 THEN 4  -- МРТ
        WHEN 66 THEN 5  -- Мамографи
        WHEN 62 THEN 6  -- Рентген
        WHEN 64 THEN 7  -- Флюрографи
        ELSE 10000
      END
      WHERE "categoryid" = 12;
    `);

    // 14: Лазери медичні
    await queryRunner.query(`
      UPDATE "subcategories" SET "position" = CASE "id"
        WHEN 67 THEN 1  -- Лазери
        ELSE 10000
      END
      WHERE "categoryid" = 14;
    `);

    // 16: Стоматологія
    await queryRunner.query(`
      UPDATE "subcategories" SET "position" = CASE "id"
        WHEN 71 THEN 1  -- Візіографи
        WHEN 72 THEN 2  -- Дентальні рентгени
        WHEN 69 THEN 3  -- Компресори та аспіратори
        WHEN 70 THEN 4  -- Стерилізація
        WHEN 73 THEN 5  -- Стоматологічні лазери
        WHEN 68 THEN 6  -- Стоматологічні установки
        ELSE 10000
      END
      WHERE "categoryid" = 16;
    `);

    // 17: Косметологія та дерматологія
    await queryRunner.query(`
      UPDATE "subcategories" SET "position" = CASE "id"
        WHEN 74 THEN 1  -- Дерматологія
        WHEN 75 THEN 2  -- Косметологія
        ELSE 10000
      END
      WHERE "categoryid" = 17;
    `);

    // Generic keywords from the name (only if empty)
    await queryRunner.query(`
      UPDATE "categories" c
      SET "keywords" = (
        SELECT string_agg(k, E'\\n')
        FROM (
               SELECT lower(c."name")                             AS k UNION ALL
               SELECT 'купити ' || lower(c."name")               UNION ALL
               SELECT lower(c."name") || ' купити'               UNION ALL
               SELECT 'ціна ' || lower(c."name")                 UNION ALL
               SELECT lower(c."name") || ' ціна'                 UNION ALL
               SELECT 'вартість ' || lower(c."name")             UNION ALL
               SELECT lower(c."name") || ' вартість'             UNION ALL
               SELECT lower(c."name") || ' обладнання'           UNION ALL
               SELECT 'обладнання ' || lower(c."name")
             ) q
      )
      WHERE (c."keywords" IS NULL OR c."keywords" = '');
    `);

    await queryRunner.query(`
      UPDATE "subcategories" s
      SET "keywords" = (
        SELECT string_agg(k, E'\\n')
        FROM (
          SELECT lower(s."name")                             AS k UNION ALL
          SELECT 'купити ' || lower(s."name")               UNION ALL
          SELECT lower(s."name") || ' купити'               UNION ALL
          SELECT 'ціна ' || lower(s."name")                 UNION ALL
          SELECT lower(s."name") || ' ціна'                 UNION ALL
          SELECT 'вартість ' || lower(s."name")             UNION ALL
          SELECT lower(s."name") || ' вартість'             UNION ALL
          SELECT lower(s."name") || ' обладнання'           UNION ALL
          SELECT 'обладнання ' || lower(s."name")
        ) q
      )
      WHERE (s."keywords" IS NULL OR s."keywords" = '');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "subcategories"
        DROP COLUMN IF EXISTS "keywords",
        DROP COLUMN IF EXISTS "position",
        DROP COLUMN IF EXISTS "heading",
        DROP COLUMN IF EXISTS "description",
        DROP COLUMN IF EXISTS "title";
    `);

    await queryRunner.query(`
      ALTER TABLE "categories"
        DROP COLUMN IF EXISTS "keywords",
        DROP COLUMN IF EXISTS "position",
        DROP COLUMN IF EXISTS "heading",
        DROP COLUMN IF EXISTS "description",
        DROP COLUMN IF EXISTS "title";
    `);
  }
}
