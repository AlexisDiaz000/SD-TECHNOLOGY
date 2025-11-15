-- SD Technology Database Schema

-- Table: products (for Stock management)
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    amount INTEGER NOT NULL DEFAULT 0,
    price DECIMAL(10, 2) NOT NULL,
    min_stock INTEGER NOT NULL DEFAULT 0,
    supplier VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: sales
CREATE TABLE IF NOT EXISTS sales (
    id VARCHAR(36) PRIMARY KEY,
    product VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    ticket_number VARCHAR(50) UNIQUE NOT NULL,
    client VARCHAR(255) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    tax DECIMAL(10, 2) NOT NULL,
    warranty VARCHAR(255),
    sale_date VARCHAR(20) NOT NULL,
    sale_time VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: promotions
CREATE TABLE IF NOT EXISTS promotions (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    discount INTEGER NOT NULL,
    active BOOLEAN DEFAULT true,
    start_date VARCHAR(20) NOT NULL,
    end_date VARCHAR(20) NOT NULL,
    description TEXT,
    applicable_categories VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: reports
CREATE TABLE IF NOT EXISTS reports (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    report_date VARCHAR(20) NOT NULL,
    status VARCHAR(50) NOT NULL,
    description TEXT,
    period VARCHAR(100),
    total_sales INTEGER,
    revenue DECIMAL(10, 2),
    total_products INTEGER,
    low_stock_items INTEGER,
    active_promos INTEGER,
    total_discount DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_amount ON products(amount);
CREATE INDEX idx_sales_date ON sales(sale_date);
CREATE INDEX idx_sales_ticket ON sales(ticket_number);
CREATE INDEX idx_promotions_active ON promotions(active);
CREATE INDEX idx_reports_type ON reports(type);

-- Insert sample data for products
INSERT INTO products (id, name, category, amount, price, min_stock, supplier) VALUES
    ('prod-001', 'Laptop HP Pavilion 15', 'Laptops', 5, 550.00, 3, 'HP Inc.'),
    ('prod-002', 'Monitor Dell 24" 4K', 'Monitores', 2, 349.00, 5, 'Dell Technologies'),
    ('prod-003', 'Teclado Mecánico Logitech', 'Periféricos', 15, 200.00, 10, 'Logitech'),
    ('prod-004', 'Mouse Inalámbrico Razer', 'Periféricos', 29, 89.00, 15, 'Razer Inc.')
ON CONFLICT (id) DO NOTHING;

-- Insert sample data for sales
INSERT INTO sales (id, product, quantity, price, total, ticket_number, client, payment_method, subtotal, tax, warranty, sale_date, sale_time) VALUES
    ('sale-001', 'Laptop HP Pavilion 15', 3, 550.00, 1650.00, 'TICKET-2345-001', 'Juan Pérez DMI: 12345678901', 'Tarjeta Visa', 1652.87, 103.31, '12 Meses (Válido Hasta 29/01/2026)', '29/01/25', '8:00'),
    ('sale-002', 'Monitor Dell 24" 4K', 1, 349.00, 349.00, 'TICKET-2345-002', 'María García DMI: 98765432109', 'Efectivo', 349.00, 21.81, '6 Meses (Válido Hasta 29/07/2025)', '29/01/25', '11:00'),
    ('sale-003', 'Teclado Mecánico Logitech', 15, 200.00, 3000.00, 'TICKET-2345-003', 'Carlos Rodríguez DMI: 45678901234', 'Transferencia', 3000.00, 187.50, '24 Meses (Válido Hasta 29/01/2027)', '29/01/25', '14:25'),
    ('sale-004', 'Mouse Inalámbrico Razer', 8, 89.00, 712.00, 'TICKET-2345-004', 'Ana Martínez DMI: 65432109876', 'Tarjeta Mastercard', 712.00, 44.50, '12 Meses (Válido Hasta 29/01/2026)', '29/01/25', '15:40')
ON CONFLICT (id) DO NOTHING;

-- Insert sample data for promotions
INSERT INTO promotions (id, name, discount, active, start_date, end_date, description, applicable_categories) VALUES
    ('promo-001', 'Summer Sale', 20, true, '01/02/25', '15/02/25', 'Descuento especial de verano en productos seleccionados', 'Laptops, Monitores'),
    ('promo-002', 'Black Friday', 35, true, '15/02/25', '28/02/25', 'Gran descuento en todos los productos', 'Todos'),
    ('promo-003', 'Clearance', 50, false, '01/03/25', '10/03/25', 'Liquidación de productos de temporada anterior', 'Periféricos')
ON CONFLICT (id) DO NOTHING;

-- Insert sample data for reports
INSERT INTO reports (id, title, type, report_date, status, description, period, total_sales, revenue, total_products, low_stock_items, active_promos, total_discount) VALUES
    ('report-001', 'Reporte de Ventas Mensual', 'Ventas', '29/01/25', 'Completado', 'Resumen de todas las ventas realizadas en enero 2025', '01/01/25 - 29/01/25', 45, 15420.50, NULL, NULL, NULL, NULL),
    ('report-002', 'Análisis de Inventario', 'Stock', '28/01/25', 'Completado', 'Estado actual del inventario y productos con stock bajo', 'Actual', NULL, NULL, 156, 12, NULL, NULL),
    ('report-003', 'Rendimiento de Promociones', 'Promo', '27/01/25', 'Pendiente', 'Efectividad de las promociones activas', '15/01/25 - 27/01/25', NULL, NULL, NULL, NULL, 8, 2850.00),
    ('report-004', 'Resumen Trimestral', 'General', '25/01/25', 'Completado', 'Resumen general de operaciones del trimestre', 'Q1 2025', 567, 189450.75, NULL, NULL, NULL, NULL)
ON CONFLICT (id) DO NOTHING;
