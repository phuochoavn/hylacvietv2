-- Hỷ Lạc Việt Database Schema
-- SQLite with WAL mode for better concurrency

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    price INTEGER NOT NULL,
    images TEXT DEFAULT '[]',
    category TEXT DEFAULT 'ao-dai',
    status TEXT DEFAULT 'active',
    sort_order INTEGER DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT DEFAULT '',
    product_id TEXT,
    product_name TEXT DEFAULT '',
    measurements TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    status TEXT DEFAULT 'pending',
    created_at TEXT NOT NULL,
    updated_at TEXT,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    type TEXT DEFAULT 'string',
    updated_at TEXT NOT NULL
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    icon TEXT DEFAULT '📦',
    image TEXT DEFAULT '',
    description TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    last_login TEXT,
    created_at TEXT NOT NULL
);

-- Default settings
INSERT OR IGNORE INTO settings (key, value, type, updated_at) VALUES
    ('site_name', 'Hỷ Lạc Việt', 'string', datetime('now')),
    ('site_tagline', 'Áo Dài & Pháp Phục Cao Cấp', 'string', datetime('now')),
    ('phone', '0912 503 456', 'string', datetime('now')),
    ('email', 'contact@hylacviet.vn', 'string', datetime('now')),
    ('zalo', 'https://zalo.me/0912503456', 'string', datetime('now')),
    ('hero_title', 'Di sản ngàn năm, tay nghề thủ công', 'string', datetime('now')),
    ('hero_subtitle', 'Nơi nghệ thuật áo dài truyền thống hội tụ cùng tâm huyết của những nghệ nhân lành nghề', 'string', datetime('now')),
    ('hero_image', '/images/hero.jpg', 'string', datetime('now')),
    ('logo', '/images/logo.svg', 'string', datetime('now')),
    ('primary_color', '#c9a227', 'string', datetime('now')),
    ('address', 'Hà Nội, Việt Nam', 'string', datetime('now')),
    ('categories', '["ao_dai_ngu_than","ao_dai_4_ta","ao_dai_2_ta","phap_phuc_linen"]', 'json', datetime('now')),
    ('size_chart', '{"S":{"weight":"dưới 48kg","bust":"84-66-90","ao_dai":"134","tay":"68","quan":"102"},"M":{"weight":"dưới 53kg","bust":"90-70-94","ao_dai":"137","tay":"69","quan":"104"},"L":{"weight":"dưới 58kg","bust":"92-74-98","ao_dai":"140","tay":"70","quan":"106"},"XL":{"weight":"dưới 72kg","bust":"92-112","ao_dai":"140","tay":"70","quan":"106"}}', 'json', datetime('now')),
    ('materials', '["Linen cao cấp 100% sợi lanh","Gấm cao cấp","Lụa cao cấp"]', 'json', datetime('now'));

-- Create default admin (password: admin123 - CHANGE IN PRODUCTION!)
-- Password hash is SHA256 of 'admin123'
INSERT OR IGNORE INTO admin_users (id, username, password_hash, role, created_at) VALUES
    ('admin-001', 'admin', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'superadmin', datetime('now'));

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);
