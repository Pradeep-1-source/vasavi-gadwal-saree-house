-- ==============================================================================
-- VASAVI GADWAL SAREE HOUSE — COMPLETE SUPABASE DATABASE SCHEMA
-- Single, all-in-one executable script for Supabase SQL Editor
-- Includes: Extensions, Tables, Foreign Keys, RLS Policies, Admin Triggers,
--           Storage Buckets, and Initial Product & Category Seed Data
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUM TYPES
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('customer', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status_type AS ENUM ('Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status_type AS ENUM ('Pending', 'Paid', 'Failed', 'Refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT,
    role user_role DEFAULT 'customer'::user_role NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. ADDRESSES TABLE
CREATE TABLE IF NOT EXISTS public.addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    house_number TEXT NOT NULL,
    building_name TEXT,
    street TEXT NOT NULL,
    locality TEXT NOT NULL,
    landmark TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    country TEXT DEFAULT 'India' NOT NULL,
    is_default BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. PRODUCTS TABLE (Supports Full CRUD & Safe Deletion)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    compare_at_price NUMERIC(12, 2) CHECK (compare_at_price >= 0),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    fabric TEXT NOT NULL,
    colour TEXT NOT NULL,
    saree_length TEXT DEFAULT '6.2 Meters (including blouse)' NOT NULL,
    blouse_details TEXT DEFAULT 'Attached Contrast Blouse Piece (80 cm)' NOT NULL,
    stock_quantity INTEGER DEFAULT 5 NOT NULL CHECK (stock_quantity >= 0),
    is_featured BOOLEAN DEFAULT FALSE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 7. PRODUCT IMAGES TABLE (Cascades on Product Deletion)
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    display_order INTEGER DEFAULT 1 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 8. CARTS & CART ITEMS (Cascades on Product Deletion)
CREATE TABLE IF NOT EXISTS public.carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id UUID REFERENCES public.carts(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER DEFAULT 1 NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(cart_id, product_id)
);

-- 9. ORDERS TABLE (PhonePe UPI payment verification fields)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name TEXT,
    customer_phone TEXT,
    customer_email TEXT,
    address_snapshot JSONB NOT NULL,
    subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
    delivery_charge NUMERIC(12, 2) DEFAULT 100.00 NOT NULL CHECK (delivery_charge >= 0),
    discount_amount NUMERIC(12, 2) DEFAULT 0.00 NOT NULL CHECK (discount_amount >= 0),
    total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
    payment_method TEXT DEFAULT 'phonepe' NOT NULL,
    payment_provider TEXT DEFAULT 'phonepe' NOT NULL,
    payment_status payment_status_type DEFAULT 'Pending'::payment_status_type NOT NULL,
    order_status order_status_type DEFAULT 'Pending'::order_status_type NOT NULL,
    upi_id TEXT DEFAULT '7660833168@ybl',
    utr_number TEXT,
    payment_screenshot_url TEXT,
    tracking_number TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 10. ORDER ITEMS TABLE (Preserves item snapshot even if product is deleted)
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name_snapshot TEXT NOT NULL,
    product_image_snapshot TEXT NOT NULL,
    unit_price NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    line_total NUMERIC(12, 2) NOT NULL CHECK (line_total >= 0)
);

-- 11. PAYMENTS AUDIT TABLE
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    payment_method TEXT DEFAULT 'phonepe' NOT NULL,
    utr_number TEXT,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
    currency VARCHAR(10) DEFAULT 'INR' NOT NULL,
    status payment_status_type DEFAULT 'Pending'::payment_status_type NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 12. REVIEWS TABLE (Cascades on Product Deletion)
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    user_name TEXT NOT NULL,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5) NOT NULL,
    review_text TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 13. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key TEXT UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Helper function: Check if current authenticated user is Admin or vasavi@admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
        OR
        (auth.jwt() ->> 'email' = 'vasavi@admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
DROP POLICY IF EXISTS "Users can read own profile or admin can read all" ON public.profiles;
CREATE POLICY "Users can read own profile or admin can read all"
ON public.profiles FOR SELECT
USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Public can create profile" ON public.profiles;
CREATE POLICY "Public can create profile"
ON public.profiles FOR INSERT
WITH CHECK (true);

-- Addresses Policies
DROP POLICY IF EXISTS "Users can manage their own addresses" ON public.addresses;
CREATE POLICY "Users can manage their own addresses"
ON public.addresses FOR ALL
USING (auth.uid() = user_id OR public.is_admin());

-- Categories Policies
DROP POLICY IF EXISTS "Public can view active categories" ON public.categories;
CREATE POLICY "Public can view active categories"
ON public.categories FOR SELECT
USING (is_active = TRUE OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
CREATE POLICY "Admins can manage categories"
ON public.categories FOR ALL
USING (public.is_admin() OR auth.role() = 'anon');

-- Products Policies (Allows public read, allows insert/update/delete)
DROP POLICY IF EXISTS "Public can view active products" ON public.products;
CREATE POLICY "Public can view active products"
ON public.products FOR SELECT
USING (is_active = TRUE OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Admins can manage products"
ON public.products FOR ALL
USING (public.is_admin() OR auth.role() = 'anon');

-- Product Images Policies
DROP POLICY IF EXISTS "Public can view product images" ON public.product_images;
CREATE POLICY "Public can view product images"
ON public.product_images FOR SELECT
USING (TRUE);

DROP POLICY IF EXISTS "Admins can manage product images" ON public.product_images;
CREATE POLICY "Admins can manage product images"
ON public.product_images FOR ALL
USING (public.is_admin() OR auth.role() = 'anon');

-- Carts & Items Policies
DROP POLICY IF EXISTS "Users can view and manage their own cart" ON public.carts;
CREATE POLICY "Users can view and manage their own cart"
ON public.carts FOR ALL
USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can manage cart items" ON public.cart_items;
CREATE POLICY "Users can manage cart items"
ON public.cart_items FOR ALL
USING (EXISTS (SELECT 1 FROM public.carts WHERE carts.id = cart_items.cart_id AND carts.user_id = auth.uid()) OR public.is_admin());

-- Orders Policies
DROP POLICY IF EXISTS "Users can read own orders or admin read all" ON public.orders;
CREATE POLICY "Users can read own orders or admin read all"
ON public.orders FOR SELECT
USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Allow placing orders" ON public.orders;
CREATE POLICY "Allow placing orders"
ON public.orders FOR INSERT
WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Admins can manage all orders" ON public.orders;
CREATE POLICY "Admins can manage all orders"
ON public.orders FOR ALL
USING (public.is_admin() OR auth.role() = 'anon');

-- Order Items Policies
DROP POLICY IF EXISTS "Users can read own order items" ON public.order_items;
CREATE POLICY "Users can read own order items"
ON public.order_items FOR SELECT
USING (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()) OR public.is_admin());

DROP POLICY IF EXISTS "Allow inserting order items" ON public.order_items;
CREATE POLICY "Allow inserting order items"
ON public.order_items FOR INSERT
WITH CHECK (TRUE);

-- Payments Policies
DROP POLICY IF EXISTS "Public can submit payment details" ON public.payments;
CREATE POLICY "Public can submit payment details"
ON public.payments FOR INSERT
WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Admins can view and manage payments" ON public.payments;
CREATE POLICY "Admins can view and manage payments"
ON public.payments FOR ALL
USING (public.is_admin() OR auth.role() = 'anon');

-- Reviews Policies
DROP POLICY IF EXISTS "Public can view approved reviews" ON public.reviews;
CREATE POLICY "Public can view approved reviews"
ON public.reviews FOR SELECT
USING (is_approved = TRUE OR public.is_admin());

DROP POLICY IF EXISTS "Public can submit reviews" ON public.reviews;
CREATE POLICY "Public can submit reviews"
ON public.reviews FOR INSERT
WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Admins can manage all reviews" ON public.reviews;
CREATE POLICY "Admins can manage all reviews"
ON public.reviews FOR ALL
USING (public.is_admin() OR auth.role() = 'anon');

-- Site Settings Policies
DROP POLICY IF EXISTS "Public can read site settings" ON public.site_settings;
CREATE POLICY "Public can read site settings"
ON public.site_settings FOR SELECT
USING (TRUE);

DROP POLICY IF EXISTS "Admins can modify site settings" ON public.site_settings;
CREATE POLICY "Admins can modify site settings"
ON public.site_settings FOR ALL
USING (public.is_admin() OR auth.role() = 'anon');

-- ==============================================================================
-- AUTH TRIGGER: AUTO-CREATE PROFILE WITH vasavi@admin ROLE SUPPORT
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, phone, role)
    VALUES (
        new.id,
        COALESCE(
            new.raw_user_meta_data->>'full_name',
            CASE WHEN new.email = 'vasavi@admin' THEN 'Vasavi Admin' ELSE 'Customer' END
        ),
        COALESCE(new.raw_user_meta_data->>'phone', '7660833168'),
        CASE 
            WHEN new.email = 'vasavi@admin' THEN 'admin'::user_role 
            ELSE 'customer'::user_role 
        END
    )
    ON CONFLICT (id) DO UPDATE SET
        role = CASE 
            WHEN EXCLUDED.id IN (SELECT id FROM auth.users WHERE email = 'vasavi@admin') THEN 'admin'::user_role 
            ELSE profiles.role 
        END;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- STORAGE BUCKETS (FOR PRODUCT IMAGES & PAYMENT PROOF SCREENSHOTS)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('products', 'products', true),
    ('payments', 'payments', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
DROP POLICY IF EXISTS "Public Access Products" ON storage.objects;
CREATE POLICY "Public Access Products"
ON storage.objects FOR SELECT
USING (bucket_id IN ('products', 'payments'));

DROP POLICY IF EXISTS "Allow Uploads to Products and Payments" ON storage.objects;
CREATE POLICY "Allow Uploads to Products and Payments"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id IN ('products', 'payments'));

DROP POLICY IF EXISTS "Admins Can Delete Storage Objects" ON storage.objects;
CREATE POLICY "Admins Can Delete Storage Objects"
ON storage.objects FOR DELETE
USING (bucket_id IN ('products', 'payments'));

-- ==============================================================================
-- INITIAL SEED DATA (CATEGORIES, PRODUCTS, IMAGES, SETTINGS)
-- ==============================================================================

-- 1. Site Settings (PhonePe beneficiary K THIRUMALA DEVI & WhatsApp)
INSERT INTO public.site_settings (setting_key, setting_value)
VALUES (
    'general',
    json_build_object(
        'store_name', 'Vasavi Gadwal Saree House',
        'upi_id', '7660833168@ybl',
        'upi_name', 'K THIRUMALA DEVI',
        'delivery_charge', 100,
        'free_delivery_threshold', 15000,
        'support_phone', '+91 7660833168',
        'whatsapp_number', '917660833168',
        'announcement_bar', '✨ Handcrafted Gadwal Heritage Weaves | Flat ₹100 Express Delivery Across India',
        'is_announcement_enabled', true
    )
)
ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value;

-- 2. Categories
INSERT INTO public.categories (name, slug, description, image_url, is_active)
VALUES
    (
        'Pure Gadwal Silk Sarees',
        'gadwal-silk',
        'Authentic handloom pure mulberry silk body with signature interlocking Kuttu zari borders woven by generational Telangana weavers.',
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85',
        true
    ),
    (
        'Gadwal Sico Sarees (Silk Cotton)',
        'gadwal-sico',
        'Breathable lightweight blend of fine cotton warp and pure silk weft with traditional contrasting rich zari border.',
        'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=85',
        true
    ),
    (
        'Bridal & Festive Gadwal Zari',
        'bridal-festive',
        'Heirloom bridal Gadwal creations with pure gold & silver zari brocade pallu, temple borders, and peacock motifs.',
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=85',
        true
    ),
    (
        'Handloom Cotton Gadwal',
        'cotton-gadwal',
        'Feather-light fine cotton Gadwal sarees with crisp contrast silk zari borders, perfect for elegant daily & temple wear.',
        'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=85',
        true
    )
ON CONFLICT (slug) DO UPDATE SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url;

-- 3. Products
INSERT INTO public.products (
    sku, name, slug, description, price, compare_at_price,
    category_id, fabric, colour, saree_length, blouse_details,
    stock_quantity, is_featured, is_active
)
VALUES
    (
        'VGSH-GS-01',
        'Royal Crimson Maroon Pure Gadwal Silk Saree',
        'royal-crimson-maroon-gadwal-silk-saree',
        'Exquisite pure mulberry silk Gadwal saree in deep crimson maroon featuring the revered hand-interlocked Kuttu zari border in antique gold. Adorned with delicate floral buttas and an ornate temple gopuram zari pallu.',
        16499.00,
        19999.00,
        (SELECT id FROM public.categories WHERE slug = 'gadwal-silk' LIMIT 1),
        '100% Pure Mulberry Silk',
        'Crimson Maroon & Antique Gold',
        '6.2 Meters (including blouse)',
        'Attached Contrast Forest Green Blouse Piece (80 cm)',
        6,
        true,
        true
    ),
    (
        'VGSH-GS-02',
        'Peacock Teal Blue Kuttu Border Gadwal Silk',
        'peacock-teal-blue-kuttu-border-gadwal-silk',
        'Captivating royal teal blue body woven on traditional pit looms, framed with contrasting magenta pink borders and authentic silver-gold zari interlocking pallu.',
        18250.00,
        22500.00,
        (SELECT id FROM public.categories WHERE slug = 'gadwal-silk' LIMIT 1),
        'Pure Gadwal Silk',
        'Peacock Teal & Magenta Pink',
        '6.2 Meters (including blouse)',
        'Attached Contrast Magenta Pink Blouse Piece (80 cm)',
        4,
        true,
        true
    ),
    (
        'VGSH-BR-03',
        'Heirloom Temple Border Bridal Gadwal Silk',
        'heirloom-temple-border-bridal-gadwal-silk',
        'An opulent bridal masterpiece featuring rich turmeric yellow pure silk body with majestic ruby red Kuttu border, intricate peacock and elephant zari motifs, and heavy bridal brocade pallu.',
        24999.00,
        29999.00,
        (SELECT id FROM public.categories WHERE slug = 'bridal-festive' LIMIT 1),
        'Pure Gadwal Silk with Rich Zari',
        'Turmeric Yellow & Ruby Red',
        '6.2 Meters (including blouse)',
        'Attached Rich Brocade Ruby Red Blouse (80 cm)',
        3,
        true,
        true
    ),
    (
        'VGSH-SC-04',
        'Forest Emerald Green Gadwal Sico Saree',
        'forest-emerald-green-gadwal-sico-saree',
        'Lightweight and regal Gadwal Silk-Cotton (Sico) saree with emerald green body, breathable cotton-silk drape, and bright crimson contrast zari border.',
        8499.00,
        10500.00,
        (SELECT id FROM public.categories WHERE slug = 'gadwal-sico' LIMIT 1),
        'Gadwal Sico (Silk Cotton)',
        'Emerald Green & Crimson Red',
        '6.2 Meters (including blouse)',
        'Attached Contrast Crimson Red Blouse Piece (80 cm)',
        8,
        true,
        true
    ),
    (
        'VGSH-CT-05',
        'Ivory & Copper Zari Handloom Cotton Gadwal',
        'ivory-copper-zari-handloom-cotton-gadwal',
        'Ethereal pure cotton body in serene natural ivory with lustrous copper zari border and maroon selvage. Ideal for poojas, festive mornings, and summer ceremonies.',
        5999.00,
        7499.00,
        (SELECT id FROM public.categories WHERE slug = 'cotton-gadwal' LIMIT 1),
        'Fine Handloom Cotton',
        'Natural Ivory & Copper Zari',
        '6.2 Meters (including blouse)',
        'Attached Contrast Maroon Blouse Piece (80 cm)',
        10,
        false,
        true
    ),
    (
        'VGSH-GS-06',
        'Regal Aubergine Purple Pure Gadwal Silk',
        'regal-aubergine-purple-gadwal-silk',
        'Dramatic deep aubergine violet pure silk Gadwal with traditional mustard yellow Kuttu zari border and classic coin buttas across the drape.',
        15999.00,
        18999.00,
        (SELECT id FROM public.categories WHERE slug = 'gadwal-silk' LIMIT 1),
        'Pure Mulberry Silk',
        'Aubergine Violet & Mustard Gold',
        '6.2 Meters (including blouse)',
        'Attached Mustard Gold Blouse Piece (80 cm)',
        5,
        true,
        true
    )
ON CONFLICT (sku) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity;

-- 4. Product Images
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order)
SELECT id, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85', 'Crimson Maroon Gadwal Saree Full Drape', 1 FROM public.products WHERE sku = 'VGSH-GS-01'
UNION ALL
SELECT id, 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85', 'Antique Gold Interlocking Kuttu Zari Border Detail', 2 FROM public.products WHERE sku = 'VGSH-GS-01'
UNION ALL
SELECT id, 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85', 'Peacock Teal Gadwal Silk Drape', 1 FROM public.products WHERE sku = 'VGSH-GS-02'
UNION ALL
SELECT id, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85', 'Magenta Pink Zari Pallu Close-up', 2 FROM public.products WHERE sku = 'VGSH-GS-02'
UNION ALL
SELECT id, 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85', 'Bridal Gadwal Temple Border Silk Saree', 1 FROM public.products WHERE sku = 'VGSH-BR-03'
UNION ALL
SELECT id, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85', 'Intricate Peacock Zari Brocade Pallu Detail', 2 FROM public.products WHERE sku = 'VGSH-BR-03'
UNION ALL
SELECT id, 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85', 'Emerald Green Gadwal Sico Saree Drape', 1 FROM public.products WHERE sku = 'VGSH-SC-04'
UNION ALL
SELECT id, 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1200&q=85', 'Ivory Cotton Gadwal Saree with Copper Zari', 1 FROM public.products WHERE sku = 'VGSH-CT-05'
UNION ALL
SELECT id, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85', 'Aubergine Purple Gadwal Silk Saree Drape', 1 FROM public.products WHERE sku = 'VGSH-GS-06'
ON CONFLICT DO NOTHING;

-- 5. Customer Reviews
INSERT INTO public.reviews (product_id, user_name, rating, review_text, is_approved)
SELECT id, 'Sowmya Reddy, Hyderabad', 5, 'Pure authentic Gadwal weave! The interlocking Kuttu border is flawless. Delivered within 2 days with beautiful traditional box packing. Extremely satisfied.', true FROM public.products WHERE sku = 'VGSH-GS-01'
UNION ALL
SELECT id, 'Lakshmi Narayanan, Bengaluru', 5, 'Wore this peacock teal saree for my sister’s engagement. Everyone praised the rich sheen and contrast pallu. Genuine handloom quality from Vasavi Saree House!', true FROM public.products WHERE sku = 'VGSH-GS-02'
UNION ALL
SELECT id, 'Dr. Anitha Rao, Vijayawada', 5, 'The bridal yellow and red combination with temple gopuram zari border is mesmerizing. Heavy pure zari work, exactly as shown. Highly recommended.', true FROM public.products WHERE sku = 'VGSH-BR-03'
ON CONFLICT DO NOTHING;

-- ==============================================================================
-- 6. SUPABASE STORAGE BUCKET FOR DIRECT SAREE IMAGE UPLOADS
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'products',
    'products',
    true,
    10485760, -- 10MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[];

-- Storage Policies
DO $$ BEGIN
    DROP POLICY IF EXISTS "Public Saree Images Access" ON storage.objects;
    CREATE POLICY "Public Saree Images Access"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'products');
EXCEPTION WHEN OTHERS THEN null;
END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Allow Upload Saree Photos" ON storage.objects;
    CREATE POLICY "Allow Upload Saree Photos"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'products');
EXCEPTION WHEN OTHERS THEN null;
END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Allow Update Saree Photos" ON storage.objects;
    CREATE POLICY "Allow Update Saree Photos"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'products');
EXCEPTION WHEN OTHERS THEN null;
END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Allow Delete Saree Photos" ON storage.objects;
    CREATE POLICY "Allow Delete Saree Photos"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'products');
EXCEPTION WHEN OTHERS THEN null;
END $$;

