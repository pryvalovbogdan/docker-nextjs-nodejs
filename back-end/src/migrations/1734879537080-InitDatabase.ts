import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDatabase1734879537080 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      -- Create products table
      CREATE TABLE IF NOT EXISTS products (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          images TEXT[], -- Array of strings to store image URLs
          manufacture VARCHAR(255),
          country VARCHAR(255),
          category VARCHAR(255),
          price DECIMAL(10, 2) DEFAULT NULL
      );

      -- Create orders table
      CREATE TABLE IF NOT EXISTS orders (
          id SERIAL PRIMARY KEY,
          firstName VARCHAR(255) NOT NULL,
          lastName VARCHAR(255) NOT NULL,
          phone BIGINT NOT NULL,
          date DATE NOT NULL,
          productId INT, -- Related to products table
          status VARCHAR(50) NOT NULL DEFAULT 'active',
          CONSTRAINT fk_product
          FOREIGN KEY (productId) REFERENCES products (id)
          ON DELETE SET NULL
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
          passwordHash TEXT NOT NULL, -- To store hashed password
          role VARCHAR(50) DEFAULT 'admin', -- Default to 'admin', can be 'user' as well
          adminIp VARCHAR(255) NOT NULL,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Insert sample data into products
      INSERT INTO products (title, description, images, manufacture, country, category, price)
      VALUES
          ('Laptop Pro', 'High-end laptop for professionals', ARRAY['image1.jpg', 'image2.jpg'], 'TechCorp', 'USA', 'Electronics', 1999.99),
          ('Smartphone X', 'Latest smartphone with advanced features', ARRAY['phone1.jpg', 'phone2.jpg'], 'PhoneInc', 'China', 'Mobile Devices', 999.99),
          ('Headphones Max', 'Noise-cancelling over-ear headphones', ARRAY['headphone1.jpg'], 'AudioTech', 'Germany', 'Accessories', 299.99);

      -- Insert sample data into orders
      INSERT INTO orders (firstName, lastName, phone, date, productId, status)
      VALUES
          ('John', 'Doe', 1234567890, '2024-01-01', 1, 'completed'),
          ('Jane', 'Smith', 9876543210, '2024-02-15', 2, 'pending'),
          ('Alice', 'Johnson', 1122334455, '2024-03-01', 3, 'active');

      -- Insert sample data into news
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
      DROP TABLE IF EXISTS news;
      DROP TABLE IF EXISTS admins;
    `);
  }
}
