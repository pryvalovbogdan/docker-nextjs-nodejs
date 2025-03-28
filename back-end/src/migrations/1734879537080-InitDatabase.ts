import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDatabase1734879537080 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      -- Create categories table
      CREATE TABLE IF NOT EXISTS categories (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL UNIQUE
      );

      -- Create subcategories table with category relationship
      CREATE TABLE IF NOT EXISTS subcategories (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL UNIQUE,
          categoryId INT NOT NULL,
          CONSTRAINT fk_category FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE CASCADE
      );

      -- Create products table with category and subcategory relationships
      CREATE TABLE IF NOT EXISTS products (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          characteristics TEXT,
          images TEXT[],
          brand VARCHAR(255),
          country VARCHAR(255),
          price DECIMAL(10, 2) DEFAULT NULL,
          categoryId INT NULL,
          subcategoryId INT NULL,
          CONSTRAINT fk_category FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE CASCADE,
          CONSTRAINT fk_subcategory FOREIGN KEY (subcategoryId) REFERENCES subcategories(id) ON DELETE CASCADE
      );

      -- Create orders table with product relationship
      CREATE TABLE IF NOT EXISTS orders (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          phone VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          date DATE NOT NULL,
          status VARCHAR(50) NOT NULL DEFAULT 'active',
          productId INT,
          CONSTRAINT fk_product FOREIGN KEY (productId) REFERENCES products(id) ON DELETE SET NULL
      );

      -- Create news table
      CREATE TABLE IF NOT EXISTS news (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          images TEXT[],
          date DATE NOT NULL
      );

      -- Create admins table
      CREATE TABLE IF NOT EXISTS admins (
          id SERIAL PRIMARY KEY,
          username VARCHAR(255) NOT NULL UNIQUE,
          passwordHash TEXT NOT NULL,
          role VARCHAR(50) DEFAULT 'admin',
          adminIps TEXT[] NOT NULL,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Insert categories
      INSERT INTO categories (name) VALUES 
        ('Хірургія'),
        ('Кардіологія'),
        ('Реанімація'),
        ('Меблі для медичних закладів'),
        ('Фізіотерапевтичне та реабілітаційне обладнання'),
        ('Офтальмологія'),
        ('Обладнання для неонатології, акушерства, гінекології'),
        ('Кисневе обладнання'),
        ('Стерилізація'),
        ('Лабораторне обладнання'),
        ('Ендоскопічне обладнання'),
        ('Радіологія'),
        ('УЗД'),
        ('Лазери медичні'),
        ('ЛОР'),
        ('Стоматологія'),
        ('Косметологія та дерматологія');

      -- Insert subcategories
      INSERT INTO subcategories (name, categoryId) VALUES
        ('Операційні столи', (SELECT id FROM categories WHERE name = 'Хірургія')),
        ('Операційні світильник', (SELECT id FROM categories WHERE name = 'Хірургія')),
        ('Відсмоктувачі хірургічні', (SELECT id FROM categories WHERE name = 'Хірургія')),
        ('Інфузійне обладнання', (SELECT id FROM categories WHERE name = 'Хірургія')),
        ('Операційні мікроскопи', (SELECT id FROM categories WHERE name = 'Хірургія')),
        ('Електрохірургія', (SELECT id FROM categories WHERE name = 'Хірургія')),
        ('Нейрохірургія', (SELECT id FROM categories WHERE name = 'Хірургія')),
        ('Хірургічні інструменти', (SELECT id FROM categories WHERE name = 'Хірургія')),
        ('Набори інструментів', (SELECT id FROM categories WHERE name = 'Хірургія')),

        ('Електрокардіографи', (SELECT id FROM categories WHERE name = 'Кардіологія')),
        ('Монітори пацієнтів', (SELECT id FROM categories WHERE name = 'Кардіологія')),
        ('Холтери ЕКГ та АТ', (SELECT id FROM categories WHERE name = 'Кардіологія')),
        ('Зовнішні кардиостимулятори', (SELECT id FROM categories WHERE name = 'Кардіологія')),
        ('Пояси для ЕКГ', (SELECT id FROM categories WHERE name = 'Кардіологія')),

        ('Апарати штучної вентиляції легенів', (SELECT id FROM categories WHERE name = 'Реанімація')),
        ('Апарати наркозно-дихальні', (SELECT id FROM categories WHERE name = 'Реанімація')),
        ('Дефибрилятори', (SELECT id FROM categories WHERE name = 'Реанімація')),
        ('Кисневі концентатори', (SELECT id FROM categories WHERE name = 'Реанімація')),
        ('Ларингоскоп', (SELECT id FROM categories WHERE name = 'Реанімація')),

        ('Ліжка медичні', (SELECT id FROM categories WHERE name = 'Меблі для медичних закладів')),
        ('Столики медичного призначення', (SELECT id FROM categories WHERE name = 'Меблі для медичних закладів')),
        ('Штативи', (SELECT id FROM categories WHERE name = 'Меблі для медичних закладів')),
        ('Стійки медичні', (SELECT id FROM categories WHERE name = 'Меблі для медичних закладів')),
        ('Ширми', (SELECT id FROM categories WHERE name = 'Меблі для медичних закладів')),
        ('Шафи медичні', (SELECT id FROM categories WHERE name = 'Меблі для медичних закладів')),
        ('Кушетки та столи масажні', (SELECT id FROM categories WHERE name = 'Меблі для медичних закладів')),
        ('Візки медичні та візки для перевезення хворих', (SELECT id FROM categories WHERE name = 'Меблі для медичних закладів')),
        ('Стільці медичні', (SELECT id FROM categories WHERE name = 'Меблі для медичних закладів')),
        ('Крісла медичні', (SELECT id FROM categories WHERE name = 'Меблі для медичних закладів')),
        ('Тумби медичні', (SELECT id FROM categories WHERE name = 'Меблі для медичних закладів')),

        ('Ультразвукова терапія', (SELECT id FROM categories WHERE name = 'Фізіотерапевтичне та реабілітаційне обладнання')),
        ('Терапія', (SELECT id FROM categories WHERE name = 'Фізіотерапевтичне та реабілітаційне обладнання')),
        ('Електротерапія', (SELECT id FROM categories WHERE name = 'Фізіотерапевтичне та реабілітаційне обладнання')),
        ('Опромінювачі фізіотерапевтичні', (SELECT id FROM categories WHERE name = 'Фізіотерапевтичне та реабілітаційне обладнання')),
        ('Комбінована терапія', (SELECT id FROM categories WHERE name = 'Фізіотерапевтичне та реабілітаційне обладнання')),
        ('Лазерна терапія', (SELECT id FROM categories WHERE name = 'Фізіотерапевтичне та реабілітаційне обладнання')),
        ('Реабілітаційне обладнання', (SELECT id FROM categories WHERE name = 'Фізіотерапевтичне та реабілітаційне обладнання')),

        ('Офтальмологічні мікроскопи', (SELECT id FROM categories WHERE name = 'Офтальмологія')),
        ('Щилинні лампи', (SELECT id FROM categories WHERE name = 'Офтальмологія')),
        ('Офтальмологічні операційні столи', (SELECT id FROM categories WHERE name = 'Офтальмологія')),
        ('Офтальмоскопи', (SELECT id FROM categories WHERE name = 'Офтальмологія')),
        ('Діагностика', (SELECT id FROM categories WHERE name = 'Офтальмологія')),

        ('Фетальні монітори та доплери', (SELECT id FROM categories WHERE name = 'Обладнання для неонатології, акушерства, гінекології')),
        ('Гінекологічні крісла-столи', (SELECT id FROM categories WHERE name = 'Обладнання для неонатології, акушерства, гінекології')),
        ('Інкубатори для новонароджених', (SELECT id FROM categories WHERE name = 'Обладнання для неонатології, акушерства, гінекології')),
        ('Меблі для неонталогії', (SELECT id FROM categories WHERE name = 'Обладнання для неонатології, акушерства, гінекології')),
        ('Ліжка акушерські', (SELECT id FROM categories WHERE name = 'Обладнання для неонатології, акушерства, гінекології')),
        ('Кольпоскопи', (SELECT id FROM categories WHERE name = 'Обладнання для неонатології, акушерства, гінекології')),
        ('Білірубінометри', (SELECT id FROM categories WHERE name = 'Обладнання для неонатології, акушерства, гінекології')),
        ('Обладнання для фототерапії', (SELECT id FROM categories WHERE name = 'Обладнання для неонатології, акушерства, гінекології')),

        ('Реанімація', (SELECT id FROM categories WHERE name = 'Кисневе обладнання')),
        
        ('Стерилізатори медичні', (SELECT id FROM categories WHERE name = 'Стерилізація')),
        ('Сухожарові шафи', (SELECT id FROM categories WHERE name = 'Стерилізація')),
        ('Аквадистилятори', (SELECT id FROM categories WHERE name = 'Стерилізація')),
        ('Мийні машини', (SELECT id FROM categories WHERE name = 'Стерилізація')),
        
        ('Жорстка ендоскопія', (SELECT id FROM categories WHERE name = 'Ендоскопічне обладнання')),
        ('Гнучка ендоскопія', (SELECT id FROM categories WHERE name = 'Ендоскопічне обладнання')),
        ('Додаткове обладнання для ендоскопії', (SELECT id FROM categories WHERE name = 'Ендоскопічне обладнання')),

        ('Біохімія', (SELECT id FROM categories WHERE name = 'Лабораторне обладнання')),
        ('Гематологія', (SELECT id FROM categories WHERE name = 'Лабораторне обладнання')),
        ('Аналіз електролітів та газів крові', (SELECT id FROM categories WHERE name = 'Лабораторне обладнання')),
        ('Імуноферментний Аналіз', (SELECT id FROM categories WHERE name = 'Лабораторне обладнання')),
        ('Росхідні матеріали та допоміжні матеріали для лабораторії', (SELECT id FROM categories WHERE name = 'Лабораторне обладнання')),

        ('КТ', (SELECT id FROM categories WHERE name = 'Радіологія')),
        ('МРТ', (SELECT id FROM categories WHERE name = 'Радіологія')),
        ('Рентген апарати стаціонарні та пересувні', (SELECT id FROM categories WHERE name = 'Радіологія')),
        ('Ангіографи', (SELECT id FROM categories WHERE name = 'Радіологія')),
        ('Флюрографи', (SELECT id FROM categories WHERE name = 'Радіологія')),
        ('Денсинометри', (SELECT id FROM categories WHERE name = 'Радіологія')),
        ('Мамографи', (SELECT id FROM categories WHERE name = 'Радіологія')),
        
        ('Лазери', (SELECT id FROM categories WHERE name = 'Лазери медичні')),

        ('Стоматологічні установки', (SELECT id FROM categories WHERE name = 'Стоматологія')),
        ('Стоматологічні комперсори', (SELECT id FROM categories WHERE name = 'Стоматологія')),
        ('Стоматологічні меблі', (SELECT id FROM categories WHERE name = 'Стоматологія')),
        ('Коагулятори стоматологічні', (SELECT id FROM categories WHERE name = 'Стоматологія')),
        
        ('Дерматологія', (SELECT id FROM categories WHERE name = 'Косметологія та дерматологія')),
        ('Косметологія', (SELECT id FROM categories WHERE name = 'Косметологія та дерматологія'));
        
      -- Insert sample orders
      INSERT INTO orders (name, phone, email, date, productId, status)
      VALUES
          ('John Doe', 1234567890, 'johndoe@example.com', '2024-01-01', 
              (SELECT id FROM products WHERE title = 'Відеогастроскоп EVIS EXERA III GIF-H185 OLYMPUS'), 'completed'),
          ('Jane Smith', 9876543210, 'janesmith@example.com', '2024-02-15', 
              (SELECT id FROM products WHERE title = 'Комп''ютерний томограф Aquilion Start 32 зрізи Canon Medical Systems'), 'pending'),
          ('Alice Johnson', 1122334455, 'alicej@example.com', '2024-03-01', 
              (SELECT id FROM products WHERE title = 'Автоматичний біохімічний аналізатор BA-400 з ISE модулем'), 'active');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS orders;
      DROP TABLE IF EXISTS products;
      DROP TABLE IF EXISTS subcategories;
      DROP TABLE IF EXISTS categories;
      DROP TABLE IF EXISTS news;
      DROP TABLE IF EXISTS admins;
    `);
  }
}
