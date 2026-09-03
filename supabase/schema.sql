-- =========================================================================
-- Headless E-Commerce PWA: PostgreSQL / Supabase Schema Definition
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Custom ENUM Types
DO $$ BEGIN
    CREATE TYPE stock_status_enum AS ENUM ('in_stock', 'low_stock', 'out_of_stock', 'pre_order');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE note_type_enum AS ENUM ('usage_tip', 'personal_review', 'recommendation');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE request_status_enum AS ENUM ('pending', 'sourcing', 'fulfilled', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create products Table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'Umum',
    price NUMERIC NOT NULL DEFAULT 0,
    image_url TEXT,
    stock_status stock_status_enum NOT NULL DEFAULT 'in_stock',
    shopee_url TEXT,
    tokopedia_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create merchant_notes Table (Merchant-Only Curated Content)
CREATE TABLE IF NOT EXISTS merchant_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    note_type note_type_enum NOT NULL DEFAULT 'recommendation',
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create special_requests Table (Customer Inquiries)
CREATE TABLE IF NOT EXISTS special_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    contact_info TEXT NOT NULL,
    item_description TEXT NOT NULL,
    status request_status_enum NOT NULL DEFAULT 'pending',
    merchant_reply TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Row Level Security (RLS) Configuration
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE special_requests ENABLE ROW LEVEL SECURITY;

-- Products: Public Read, Auth Admin Full CRUD
CREATE POLICY "Public can view products" ON products FOR SELECT USING (true);
CREATE POLICY "Admin full access to products" ON products FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Merchant Notes: Public Read, Auth Admin Full CRUD
CREATE POLICY "Public can view merchant notes" ON merchant_notes FOR SELECT USING (true);
CREATE POLICY "Admin full access to merchant notes" ON merchant_notes FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Special Requests: Public Insert, Auth Admin Full Access
CREATE POLICY "Public can submit special requests" ON special_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin full access to special requests" ON special_requests FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- 6. Initial Seed Data
INSERT INTO products (id, title, description, category, price, image_url, stock_status, shopee_url, tokopedia_url)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Garam Laut Murni Kristal Halus 1kg', 'Garam laut organik beryodium tinggi diproses alami tanpa pemutih kimia. Sangat cocok untuk konsumsi harian dan bakery.', 'Konsumsi', 18500, 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?auto=format&fit=crop&w=600&q=80', 'in_stock', 'https://shopee.co.id/universal-link/product/12345/1111', 'https://tokopedia.com/product/1111'),
    ('22222222-2222-2222-2222-222222222222', 'Garam Kasar Non-Yodium Kualitas Super 50kg (Sak)', 'Garam industri butiran kasar murni dengan kadar NaCl > 96%. Ideal untuk pengawetan ikan, water treatment, dan industri pakan ternak.', 'Industri', 225000, 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80', 'in_stock', 'https://shopee.co.id/universal-link/product/12345/2222', 'https://tokopedia.com/product/2222'),
    ('33333333-3333-3333-3333-333333333333', 'Pink Himalayan Rock Salt Premium 500g', 'Garam batu mineral alami pegunungan Himalaya kaya 84+ trace mineral essensial.', 'Gourmet', 45000, 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80', 'low_stock', 'https://shopee.co.id/universal-link/product/12345/3333', 'https://tokopedia.com/product/3333'),
    ('44444444-4444-4444-4444-444444444444', 'Garam Briket Khusus Water Softener 25kg', 'Garam tablet kompresi murni untuk regenerasi resin boiler dan filter air rumah tangga.', 'Industri', 160000, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80', 'pre_order', 'https://shopee.co.id/universal-link/product/12345/4444', 'https://tokopedia.com/product/4444')
ON CONFLICT (id) DO NOTHING;

INSERT INTO merchant_notes (product_id, note_type, content)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'personal_review', 'Produk ini menjadi best seller untuk pengusaha bakery di Surabaya karena tingkat kehalusan dan rasa asinnya yang stabil.'),
    ('11111111-1111-1111-1111-111111111111', 'usage_tip', 'Simpan di toples kaca tertutup kedap udara untuk mencegah penggumpalan akibat kelembaban tinggi.'),
    ('22222222-2222-2222-2222-222222222222', 'recommendation', 'Untuk pengiriman armada truk di atas 5 ton, hubungi kami via menu Request Khusus agar mendapatkan subsidi ongkir.')
ON CONFLICT DO NOTHING;
