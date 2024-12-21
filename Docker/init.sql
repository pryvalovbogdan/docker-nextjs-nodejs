-- Table: products
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

-- Table: clients
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    phone BIGINT NOT NULL,
    date DATE NOT NULL,
    product_id INT, -- Related to products table
    status VARCHAR(50) NOT NULL DEFAULT 'active',
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


-- Modify the admins table to add admin_ip
CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL, -- To store hashed password
    role VARCHAR(50) DEFAULT 'admin', -- Default to 'admin', can be 'user' as well
    admin_ip VARCHAR(255) DEFAULT NULL, -- Store the allowed IP address for the admin
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- Insert sample data into products
INSERT INTO products (title, description, images, manufacture, country, category, price)
VALUES
    ('Laptop Pro', 'High-end laptop for professionals', ARRAY['image1.jpg', 'image2.jpg'], 'TechCorp', 'USA', 'Electronics', 1999.99),
    ('Smartphone X', 'Latest smartphone with advanced features', ARRAY['phone1.jpg', 'phone2.jpg'], 'PhoneInc', 'China', 'Mobile Devices', 999.99),
    ('Headphones Max', 'Noise-cancelling over-ear headphones', ARRAY['headphone1.jpg'], 'AudioTech', 'Germany', 'Accessories', 299.99);

-- Insert sample data into clients
INSERT INTO orders (first_name, last_name, phone, date, product_id, status)
VALUES
    ('John', 'Doe', 1234567890, '2024-01-01', 1, 'completed'),
    ('Jane', 'Smith', 9876543210, '2024-02-15', 2, 'pending'),
    ('Alice', 'Johnson', 1122334455, '2024-03-01', 3, 'active');

-- Insert sample data into news
INSERT INTO news (title, description, images, date)
VALUES
    ('New Product Launch', 'We are excited to announce our new product!', ARRAY['news1.jpg'], '2024-03-01'),
    ('Company Milestone', 'Our company reached 1M customers!', ARRAY['news2.jpg', 'news3.jpg'], '2024-03-15');

-- Insert a sample admin user with IP restriction
INSERT INTO admins (username, password_hash, role, admin_ip)
VALUES
    ('adminuser', 'hashedpasswordhere', 'admin', '192.168.0.1'); -- Replace '192.168.0.1' with the allowed admin IP

