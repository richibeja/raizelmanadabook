-- =====================================================
-- MIGRACIÓN 005: Sistema de Moments (Estados Efímeros)
-- =====================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLA: moments (Estados efímeros)
-- =====================================================
CREATE TABLE IF NOT EXISTS moments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('image', 'video', 'text')),
    content TEXT,
    media_url TEXT,
    media_thumbnail_url TEXT,
    media_duration INTEGER, -- duración en segundos para videos
    background_color VARCHAR(7) DEFAULT '#000000',
    text_color VARCHAR(7) DEFAULT '#FFFFFF',
    font_family VARCHAR(50) DEFAULT 'Inter',
    font_size INTEGER DEFAULT 24,
    text_position VARCHAR(20) DEFAULT 'center' CHECK (text_position IN ('top', 'center', 'bottom')),
    filters JSONB DEFAULT '{}',
    location VARCHAR(255),
    is_public BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: moment_views (Vistas de momentos)
-- =====================================================
CREATE TABLE IF NOT EXISTS moment_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    moment_id UUID NOT NULL REFERENCES moments(id) ON DELETE CASCADE,
    viewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    view_duration INTEGER, -- duración de la vista en segundos
    UNIQUE(moment_id, viewer_id)
);

-- =====================================================
-- TABLA: moment_reactions (Reacciones a momentos)
-- =====================================================
CREATE TABLE IF NOT EXISTS moment_reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    moment_id UUID NOT NULL REFERENCES moments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reaction_type VARCHAR(20) NOT NULL CHECK (reaction_type IN ('like', 'love', 'laugh', 'wow', 'sad', 'angry')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(moment_id, user_id)
);

-- =====================================================
-- TABLA: moment_replies (Respuestas a momentos)
-- =====================================================
CREATE TABLE IF NOT EXISTS moment_replies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    moment_id UUID NOT NULL REFERENCES moments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    media_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: moment_mentions (Menciones en momentos)
-- =====================================================
CREATE TABLE IF NOT EXISTS moment_mentions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    moment_id UUID NOT NULL REFERENCES moments(id) ON DELETE CASCADE,
    mentioned_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mentioned_pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
    mention_type VARCHAR(20) NOT NULL CHECK (mention_type IN ('user', 'pet')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: moment_hashtags (Hashtags en momentos)
-- =====================================================
CREATE TABLE IF NOT EXISTS moment_hashtags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    moment_id UUID NOT NULL REFERENCES moments(id) ON DELETE CASCADE,
    hashtag VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(moment_id, hashtag)
);

-- =====================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================

-- Índices para moments
CREATE INDEX IF NOT EXISTS idx_moments_user_id ON moments(user_id);
CREATE INDEX IF NOT EXISTS idx_moments_pet_id ON moments(pet_id);
CREATE INDEX IF NOT EXISTS idx_moments_type ON moments(type);
CREATE INDEX IF NOT EXISTS idx_moments_is_public ON moments(is_public);
CREATE INDEX IF NOT EXISTS idx_moments_expires_at ON moments(expires_at);
CREATE INDEX IF NOT EXISTS idx_moments_created_at ON moments(created_at);
CREATE INDEX IF NOT EXISTS idx_moments_location ON moments(location);

-- Índices para moment_views
CREATE INDEX IF NOT EXISTS idx_moment_views_moment_id ON moment_views(moment_id);
CREATE INDEX IF NOT EXISTS idx_moment_views_viewer_id ON moment_views(viewer_id);
CREATE INDEX IF NOT EXISTS idx_moment_views_viewed_at ON moment_views(viewed_at);

-- Índices para moment_reactions
CREATE INDEX IF NOT EXISTS idx_moment_reactions_moment_id ON moment_reactions(moment_id);
CREATE INDEX IF NOT EXISTS idx_moment_reactions_user_id ON moment_reactions(user_id);
CREATE INDEX IF NOT EXISTS idx_moment_reactions_type ON moment_reactions(reaction_type);

-- Índices para moment_replies
CREATE INDEX IF NOT EXISTS idx_moment_replies_moment_id ON moment_replies(moment_id);
CREATE INDEX IF NOT EXISTS idx_moment_replies_user_id ON moment_replies(user_id);
CREATE INDEX IF NOT EXISTS idx_moment_replies_created_at ON moment_replies(created_at);

-- Índices para moment_mentions
CREATE INDEX IF NOT EXISTS idx_moment_mentions_moment_id ON moment_mentions(moment_id);
CREATE INDEX IF NOT EXISTS idx_moment_mentions_mentioned_user_id ON moment_mentions(mentioned_user_id);
CREATE INDEX IF NOT EXISTS idx_moment_mentions_mentioned_pet_id ON moment_mentions(mentioned_pet_id);

-- Índices para moment_hashtags
CREATE INDEX IF NOT EXISTS idx_moment_hashtags_moment_id ON moment_hashtags(moment_id);
CREATE INDEX IF NOT EXISTS idx_moment_hashtags_hashtag ON moment_hashtags(hashtag);

-- =====================================================
-- FUNCIONES Y TRIGGERS
-- =====================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_moments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para updated_at en moments
CREATE TRIGGER update_moments_updated_at BEFORE UPDATE ON moments
    FOR EACH ROW EXECUTE FUNCTION update_moments_updated_at();

-- Función para limpiar momentos expirados
CREATE OR REPLACE FUNCTION cleanup_expired_moments()
RETURNS void AS $$
BEGIN
    DELETE FROM moment_views WHERE moment_id IN (
        SELECT id FROM moments WHERE expires_at < CURRENT_TIMESTAMP
    );
    DELETE FROM moment_reactions WHERE moment_id IN (
        SELECT id FROM moments WHERE expires_at < CURRENT_TIMESTAMP
    );
    DELETE FROM moment_replies WHERE moment_id IN (
        SELECT id FROM moments WHERE expires_at < CURRENT_TIMESTAMP
    );
    DELETE FROM moment_mentions WHERE moment_id IN (
        SELECT id FROM moments WHERE expires_at < CURRENT_TIMESTAMP
    );
    DELETE FROM moment_hashtags WHERE moment_id IN (
        SELECT id FROM moments WHERE expires_at < CURRENT_TIMESTAMP
    );
    DELETE FROM moments WHERE expires_at < CURRENT_TIMESTAMP;
END;
$$ language 'plpgsql';

-- Función para extraer hashtags del contenido
CREATE OR REPLACE FUNCTION extract_hashtags(content TEXT)
RETURNS TEXT[] AS $$
DECLARE
    hashtags TEXT[];
    hashtag TEXT;
BEGIN
    hashtags := ARRAY[]::TEXT[];
    
    -- Buscar hashtags en el contenido (patrón #palabra)
    FOR hashtag IN 
        SELECT DISTINCT regexp_matches(content, '#([a-zA-Z0-9_]+)', 'g')
    LOOP
        hashtags := array_append(hashtags, hashtag);
    END LOOP;
    
    RETURN hashtags;
END;
$$ language 'plpgsql';

-- Función para extraer menciones del contenido
CREATE OR REPLACE FUNCTION extract_mentions(content TEXT)
RETURNS TEXT[] AS $$
DECLARE
    mentions TEXT[];
    mention TEXT;
BEGIN
    mentions := ARRAY[]::TEXT[];
    
    -- Buscar menciones en el contenido (patrón @usuario)
    FOR mention IN 
        SELECT DISTINCT regexp_matches(content, '@([a-zA-Z0-9_]+)', 'g')
    LOOP
        mentions := array_append(mentions, mention);
    END LOOP;
    
    RETURN mentions;
END;
$$ language 'plpgsql';

-- =====================================================
-- VISTAS ÚTILES
-- =====================================================

-- Vista de momentos activos con estadísticas
CREATE OR REPLACE VIEW active_moments_with_stats AS
SELECT 
    m.*,
    u.username as user_username,
    u.first_name as user_first_name,
    u.last_name as user_last_name,
    u.avatar_url as user_avatar_url,
    p.name as pet_name,
    p.species as pet_species,
    p.avatar_url as pet_avatar_url,
    COUNT(DISTINCT mv.id) as views_count,
    COUNT(DISTINCT mr.id) as reactions_count,
    COUNT(DISTINCT mrep.id) as replies_count,
    ARRAY_AGG(DISTINCT mh.hashtag) FILTER (WHERE mh.hashtag IS NOT NULL) as hashtags
FROM moments m
JOIN users u ON m.user_id = u.id
LEFT JOIN pets p ON m.pet_id = p.id
LEFT JOIN moment_views mv ON m.id = mv.moment_id
LEFT JOIN moment_reactions mr ON m.id = mr.moment_id
LEFT JOIN moment_replies mrep ON m.id = mrep.moment_id
LEFT JOIN moment_hashtags mh ON m.id = mh.moment_id
WHERE m.expires_at > CURRENT_TIMESTAMP
GROUP BY m.id, u.username, u.first_name, u.last_name, u.avatar_url, p.name, p.species, p.avatar_url;

-- Vista de momentos públicos para feed
CREATE OR REPLACE VIEW public_moments_feed AS
SELECT 
    id,
    user_id,
    pet_id,
    type,
    content,
    media_url,
    media_thumbnail_url,
    media_duration,
    background_color,
    text_color,
    font_family,
    font_size,
    text_position,
    filters,
    location,
    expires_at,
    created_at,
    user_username,
    user_first_name,
    user_last_name,
    user_avatar_url,
    pet_name,
    pet_species,
    pet_avatar_url,
    views_count,
    reactions_count,
    replies_count,
    hashtags
FROM active_moments_with_stats
WHERE is_public = TRUE
ORDER BY created_at DESC;

-- Vista de momentos de usuarios seguidos
CREATE OR REPLACE VIEW followed_moments_feed AS
SELECT 
    m.*,
    u.username as user_username,
    u.first_name as user_first_name,
    u.last_name as user_last_name,
    u.avatar_url as user_avatar_url,
    p.name as pet_name,
    p.species as pet_species,
    p.avatar_url as pet_avatar_url,
    COUNT(DISTINCT mv.id) as views_count,
    COUNT(DISTINCT mr.id) as reactions_count,
    COUNT(DISTINCT mrep.id) as replies_count,
    ARRAY_AGG(DISTINCT mh.hashtag) FILTER (WHERE mh.hashtag IS NOT NULL) as hashtags
FROM moments m
JOIN users u ON m.user_id = u.id
LEFT JOIN pets p ON m.pet_id = p.id
LEFT JOIN user_follows uf ON m.user_id = uf.followee_id
LEFT JOIN moment_views mv ON m.id = mv.moment_id
LEFT JOIN moment_reactions mr ON m.id = mr.moment_id
LEFT JOIN moment_replies mrep ON m.id = mrep.moment_id
LEFT JOIN moment_hashtags mh ON m.id = mh.moment_id
WHERE m.expires_at > CURRENT_TIMESTAMP 
  AND uf.follower_id = :current_user_id 
  AND uf.status = 'accepted'
GROUP BY m.id, u.username, u.first_name, u.last_name, u.avatar_url, p.name, p.species, p.avatar_url
ORDER BY m.created_at DESC;

-- =====================================================
-- DATOS INICIALES
-- =====================================================

-- Insertar momentos de ejemplo (se expiran en 24 horas)
INSERT INTO moments (
    user_id,
    pet_id,
    type,
    content,
    media_url,
    background_color,
    text_color,
    location,
    expires_at
) VALUES 
(
    (SELECT id FROM users WHERE username = 'admin' LIMIT 1),
    (SELECT id FROM pets LIMIT 1),
    'text',
    '¡Hola ManadaBook! 🐾 Mi mascota está muy feliz hoy',
    NULL,
    '#FF6B6B',
    '#FFFFFF',
    'Madrid, España',
    CURRENT_TIMESTAMP + INTERVAL '24 hours'
),
(
    (SELECT id FROM users WHERE username = 'admin' LIMIT 1),
    (SELECT id FROM pets LIMIT 1),
    'image',
    'Paseo matutino con mi mejor amigo 🐕',
    'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=600&fit=crop',
    '#4ECDC4',
    '#FFFFFF',
    'Barcelona, España',
    CURRENT_TIMESTAMP + INTERVAL '24 hours'
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- COMENTARIOS
-- =====================================================

COMMENT ON TABLE moments IS 'Estados efímeros (Moments) que expiran en 24 horas';
COMMENT ON TABLE moment_views IS 'Registro de vistas de momentos';
COMMENT ON TABLE moment_reactions IS 'Reacciones a momentos (like, love, etc.)';
COMMENT ON TABLE moment_replies IS 'Respuestas a momentos';
COMMENT ON TABLE moment_mentions IS 'Menciones de usuarios o mascotas en momentos';
COMMENT ON TABLE moment_hashtags IS 'Hashtags extraídos de momentos';

COMMENT ON COLUMN moments.filters IS 'JSON con filtros aplicados a la imagen/video';
COMMENT ON COLUMN moments.media_duration IS 'Duración del video en segundos';
COMMENT ON COLUMN moment_views.view_duration IS 'Tiempo que el usuario vio el momento';
COMMENT ON COLUMN moment_reactions.reaction_type IS 'Tipo de reacción (like, love, laugh, wow, sad, angry)';
