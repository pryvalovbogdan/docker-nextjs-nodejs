import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSubCategoryColumn1739310927521 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      -- Drop all existing tables
      DROP TABLE IF EXISTS orders;
      DROP TABLE IF EXISTS products;
      DROP TABLE IF EXISTS news;
      DROP TABLE IF EXISTS admins;

      -- Recreate the products table with the new column
      CREATE TABLE IF NOT EXISTS products (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          images TEXT[], -- Array of strings to store image URLs
          brand VARCHAR(255),
          country VARCHAR(255),
          category VARCHAR(255),
          subCategory VARCHAR(255), -- New column added
          price DECIMAL(10, 2) DEFAULT NULL,
          characteristics TEXT
      );

      -- Recreate the orders table
      CREATE TABLE IF NOT EXISTS orders (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          phone BIGINT NOT NULL,
          email VARCHAR(255) NOT NULL,
          date DATE NOT NULL,
          productId INT, -- Related to products table
          status VARCHAR(50) NOT NULL DEFAULT 'active',
          CONSTRAINT fk_product
          FOREIGN KEY (productId) REFERENCES products (id)
          ON DELETE SET NULL
      );

      -- Recreate the news table
      CREATE TABLE IF NOT EXISTS news (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          images TEXT[],
          date DATE NOT NULL
      );

      -- Recreate the admins table
      CREATE TABLE IF NOT EXISTS admins (
          id SERIAL PRIMARY KEY,
          username VARCHAR(255) NOT NULL UNIQUE,
          passwordHash TEXT NOT NULL, -- To store hashed password
          role VARCHAR(50) DEFAULT 'admin', -- Default to 'admin', can be 'user' as well
          adminIps TEXT[] NOT NULL,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
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
