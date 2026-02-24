-- Migration: 008_promos_ads_schema.sql
-- Description: Sistema de publicidad pagada (Promos/Ads)
-- Date: 2024-01-XX

-- Tabla principal de campañas publicitarias
CREATE TABLE IF NOT EXISTS ads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    creative_type VARCHAR(50) NOT NULL CHECK (creative_type IN ('image', 'video', 'carousel', 'story')),
    creative_urls TEXT[] NOT NULL, -- Array de URLs de imágenes/videos
    target_audience JSONB, -- Configuración de targeting
    budget_amount DECIMAL(10,2) NOT NULL,
    budget_currency VARCHAR(3) DEFAULT 'USD',
    bid_type VARCHAR(20) NOT NULL CHECK (bid_type IN ('cpm', 'cpc', 'cpi')),
    bid_amount DECIMAL(10,2) NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'active', 'paused', 'completed', 'cancelled')),
    payment_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
    stripe_payment_intent_id VARCHAR(255),
    total_impressions INTEGER DEFAULT 0,
    total_clicks INTEGER DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0,
    ctr DECIMAL(5,4) DEFAULT 0, -- Click-through rate
    cpm DECIMAL(10,2) DEFAULT 0, -- Cost per mille
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE,
    approved_by UUID REFERENCES users(id),
    rejection_reason TEXT
);

-- Tabla de impresiones de anuncios
CREATE TABLE IF NOT EXISTS ad_impressions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ad_id UUID NOT NULL REFERENCES ads(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    session_id VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    location_data JSONB, -- Ciudad, país, etc.
    device_type VARCHAR(20), -- mobile, desktop, tablet
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_clicked BOOLEAN DEFAULT FALSE,
    click_timestamp TIMESTAMP WITH TIME ZONE
);

-- Tabla de clics en anuncios
CREATE TABLE IF NOT EXISTS ad_clicks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ad_id UUID NOT NULL REFERENCES ads(id) ON DELETE CASCADE,
    impression_id UUID REFERENCES ad_impressions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    session_id VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    location_data JSONB,
    device_type VARCHAR(20),
    clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    destination_url VARCHAR(500),
    conversion_value DECIMAL(10,2)
);

-- Tabla de segmentos de audiencia para targeting
CREATE TABLE IF NOT EXISTS audience_segments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    criteria JSONB NOT NULL, -- Criterios de segmentación
    estimated_size INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de slots publicitarios
CREATE TABLE IF NOT EXISTS ad_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    position VARCHAR(50) NOT NULL, -- feed_top, feed_middle, sidebar, story, etc.
    dimensions VARCHAR(50), -- 300x250, 728x90, etc.
    max_ads_per_slot INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de asignación de anuncios a slots
CREATE TABLE IF NOT EXISTS ad_slot_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ad_id UUID NOT NULL REFERENCES ads(id) ON DELETE CASCADE,
    slot_id UUID NOT NULL REFERENCES ad_slots(id) ON DELETE CASCADE,
    priority INTEGER DEFAULT 0, -- Prioridad de mostrar el anuncio
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(ad_id, slot_id)
);

-- Tabla de reportes de anuncios
CREATE TABLE IF NOT EXISTS ad_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ad_id UUID NOT NULL REFERENCES ads(id) ON DELETE CASCADE,
    reporter_id UUID NOT NULL REFERENCES users(id),
    reason VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    action_taken VARCHAR(100), -- removed, warned, banned, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de facturación y pagos
CREATE TABLE IF NOT EXISTS ad_billing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ad_id UUID NOT NULL REFERENCES ads(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    stripe_payment_intent_id VARCHAR(255),
    stripe_charge_id VARCHAR(255),
    payment_status VARCHAR(20) NOT NULL DEFAULT 'pending',
    payment_method VARCHAR(50),
    billing_address JSONB,
    invoice_url VARCHAR(500),
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_ads_owner_id ON ads(owner_id);
CREATE INDEX IF NOT EXISTS idx_ads_status ON ads(status);
CREATE INDEX IF NOT EXISTS idx_ads_dates ON ads(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_ads_payment_status ON ads(payment_status);
CREATE INDEX IF NOT EXISTS idx_ad_impressions_ad_id ON ad_impressions(ad_id);
CREATE INDEX IF NOT EXISTS idx_ad_impressions_user_id ON ad_impressions(user_id);
CREATE INDEX IF NOT EXISTS idx_ad_impressions_viewed_at ON ad_impressions(viewed_at);
CREATE INDEX IF NOT EXISTS idx_ad_clicks_ad_id ON ad_clicks(ad_id);
CREATE INDEX IF NOT EXISTS idx_ad_clicks_clicked_at ON ad_clicks(clicked_at);
CREATE INDEX IF NOT EXISTS idx_ad_slot_assignments_ad_id ON ad_slot_assignments(ad_id);
CREATE INDEX IF NOT EXISTS idx_ad_slot_assignments_slot_id ON ad_slot_assignments(slot_id);
CREATE INDEX IF NOT EXISTS idx_ad_reports_ad_id ON ad_reports(ad_id);
CREATE INDEX IF NOT EXISTS idx_ad_reports_status ON ad_reports(status);

-- Triggers para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_ads_updated_at BEFORE UPDATE ON ads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_audience_segments_updated_at BEFORE UPDATE ON audience_segments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para calcular estadísticas de anuncios
CREATE OR REPLACE FUNCTION calculate_ad_stats(ad_uuid UUID)
RETURNS TABLE(
    total_impressions BIGINT,
    total_clicks BIGINT,
    total_spent DECIMAL(10,2),
    ctr DECIMAL(5,4),
    cpm DECIMAL(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(i.id)::BIGINT as total_impressions,
        COUNT(c.id)::BIGINT as total_clicks,
        COALESCE(SUM(b.amount), 0) as total_spent,
        CASE 
            WHEN COUNT(i.id) > 0 THEN (COUNT(c.id)::DECIMAL / COUNT(i.id)::DECIMAL)::DECIMAL(5,4)
            ELSE 0
        END as ctr,
        CASE 
            WHEN COUNT(i.id) > 0 THEN (COALESCE(SUM(b.amount), 0) / (COUNT(i.id)::DECIMAL / 1000))::DECIMAL(10,2)
            ELSE 0
        END as cpm
    FROM ads a
    LEFT JOIN ad_impressions i ON a.id = i.ad_id
    LEFT JOIN ad_clicks c ON a.id = c.ad_id
    LEFT JOIN ad_billing b ON a.id = b.ad_id AND b.payment_status = 'paid'
    WHERE a.id = ad_uuid
    GROUP BY a.id;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener anuncios activos para un usuario
CREATE OR REPLACE FUNCTION get_active_ads_for_user(user_uuid UUID, slot_position VARCHAR(50))
RETURNS TABLE(
    ad_id UUID,
    title VARCHAR(255),
    description TEXT,
    creative_type VARCHAR(50),
    creative_urls TEXT[],
    bid_amount DECIMAL(10,2),
    priority INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id,
        a.title,
        a.description,
        a.creative_type,
        a.creative_urls,
        a.bid_amount,
        asa.priority
    FROM ads a
    JOIN ad_slot_assignments asa ON a.id = asa.ad_id
    JOIN ad_slots s ON asa.slot_id = s.id
    WHERE a.status = 'active'
        AND a.payment_status = 'paid'
        AND s.position = slot_position
        AND asa.is_active = TRUE
        AND NOW() BETWEEN asa.start_date AND asa.end_date
        AND NOW() BETWEEN a.start_date AND a.end_date
        AND a.total_spent < a.budget_amount
    ORDER BY asa.priority DESC, a.bid_amount DESC
    LIMIT 5;
END;
$$ LANGUAGE plpgsql;

-- Función para registrar una impresión
CREATE OR REPLACE FUNCTION record_ad_impression(
    p_ad_id UUID,
    p_user_id UUID DEFAULT NULL,
    p_session_id VARCHAR(255) DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_location_data JSONB DEFAULT NULL,
    p_device_type VARCHAR(20) DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    impression_id UUID;
BEGIN
    INSERT INTO ad_impressions (
        ad_id, user_id, session_id, ip_address, user_agent, 
        location_data, device_type
    ) VALUES (
        p_ad_id, p_user_id, p_session_id, p_ip_address, p_user_agent,
        p_location_data, p_device_type
    ) RETURNING id INTO impression_id;
    
    -- Actualizar contador de impresiones en la tabla ads
    UPDATE ads 
    SET total_impressions = total_impressions + 1,
        updated_at = NOW()
    WHERE id = p_ad_id;
    
    RETURN impression_id;
END;
$$ LANGUAGE plpgsql;

-- Función para registrar un clic
CREATE OR REPLACE FUNCTION record_ad_click(
    p_ad_id UUID,
    p_impression_id UUID DEFAULT NULL,
    p_user_id UUID DEFAULT NULL,
    p_session_id VARCHAR(255) DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_location_data JSONB DEFAULT NULL,
    p_device_type VARCHAR(20) DEFAULT NULL,
    p_destination_url VARCHAR(500) DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    click_id UUID;
BEGIN
    -- Registrar el clic
    INSERT INTO ad_clicks (
        ad_id, impression_id, user_id, session_id, ip_address,
        user_agent, location_data, device_type, destination_url
    ) VALUES (
        p_ad_id, p_impression_id, p_user_id, p_session_id, p_ip_address,
        p_user_agent, p_location_data, p_device_type, p_destination_url
    ) RETURNING id INTO click_id;
    
    -- Actualizar la impresión como clickeada
    IF p_impression_id IS NOT NULL THEN
        UPDATE ad_impressions 
        SET is_clicked = TRUE, click_timestamp = NOW()
        WHERE id = p_impression_id;
    END IF;
    
    -- Actualizar contador de clics en la tabla ads
    UPDATE ads 
    SET total_clicks = total_clicks + 1,
        updated_at = NOW()
    WHERE id = p_ad_id;
    
    RETURN click_id;
END;
$$ LANGUAGE plpgsql;

-- Datos iniciales
INSERT INTO ad_slots (name, description, position, dimensions, max_ads_per_slot) VALUES
('Feed Top', 'Anuncio en la parte superior del feed principal', 'feed_top', '728x90', 1),
('Feed Middle', 'Anuncio en el medio del feed principal', 'feed_middle', '728x90', 1),
('Feed Bottom', 'Anuncio en la parte inferior del feed principal', 'feed_bottom', '728x90', 1),
('Sidebar Top', 'Anuncio en la barra lateral superior', 'sidebar_top', '300x250', 2),
('Sidebar Middle', 'Anuncio en la barra lateral media', 'sidebar_middle', '300x250', 2),
('Story Ad', 'Anuncio en formato story', 'story', '1080x1920', 1),
('Marketplace Top', 'Anuncio en la parte superior del marketplace', 'marketplace_top', '728x90', 1),
('Snippets Feed', 'Anuncio en el feed de snippets', 'snippets_feed', '300x400', 1);

INSERT INTO audience_segments (name, description, criteria, estimated_size) VALUES
('Dueños de Perros', 'Usuarios que tienen perros como mascotas', '{"pet_species": ["perro"]}', 5000),
('Dueños de Gatos', 'Usuarios que tienen gatos como mascotas', '{"pet_species": ["gato"]}', 3000),
('Mascotas Exóticas', 'Usuarios con mascotas exóticas', '{"pet_species": ["reptil", "ave", "exótica"]}', 800),
('Mascotas Pequeñas', 'Usuarios con mascotas pequeñas', '{"pet_species": ["roedor", "ave"]}', 1200),
('Nuevos Usuarios', 'Usuarios registrados en los últimos 30 días', '{"registration_date": "last_30_days"}', 2000),
('Usuarios Activos', 'Usuarios que han publicado en los últimos 7 días', '{"activity": "last_7_days"}', 4000),
('Interesados en Adopción', 'Usuarios que han visitado secciones de adopción', '{"interests": ["adopción"]}', 1500),
('Compradores Frecuentes', 'Usuarios que han realizado compras en el marketplace', '{"marketplace_activity": "buyers"}', 800);

-- Crear vistas útiles
CREATE OR REPLACE VIEW ads_with_stats AS
SELECT 
    a.*,
    COUNT(i.id) as impression_count,
    COUNT(c.id) as click_count,
    CASE 
        WHEN COUNT(i.id) > 0 THEN (COUNT(c.id)::DECIMAL / COUNT(i.id)::DECIMAL * 100)::DECIMAL(5,2)
        ELSE 0
    END as ctr_percentage,
    CASE 
        WHEN COUNT(i.id) > 0 THEN (a.total_spent / (COUNT(i.id)::DECIMAL / 1000))::DECIMAL(10,2)
        ELSE 0
    END as cpm_calculated
FROM ads a
LEFT JOIN ad_impressions i ON a.id = i.ad_id
LEFT JOIN ad_clicks c ON a.id = c.ad_id
GROUP BY a.id;

CREATE OR REPLACE VIEW active_ads_summary AS
SELECT 
    COUNT(*) as total_active_ads,
    SUM(budget_amount) as total_budget,
    AVG(bid_amount) as avg_bid_amount,
    SUM(total_impressions) as total_impressions,
    SUM(total_clicks) as total_clicks,
    SUM(total_spent) as total_spent
FROM ads 
WHERE status = 'active' 
    AND payment_status = 'paid'
    AND NOW() BETWEEN start_date AND end_date;

-- Comentarios para documentación
COMMENT ON TABLE ads IS 'Campañas publicitarias pagadas';
COMMENT ON TABLE ad_impressions IS 'Registro de impresiones de anuncios';
COMMENT ON TABLE ad_clicks IS 'Registro de clics en anuncios';
COMMENT ON TABLE audience_segments IS 'Segmentos de audiencia para targeting';
COMMENT ON TABLE ad_slots IS 'Posiciones publicitarias disponibles';
COMMENT ON TABLE ad_slot_assignments IS 'Asignación de anuncios a slots';
COMMENT ON TABLE ad_reports IS 'Reportes de anuncios inapropiados';
COMMENT ON TABLE ad_billing IS 'Facturación y pagos de anuncios';
