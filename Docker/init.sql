-- Table: products
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    images TEXT[], -- Array of strings to store image URLs
    manufacture VARCHAR(255),
    country VARCHAR(255),
    category VARCHAR(255)
    );

-- Table: clients
CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone BIGINT NOT NULL,
    date DATE NOT NULL,
    product_id INT, -- Related to products table
    CONSTRAINT fk_product
    FOREIGN KEY (product_id) REFERENCES products (id)
    ON DELETE SET NULL
    );

-- Table: news
CREATE TABLE IF NOT EXISTS news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    images TEXT[], -- Array of strings for image URLs
    date DATE NOT NULL
    );

-- Insert sample data into products
INSERT INTO products (title, description, images, manufacture, country, category)
VALUES
    ('Laptop Pro', 'High-end laptop for professionals', ARRAY['image1.jpg', 'image2.jpg'], 'TechCorp', 'USA', 'Electronics'),
    ('Smartphone X', 'Latest smartphone with advanced features', ARRAY['phone1.jpg', 'phone2.jpg'], 'PhoneInc', 'China', 'Mobile Devices'),
    ('Headphones Max', 'Noise-cancelling over-ear headphones', ARRAY['headphone1.jpg'], 'AudioTech', 'Germany', 'Accessories');

-- Insert sample data into clients
INSERT INTO clients (name, phone, date, product_id)
VALUES
    ('John Doe', 1234567890, '2024-01-01', 1),
    ('Jane Smith', 9876543210, '2024-02-15', 2),
    ('Alice Johnson', 1122334455, '2024-03-01', 3);

-- Insert sample data into news
INSERT INTO news (title, description, images, date)
VALUES
    ('New Product Launch', 'We are excited to announce our new product!', ARRAY['news1.jpg'], '2024-03-01'),
    ('Company Milestone', 'Our company reached 1M customers!', ARRAY['news2.jpg', 'news3.jpg'], '2024-03-15');