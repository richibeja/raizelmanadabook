-- =====================================================
-- MIGRACIÓN 006: Sistema de Mercaplace (Marketplace)
-- =====================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLA: marketplace_categories (Categorías del marketplace)
-- =====================================================
CREATE TABLE IF NOT EXISTS marketplace_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(7),
    parent_id UUID REFERENCES marketplace_categories(id),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: marketplace_items (Productos/Servicios)
-- =====================================================
CREATE TABLE IF NOT EXISTS marketplace_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES marketplace_categories(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    original_price DECIMAL(10,2),
    discount_percentage INTEGER CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
    condition VARCHAR(20) DEFAULT 'new' CHECK (condition IN ('new', 'like_new', 'good', 'fair', 'poor')),
    item_type VARCHAR(20) DEFAULT 'product' CHECK (item_type IN ('product', 'service', 'adoption', 'donation')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'sold', 'reserved', 'expired', 'deleted')),
    quantity INTEGER DEFAULT 1,
    location VARCHAR(255),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    tags TEXT[],
    is_featured BOOLEAN DEFAULT FALSE,
    is_negotiable BOOLEAN DEFAULT FALSE,
    is_delivery_available BOOLEAN DEFAULT FALSE,
    delivery_cost DECIMAL(10,2) DEFAULT 0,
    delivery_radius INTEGER, -- en kilómetros
    views_count INTEGER DEFAULT 0,
    favorites_count INTEGER DEFAULT 0,
    contact_count INTEGER DEFAULT 0,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: marketplace_item_photos (Fotos de productos)
-- =====================================================
CREATE TABLE IF NOT EXISTS marketplace_item_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID NOT NULL REFERENCES marketplace_items(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    thumbnail_url TEXT,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: marketplace_favorites (Favoritos)
-- =====================================================
CREATE TABLE IF NOT EXISTS marketplace_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES marketplace_items(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, item_id)
);

-- =====================================================
-- TABLA: marketplace_views (Vistas de productos)
-- =====================================================
CREATE TABLE IF NOT EXISTS marketplace_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID NOT NULL REFERENCES marketplace_items(id) ON DELETE CASCADE,
    viewer_id UUID REFERENCES users(id),
    ip_address INET,
    user_agent TEXT,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: marketplace_contacts (Contactos/Consultas)
-- =====================================================
CREATE TABLE IF NOT EXISTS marketplace_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID NOT NULL REFERENCES marketplace_items(id) ON DELETE CASCADE,
    contact_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    contact_type VARCHAR(20) DEFAULT 'message' CHECK (contact_type IN ('message', 'offer', 'question')),
    offer_amount DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'read', 'replied', 'accepted', 'declined')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: marketplace_reviews (Reseñas de vendedores)
-- =====================================================
CREATE TABLE IF NOT EXISTS marketplace_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_id UUID REFERENCES marketplace_items(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    comment TEXT,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: marketplace_promoted_items (Productos promocionados)
-- =====================================================
CREATE TABLE IF NOT EXISTS marketplace_promoted_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID NOT NULL REFERENCES marketplace_items(id) ON DELETE CASCADE,
    promotion_type VARCHAR(20) NOT NULL CHECK (promotion_type IN ('featured', 'boost', 'sponsored')),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    budget DECIMAL(10,2),
    impressions_count INTEGER DEFAULT 0,
    clicks_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================

-- Índices para marketplace_categories
CREATE INDEX IF NOT EXISTS idx_marketplace_categories_slug ON marketplace_categories(slug);
CREATE INDEX IF NOT EXISTS idx_marketplace_categories_parent_id ON marketplace_categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_categories_is_active ON marketplace_categories(is_active);
CREATE INDEX IF NOT EXISTS idx_marketplace_categories_sort_order ON marketplace_categories(sort_order);

-- Índices para marketplace_items
CREATE INDEX IF NOT EXISTS idx_marketplace_items_seller_id ON marketplace_items(seller_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_category_id ON marketplace_items(category_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_status ON marketplace_items(status);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_item_type ON marketplace_items(item_type);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_price ON marketplace_items(price);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_location ON marketplace_items(location);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_is_featured ON marketplace_items(is_featured);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_created_at ON marketplace_items(created_at);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_expires_at ON marketplace_items(expires_at);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_views_count ON marketplace_items(views_count);

-- Índices para marketplace_item_photos
CREATE INDEX IF NOT EXISTS idx_marketplace_item_photos_item_id ON marketplace_item_photos(item_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_item_photos_is_primary ON marketplace_item_photos(is_primary);
CREATE INDEX IF NOT EXISTS idx_marketplace_item_photos_sort_order ON marketplace_item_photos(sort_order);

-- Índices para marketplace_favorites
CREATE INDEX IF NOT EXISTS idx_marketplace_favorites_user_id ON marketplace_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_favorites_item_id ON marketplace_favorites(item_id);

-- Índices para marketplace_views
CREATE INDEX IF NOT EXISTS idx_marketplace_views_item_id ON marketplace_views(item_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_views_viewer_id ON marketplace_views(viewer_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_views_viewed_at ON marketplace_views(viewed_at);

-- Índices para marketplace_contacts
CREATE INDEX IF NOT EXISTS idx_marketplace_contacts_item_id ON marketplace_contacts(item_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_contacts_contact_user_id ON marketplace_contacts(contact_user_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_contacts_seller_id ON marketplace_contacts(seller_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_contacts_status ON marketplace_contacts(status);

-- Índices para marketplace_reviews
CREATE INDEX IF NOT EXISTS idx_marketplace_reviews_reviewer_id ON marketplace_reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_reviews_seller_id ON marketplace_reviews(seller_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_reviews_item_id ON marketplace_reviews(item_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_reviews_rating ON marketplace_reviews(rating);

-- Índices para marketplace_promoted_items
CREATE INDEX IF NOT EXISTS idx_marketplace_promoted_items_item_id ON marketplace_promoted_items(item_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_promoted_items_promotion_type ON marketplace_promoted_items(promotion_type);
CREATE INDEX IF NOT EXISTS idx_marketplace_promoted_items_status ON marketplace_promoted_items(status);
CREATE INDEX IF NOT EXISTS idx_marketplace_promoted_items_start_date ON marketplace_promoted_items(start_date);
CREATE INDEX IF NOT EXISTS idx_marketplace_promoted_items_end_date ON marketplace_promoted_items(end_date);

-- =====================================================
-- FUNCIONES Y TRIGGERS
-- =====================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_marketplace_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_marketplace_items_updated_at BEFORE UPDATE ON marketplace_items
    FOR EACH ROW EXECUTE FUNCTION update_marketplace_updated_at();

CREATE TRIGGER update_marketplace_contacts_updated_at BEFORE UPDATE ON marketplace_contacts
    FOR EACH ROW EXECUTE FUNCTION update_marketplace_updated_at();

CREATE TRIGGER update_marketplace_reviews_updated_at BEFORE UPDATE ON marketplace_reviews
    FOR EACH ROW EXECUTE FUNCTION update_marketplace_updated_at();

-- Función para actualizar contadores de favoritos
CREATE OR REPLACE FUNCTION update_marketplace_favorites_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE marketplace_items 
        SET favorites_count = favorites_count + 1 
        WHERE id = NEW.item_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE marketplace_items 
        SET favorites_count = favorites_count - 1 
        WHERE id = OLD.item_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Triggers para contadores de favoritos
CREATE TRIGGER update_marketplace_favorites_count_insert
    AFTER INSERT ON marketplace_favorites
    FOR EACH ROW EXECUTE FUNCTION update_marketplace_favorites_count();

CREATE TRIGGER update_marketplace_favorites_count_delete
    AFTER DELETE ON marketplace_favorites
    FOR EACH ROW EXECUTE FUNCTION update_marketplace_favorites_count();

-- Función para actualizar contadores de vistas
CREATE OR REPLACE FUNCTION update_marketplace_views_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE marketplace_items 
    SET views_count = views_count + 1 
    WHERE id = NEW.item_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para contadores de vistas
CREATE TRIGGER update_marketplace_views_count_insert
    AFTER INSERT ON marketplace_views
    FOR EACH ROW EXECUTE FUNCTION update_marketplace_views_count();

-- Función para limpiar productos expirados
CREATE OR REPLACE FUNCTION cleanup_expired_marketplace_items()
RETURNS void AS $$
BEGIN
    UPDATE marketplace_items 
    SET status = 'expired' 
    WHERE expires_at < CURRENT_TIMESTAMP AND status = 'active';
END;
$$ language 'plpgsql';

-- =====================================================
-- VISTAS ÚTILES
-- =====================================================

-- Vista de productos activos con información completa
CREATE OR REPLACE VIEW marketplace_items_with_details AS
SELECT 
    mi.*,
    mc.name as category_name,
    mc.slug as category_slug,
    u.username as seller_username,
    u.first_name as seller_first_name,
    u.last_name as seller_last_name,
    u.avatar_url as seller_avatar_url,
    u.location as seller_location,
    COUNT(DISTINCT mf.id) as actual_favorites_count,
    COUNT(DISTINCT mv.id) as actual_views_count,
    COUNT(DISTINCT mc2.id) as actual_contacts_count,
    AVG(mr.rating) as average_rating,
    COUNT(DISTINCT mr.id) as reviews_count,
    ARRAY_AGG(DISTINCT mip.photo_url ORDER BY mip.sort_order, mip.is_primary DESC) FILTER (WHERE mip.photo_url IS NOT NULL) as photos,
    ARRAY_AGG(DISTINCT mip.thumbnail_url ORDER BY mip.sort_order, mip.is_primary DESC) FILTER (WHERE mip.thumbnail_url IS NOT NULL) as thumbnails
FROM marketplace_items mi
JOIN marketplace_categories mc ON mi.category_id = mc.id
JOIN users u ON mi.seller_id = u.id
LEFT JOIN marketplace_favorites mf ON mi.id = mf.item_id
LEFT JOIN marketplace_views mv ON mi.id = mv.item_id
LEFT JOIN marketplace_contacts mc2 ON mi.id = mc2.item_id
LEFT JOIN marketplace_reviews mr ON mi.seller_id = mr.seller_id
LEFT JOIN marketplace_item_photos mip ON mi.id = mip.item_id
WHERE mi.status = 'active'
GROUP BY mi.id, mc.name, mc.slug, u.username, u.first_name, u.last_name, u.avatar_url, u.location;

-- Vista de productos promocionados
CREATE OR REPLACE VIEW promoted_marketplace_items AS
SELECT 
    mi.*,
    mpi.promotion_type,
    mpi.start_date,
    mpi.end_date,
    mpi.budget,
    mpi.impressions_count,
    mpi.clicks_count,
    mpi.status as promotion_status
FROM marketplace_items mi
JOIN marketplace_promoted_items mpi ON mi.id = mpi.item_id
WHERE mpi.status = 'active' 
  AND mpi.start_date <= CURRENT_TIMESTAMP 
  AND mpi.end_date >= CURRENT_TIMESTAMP
  AND mi.status = 'active'
ORDER BY mpi.promotion_type DESC, mi.created_at DESC;

-- Vista de vendedores con estadísticas
CREATE OR REPLACE VIEW marketplace_sellers_stats AS
SELECT 
    u.id,
    u.username,
    u.first_name,
    u.last_name,
    u.avatar_url,
    u.location,
    COUNT(DISTINCT mi.id) as total_items,
    COUNT(DISTINCT mi.id) FILTER (WHERE mi.status = 'active') as active_items,
    COUNT(DISTINCT mi.id) FILTER (WHERE mi.status = 'sold') as sold_items,
    AVG(mr.rating) as average_rating,
    COUNT(DISTINCT mr.id) as total_reviews,
    COUNT(DISTINCT mf.item_id) as total_favorites,
    SUM(mi.views_count) as total_views
FROM users u
LEFT JOIN marketplace_items mi ON u.id = mi.seller_id
LEFT JOIN marketplace_reviews mr ON u.id = mr.seller_id
LEFT JOIN marketplace_favorites mf ON mi.id = mf.item_id
GROUP BY u.id, u.username, u.first_name, u.last_name, u.avatar_url, u.location;

-- =====================================================
-- DATOS INICIALES
-- =====================================================

-- Insertar categorías del marketplace
INSERT INTO marketplace_categories (name, slug, description, icon, color, sort_order) VALUES
('Mascotas', 'mascotas', 'Mascotas en adopción o venta', '🐾', '#FF6B6B', 1),
('Perros', 'perros', 'Perros de todas las razas', '🐕', '#4ECDC4', 2),
('Gatos', 'gatos', 'Gatos domésticos y de raza', '🐱', '#45B7D1', 3),
('Aves', 'aves', 'Pájaros y aves exóticas', '🦜', '#96CEB4', 4),
('Peces', 'peces', 'Peces y acuarios', '🐠', '#FFEAA7', 5),
('Reptiles', 'reptiles', 'Reptiles y anfibios', '🦎', '#DDA0DD', 6),
('Accesorios', 'accesorios', 'Collares, correas, juguetes', '🦮', '#98D8C8', 7),
('Alimentación', 'alimentacion', 'Comida y suplementos', '🍖', '#F7DC6F', 8),
('Cuidado', 'cuidado', 'Productos de higiene y salud', '🛁', '#BB8FCE', 9),
('Servicios', 'servicios', 'Veterinarios, peluquería, entrenamiento', '🏥', '#85C1E9', 10),
('Adopción', 'adopcion', 'Mascotas en adopción responsable', '🏠', '#F8C471', 11),
('Otros', 'otros', 'Otros productos y servicios', '🛍️', '#F1948A', 12)
ON CONFLICT (slug) DO NOTHING;

-- Insertar productos de ejemplo
INSERT INTO marketplace_items (
    seller_id,
    category_id,
    title,
    description,
    price,
    currency,
    condition,
    item_type,
    location,
    tags,
    is_featured,
    is_negotiable,
    is_delivery_available,
    delivery_cost,
    delivery_radius,
    expires_at
) VALUES 
(
    (SELECT id FROM users WHERE username = 'admin' LIMIT 1),
    (SELECT id FROM marketplace_categories WHERE slug = 'perros' LIMIT 1),
    'Cachorro Golden Retriever',
    'Hermoso cachorro Golden Retriever de 3 meses, vacunado y desparasitado. Muy cariñoso y juguetón.',
    800.00,
    'EUR',
    'new',
    'product',
    'Madrid, España',
    ARRAY['golden', 'cachorro', 'perro', 'mascota'],
    TRUE,
    TRUE,
    TRUE,
    50.00,
    100,
    CURRENT_TIMESTAMP + INTERVAL '30 days'
),
(
    (SELECT id FROM users WHERE username = 'admin' LIMIT 1),
    (SELECT id FROM marketplace_categories WHERE slug = 'accesorios' LIMIT 1),
    'Collar LED para perros',
    'Collar LED recargable con múltiples colores. Perfecto para paseos nocturnos.',
    25.99,
    'EUR',
    'new',
    'product',
    'Barcelona, España',
    ARRAY['collar', 'led', 'seguridad', 'noche'],
    FALSE,
    FALSE,
    TRUE,
    5.00,
    50,
    CURRENT_TIMESTAMP + INTERVAL '60 days'
),
(
    (SELECT id FROM users WHERE username = 'admin' LIMIT 1),
    (SELECT id FROM marketplace_categories WHERE slug = 'adopcion' LIMIT 1),
    'Gato adulto en adopción',
    'Gato adulto de 2 años, esterilizado y vacunado. Busca un hogar amoroso.',
    0.00,
    'EUR',
    'good',
    'adoption',
    'Valencia, España',
    ARRAY['gato', 'adopcion', 'adulto', 'esterilizado'],
    TRUE,
    FALSE,
    FALSE,
    0.00,
    0,
    CURRENT_TIMESTAMP + INTERVAL '90 days'
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- COMENTARIOS
-- =====================================================

COMMENT ON TABLE marketplace_categories IS 'Categorías del marketplace para organizar productos';
COMMENT ON TABLE marketplace_items IS 'Productos y servicios del marketplace';
COMMENT ON TABLE marketplace_item_photos IS 'Fotos de los productos';
COMMENT ON TABLE marketplace_favorites IS 'Productos favoritos de los usuarios';
COMMENT ON TABLE marketplace_views IS 'Registro de vistas de productos';
COMMENT ON TABLE marketplace_contacts IS 'Mensajes entre compradores y vendedores';
COMMENT ON TABLE marketplace_reviews IS 'Reseñas de vendedores';
COMMENT ON TABLE marketplace_promoted_items IS 'Productos promocionados';

COMMENT ON COLUMN marketplace_items.condition IS 'Estado del producto (new, like_new, good, fair, poor)';
COMMENT ON COLUMN marketplace_items.item_type IS 'Tipo de item (product, service, adoption, donation)';
COMMENT ON COLUMN marketplace_items.delivery_radius IS 'Radio de entrega en kilómetros';
COMMENT ON COLUMN marketplace_item_photos.is_primary IS 'Indica si es la foto principal del producto';
COMMENT ON COLUMN marketplace_contacts.contact_type IS 'Tipo de contacto (message, offer, question)';
COMMENT ON COLUMN marketplace_reviews.is_verified_purchase IS 'Indica si es una compra verificada';
