-- ============================================================================
-- E-COMMERCE ADMIN DATABASE SCHEMA
-- PostgreSQL Database Setup
-- ============================================================================

-- Drop existing tables if they exist (for clean reinstall)
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;

-- ============================================================================
-- PRODUCTS TABLE
-- Stores all product information
-- ============================================================================
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    category VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add index for faster searches
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_status ON products(status);

-- ============================================================================
-- ORDERS TABLE
-- Stores customer orders
-- ============================================================================
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer VARCHAR(255) NOT NULL,
    items INTEGER NOT NULL CHECK (items > 0),
    total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
    status VARCHAR(50) DEFAULT 'pending',
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add index for faster filtering by status
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_date ON orders(date);

-- ============================================================================
-- INSERT SAMPLE DATA
-- Initial products for testing
-- ============================================================================
INSERT INTO products (name, price, stock, category, status) VALUES
('Wireless Headphones', 79.99, 45, 'Electronics', 'active'),
('Smart Watch', 199.99, 23, 'Electronics', 'active'),
('Laptop Bag', 49.99, 67, 'Accessories', 'active'),
('USB-C Cable', 12.99, 156, 'Accessories', 'active'),
('Bluetooth Speaker', 89.99, 8, 'Electronics', 'low-stock'),
('Phone Case', 19.99, 234, 'Accessories', 'active'),
('Wireless Mouse', 34.99, 89, 'Electronics', 'active'),
('Keyboard', 79.99, 12, 'Electronics', 'low-stock'),
('Monitor Stand', 45.99, 34, 'Accessories', 'active'),
('Webcam', 99.99, 56, 'Electronics', 'active');

-- ============================================================================
-- INSERT SAMPLE ORDERS
-- Initial orders for testing
-- ============================================================================
INSERT INTO orders (customer, items, total, status, date) VALUES
('John Doe', 3, 249.97, 'pending', '2024-12-21'),
('Jane Smith', 1, 79.99, 'shipped', '2024-12-20'),
('Bob Johnson', 2, 289.98, 'delivered', '2024-12-19'),
('Alice Brown', 5, 425.95, 'pending', '2024-12-21'),
('Charlie Wilson', 1, 199.99, 'shipped', '2024-12-20'),
('Diana Prince', 4, 189.96, 'delivered', '2024-12-18'),
('Edward Norton', 2, 159.98, 'pending', '2024-12-21'),
('Fiona Apple', 1, 89.99, 'delivered', '2024-12-17');

-- ============================================================================
-- VERIFY DATA WAS INSERTED
-- ============================================================================
-- Check products
SELECT COUNT(*) as total_products FROM products;

-- Check orders
SELECT COUNT(*) as total_orders FROM orders;

-- Show sample data
SELECT 'Products:' as info;
SELECT id, name, price, stock, category, status FROM products LIMIT 5;

SELECT 'Orders:' as info;
SELECT id, customer, total, status, date FROM orders LIMIT 5;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================
SELECT ' Database schema created successfully!' as message;
SELECT ' Sample data loaded!' as message;
SELECT ' Ready to connect backend!' as message;