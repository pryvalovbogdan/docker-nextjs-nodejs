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
          brand VARCHAR(255),
          country VARCHAR(255),
          category VARCHAR(255),
          price DECIMAL(10, 2) DEFAULT NULL,
          characteristics TEXT
      );

      -- Create orders table
      CREATE TABLE IF NOT EXISTS orders (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
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
      INSERT INTO products (title, description, images, brand, country, category, price, characteristics)
      VALUES
          ('Відеогастроскоп EVIS EXERA III GIF-H185 OLYMPUS', 
              'Маневрений відеогастроскоп GIF-H185 від надійного японського виробника OLYMPUS з високоякісної HDTV-візуалізацією дозволяє отримати чіткі і деталізовані зображення слизової під час дослідження верхніх відділів шлунково-кишкового тракту. Володіє широким інструментальним каналом 2,8 мм і технологією узкоспектральной візуалізації NBI.',
              ARRAY['https://d2vh67xigqba1o.cloudfront.net/0de8e1ce33c84614b64a00958b6d651f7b7a481f0b85fccf142cd21d35ced4f9'], 
              'OLYMPUS', 'Японія', 'Ендоскопічне обладнання', NULL,
              'Переваги: Dual Focus, Close Focus, NBI, HDTV; Кут поля зору: 140°; Напрямок огляду: Пряме; Глибина різкості: 2-100 мм; Зовнішній діаметр дистального кінця: 9,2 мм; Зовнішній діаметр вводиться трубки: 9,2 мм; Кути вигину: Вгору / вниз 210° / 90°, Право / ліво 100° / 100°; Робоча довжина: 1030 мм; Інструментальний канал: 2,8 мм; Мінімальна дистанція видимості: 3,0 мм від дистального кінця; Загальна довжина: 1350 мм'),
      
          ('Комп''ютерний томограф Aquilion Start 32 зрізи Canon Medical Systems', 
              'Aquilion Start - високоякісна КТ-система з функцією автоматичного зниження дози та зменшення кількості металевих артефактів, що допомагає вдосконалити роботу і робить її системою вибору для всіх повсякденних потреб візуалізації.',
              ARRAY['https://d2vh67xigqba1o.cloudfront.net/a64a654901556493859406778ac4a0dfe660926a56bc5dfafbee5c7e5751a192', 
                    'https://d2vh67xigqba1o.cloudfront.net/03e4d24e9854b1ea540397e725ae346269a5872cf581cc3baa979a6eb105e44e'], 
              'Canon', 'Японія', 'Комп''ютерна томографія', NULL,
              'Час обертання: 1,0 сек, 1,5 сек, 0,75 сек; Нахил Flex e-Tilt: 30°; Детектор Технологія PUREViSION; Потужність: 50 кВА; Кількість реконструйованих зрізів: 16/32; Максимальний діапазон сканування: 183 см; Установка: мінімум 9,8 v2; Швидкість реконструкції: до 15 кадрів в секунду; Ітеративна реконструкція: AIDR 3D Enhanced; Висота столу: 31,2 см; Розмір: 78 см; Вага: 220 кг'),
      
          ('Автоматичний біохімічний аналізатор BA-400 з ISE модулем', 
              'Біохімічний аналізатор BA-400 - це автоматичний аналізатор, який призначений для турбидиметричних і біохімічних досліджень з ISE-модулем. Даний апарат розроблений для забезпечення максимальної продуктивності при оптимальній оперативної вартості.',
              ARRAY['https://d2vh67xigqba1o.cloudfront.net/74f3db5355cd3d51f57dad9ec609b460c29e4715291d4bee4320db0e4b509b1d'], 
              'BioSystems', 'Іспанія', 'Біохімічні аналізатори', NULL,
              'Пропускна спроможність: 400 тестів/год або 640 тестів включаючи ISE для K+, Na+, Cl-, Li+ (опційно); Інноваційна довговічна та енергоекономічна технологія джерела світла на основі LED+HCF світлодіодів; Вбудовані довжини хвиль: 340, 405, 505, 535, 560, 600, 635, 670 нм; Мінімальний об’єм реакційної суміші від 180 мкл, дозволить зменшити витрати на реагенти; Програмований об’єм: зразка 2-40 мкл, крок 0,1 мкл, реагенту R1: 90-450 та R2: 10-300 мкл; Позицій для зразків - 135 (90 зі штрих-кодом); Позицій під реагенти - 88 з автономним охолодженням (5-8°C), що дозволить зберігати їх безпосередньо в аналізаторі; Реакційний ротор на 120 кювет з підтримкою температури 37°C, забезпечить стабільне проходження реакції; Потужна миюча станція з низьким споживанням води (лише 14 л/год) - дозволить багаторазово використовувати реакційні кювети; Інтуїтивно зрозумілий графічний інтерфейс.');

      -- Insert sample data into orders
      INSERT INTO orders (name, phone, date, productId, status)
      VALUES
          ('John Doe', 1234567890, '2024-01-01', 1, 'completed'),
          ('Jane Smith', 9876543210, '2024-02-15', 2, 'pending'),
          ('Alice Johnson', 1122334455, '2024-03-01', 3, 'active');

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
