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
          categoryId INT NOT NULL,
          subcategoryId INT NOT NULL,
          CONSTRAINT fk_category FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE CASCADE,
          CONSTRAINT fk_subcategory FOREIGN KEY (subcategoryId) REFERENCES subcategories(id) ON DELETE CASCADE
      );

      -- Create orders table with product relationship
      CREATE TABLE IF NOT EXISTS orders (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          phone BIGINT NOT NULL,
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

      -- Insert categories and return IDs
      INSERT INTO categories (name) VALUES 
          ('Ендоскопічне обладнання'),
          ('Комп''ютерна томографія'),
          ('Біохімічні аналізатори')
      RETURNING id, name;

      -- Insert subcategories linked to categories
      INSERT INTO subcategories (name, categoryId) VALUES 
          ('Гастроскопія', (SELECT id FROM categories WHERE name = 'Ендоскопічне обладнання')),
          ('Рентгенологія', (SELECT id FROM categories WHERE name = 'Комп''ютерна томографія')),
          ('Лабораторне обладнання', (SELECT id FROM categories WHERE name = 'Біохімічні аналізатори'));

      -- Insert sample products with category and subcategory references
      INSERT INTO products (title, description, images, brand, country, price, characteristics, categoryId, subcategoryId)
      VALUES
          ('Відеогастроскоп EVIS EXERA III GIF-H185 OLYMPUS', 
              'Маневрений відеогастроскоп GIF-H185 з високоякісною HDTV-візуалізацією...',
              ARRAY['https://d2vh67xigqba1o.cloudfront.net/0de8e1ce33c84614b64a00958b6d651f7b7a481f0b85fccf142cd21d35ced4f9'], 
              'OLYMPUS', 'Японія', NULL,
              'Переваги: Dual Focus, Close Focus, NBI, HDTV; ...',
              (SELECT id FROM categories WHERE name = 'Ендоскопічне обладнання'),
              (SELECT id FROM subcategories WHERE name = 'Гастроскопія')),

          ('Комп''ютерний томограф Aquilion Start 32 зрізи Canon Medical Systems', 
              'Aquilion Start - високоякісна КТ-система...',
              ARRAY['https://d2vh67xigqba1o.cloudfront.net/a64a654901556493859406778ac4a0dfe660926a56bc5dfafbee5c7e5751a192'], 
              'Canon', 'Японія', NULL,
              'Час обертання: 1,0 сек, 1,5 сек, 0,75 сек; ...',
              (SELECT id FROM categories WHERE name = 'Комп''ютерна томографія'),
              (SELECT id FROM subcategories WHERE name = 'Рентгенологія')),

          ('Автоматичний біохімічний аналізатор BA-400 з ISE модулем', 
              'Біохімічний аналізатор BA-400 для турбидиметричних і біохімічних досліджень...',
              ARRAY['https://d2vh67xigqba1o.cloudfront.net/74f3db5355cd3d51f57dad9ec609b460c29e4715291d4bee4320db0e4b509b1d'], 
              'BioSystems', 'Іспанія', NULL,
              'Пропускна спроможність: 400 тестів/год або 640 тестів...',
              (SELECT id FROM categories WHERE name = 'Біохімічні аналізатори'),
              (SELECT id FROM subcategories WHERE name = 'Лабораторне обладнання'));

      -- Insert sample orders
      INSERT INTO orders (name, phone, email, date, productId, status)
      VALUES
          ('John Doe', 1234567890, 'johndoe@example.com', '2024-01-01', 
              (SELECT id FROM products WHERE title = 'Відеогастроскоп EVIS EXERA III GIF-H185 OLYMPUS'), 'completed'),
          ('Jane Smith', 9876543210, 'janesmith@example.com', '2024-02-15', 
              (SELECT id FROM products WHERE title = 'Комп''ютерний томограф Aquilion Start 32 зрізи Canon Medical Systems'), 'pending'),
          ('Alice Johnson', 1122334455, 'alicej@example.com', '2024-03-01', 
              (SELECT id FROM products WHERE title = 'Автоматичний біохімічний аналізатор BA-400 з ISE модулем'), 'active');

      -- Insert sample news
      INSERT INTO news (title, description, images, date)
      VALUES
          ('New Product Launch', 'We are excited to announce our new product!', ARRAY['news1.jpg'], '2024-03-01'),
          ('Company Milestone', 'Our company reached 1M customers!', ARRAY['news2.jpg', 'news3.jpg'], '2024-03-15');
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
