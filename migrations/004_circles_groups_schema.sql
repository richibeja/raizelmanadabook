-- =====================================================
-- MIGRACIÓN 004: Sistema de Grupos (Circles)
-- =====================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLA: circles (Grupos temáticos)
-- =====================================================
CREATE TABLE IF NOT EXISTS circles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    avatar_url TEXT,
    cover_url TEXT,
    type VARCHAR(20) DEFAULT 'public' CHECK (type IN ('public', 'private', 'secret')),
    category VARCHAR(50) NOT NULL,
    location VARCHAR(255),
    tags TEXT[],
    rules TEXT,
    admin_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    moderator_ids UUID[] DEFAULT '{}',
    member_count INTEGER DEFAULT 0,
    post_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deleted')),
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: circle_members (Miembros de grupos)
-- =====================================================
CREATE TABLE IF NOT EXISTS circle_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    circle_id UUID NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'muted', 'banned')),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    invited_by UUID REFERENCES users(id),
    invited_at TIMESTAMP,
    accepted_at TIMESTAMP,
    UNIQUE(circle_id, user_id)
);

-- =====================================================
-- TABLA: circle_invites (Invitaciones a grupos)
-- =====================================================
CREATE TABLE IF NOT EXISTS circle_invites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    circle_id UUID NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
    inviter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    invitee_email VARCHAR(255) NOT NULL,
    invitee_user_id UUID REFERENCES users(id),
    message TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    accepted_at TIMESTAMP,
    declined_at TIMESTAMP
);

-- =====================================================
-- TABLA: circle_posts (Posts específicos de grupos)
-- =====================================================
CREATE TABLE IF NOT EXISTS circle_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    circle_id UUID NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_announcement BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(circle_id, post_id)
);

-- =====================================================
-- TABLA: circle_categories (Categorías de grupos)
-- =====================================================
CREATE TABLE IF NOT EXISTS circle_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(7),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================

-- Índices para circles
CREATE INDEX IF NOT EXISTS idx_circles_slug ON circles(slug);
CREATE INDEX IF NOT EXISTS idx_circles_type ON circles(type);
CREATE INDEX IF NOT EXISTS idx_circles_category ON circles(category);
CREATE INDEX IF NOT EXISTS idx_circles_location ON circles(location);
CREATE INDEX IF NOT EXISTS idx_circles_admin_id ON circles(admin_id);
CREATE INDEX IF NOT EXISTS idx_circles_status ON circles(status);
CREATE INDEX IF NOT EXISTS idx_circles_is_featured ON circles(is_featured);
CREATE INDEX IF NOT EXISTS idx_circles_created_at ON circles(created_at);
CREATE INDEX IF NOT EXISTS idx_circles_member_count ON circles(member_count);

-- Índices para circle_members
CREATE INDEX IF NOT EXISTS idx_circle_members_circle_id ON circle_members(circle_id);
CREATE INDEX IF NOT EXISTS idx_circle_members_user_id ON circle_members(user_id);
CREATE INDEX IF NOT EXISTS idx_circle_members_role ON circle_members(role);
CREATE INDEX IF NOT EXISTS idx_circle_members_status ON circle_members(status);
CREATE INDEX IF NOT EXISTS idx_circle_members_joined_at ON circle_members(joined_at);

-- Índices para circle_invites
CREATE INDEX IF NOT EXISTS idx_circle_invites_circle_id ON circle_invites(circle_id);
CREATE INDEX IF NOT EXISTS idx_circle_invites_inviter_id ON circle_invites(inviter_id);
CREATE INDEX IF NOT EXISTS idx_circle_invites_invitee_email ON circle_invites(invitee_email);
CREATE INDEX IF NOT EXISTS idx_circle_invites_invitee_user_id ON circle_invites(invitee_user_id);
CREATE INDEX IF NOT EXISTS idx_circle_invites_status ON circle_invites(status);
CREATE INDEX IF NOT EXISTS idx_circle_invites_expires_at ON circle_invites(expires_at);

-- Índices para circle_posts
CREATE INDEX IF NOT EXISTS idx_circle_posts_circle_id ON circle_posts(circle_id);
CREATE INDEX IF NOT EXISTS idx_circle_posts_post_id ON circle_posts(post_id);
CREATE INDEX IF NOT EXISTS idx_circle_posts_is_pinned ON circle_posts(is_pinned);
CREATE INDEX IF NOT EXISTS idx_circle_posts_is_announcement ON circle_posts(is_announcement);

-- Índices para circle_categories
CREATE INDEX IF NOT EXISTS idx_circle_categories_name ON circle_categories(name);
CREATE INDEX IF NOT EXISTS idx_circle_categories_is_active ON circle_categories(is_active);
CREATE INDEX IF NOT EXISTS idx_circle_categories_sort_order ON circle_categories(sort_order);

-- =====================================================
-- FUNCIONES Y TRIGGERS
-- =====================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_circles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para updated_at en circles
CREATE TRIGGER update_circles_updated_at BEFORE UPDATE ON circles
    FOR EACH ROW EXECUTE FUNCTION update_circles_updated_at();

-- Función para actualizar contadores de miembros
CREATE OR REPLACE FUNCTION update_circle_member_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE circles 
        SET member_count = member_count + 1 
        WHERE id = NEW.circle_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE circles 
        SET member_count = member_count - 1 
        WHERE id = OLD.circle_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Triggers para contadores de miembros
CREATE TRIGGER update_circle_member_count_insert
    AFTER INSERT ON circle_members
    FOR EACH ROW EXECUTE FUNCTION update_circle_member_count();

CREATE TRIGGER update_circle_member_count_delete
    AFTER DELETE ON circle_members
    FOR EACH ROW EXECUTE FUNCTION update_circle_member_count();

-- Función para actualizar contadores de posts
CREATE OR REPLACE FUNCTION update_circle_post_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE circles 
        SET post_count = post_count + 1 
        WHERE id = NEW.circle_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE circles 
        SET post_count = post_count - 1 
        WHERE id = OLD.circle_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Triggers para contadores de posts
CREATE TRIGGER update_circle_post_count_insert
    AFTER INSERT ON circle_posts
    FOR EACH ROW EXECUTE FUNCTION update_circle_post_count();

CREATE TRIGGER update_circle_post_count_delete
    AFTER DELETE ON circle_posts
    FOR EACH ROW EXECUTE FUNCTION update_circle_post_count();

-- Función para limpiar invitaciones expiradas
CREATE OR REPLACE FUNCTION cleanup_expired_circle_invites()
RETURNS void AS $$
BEGIN
    UPDATE circle_invites 
    SET status = 'expired' 
    WHERE expires_at < CURRENT_TIMESTAMP AND status = 'pending';
END;
$$ language 'plpgsql';

-- =====================================================
-- VISTAS ÚTILES
-- =====================================================

-- Vista de círculos con estadísticas
CREATE OR REPLACE VIEW circles_with_stats AS
SELECT 
    c.*,
    COUNT(DISTINCT cm.id) as actual_member_count,
    COUNT(DISTINCT cp.id) as actual_post_count,
    u.username as admin_username,
    u.first_name as admin_first_name,
    u.last_name as admin_last_name,
    u.avatar_url as admin_avatar_url
FROM circles c
LEFT JOIN circle_members cm ON c.id = cm.circle_id AND cm.status = 'active'
LEFT JOIN circle_posts cp ON c.id = cp.circle_id
LEFT JOIN users u ON c.admin_id = u.id
WHERE c.status = 'active'
GROUP BY c.id, u.username, u.first_name, u.last_name, u.avatar_url;

-- Vista de círculos públicos para descubrimiento
CREATE OR REPLACE VIEW public_circles AS
SELECT 
    id,
    name,
    slug,
    description,
    avatar_url,
    cover_url,
    type,
    category,
    location,
    tags,
    member_count,
    post_count,
    is_featured,
    is_verified,
    created_at
FROM circles_with_stats
WHERE type = 'public' AND status = 'active';

-- Vista de miembros de círculos con información de usuario
CREATE OR REPLACE VIEW circle_members_with_users AS
SELECT 
    cm.*,
    u.username,
    u.first_name,
    u.last_name,
    u.avatar_url,
    u.bio,
    u.location
FROM circle_members cm
JOIN users u ON cm.user_id = u.id
WHERE cm.status = 'active' AND u.status = 'active';

-- =====================================================
-- DATOS INICIALES
-- =====================================================

-- Insertar categorías de círculos
INSERT INTO circle_categories (name, description, icon, color, sort_order) VALUES
('Mascotas', 'Grupos para todo tipo de mascotas', '🐾', '#FF6B6B', 1),
('Perros', 'Comunidades específicas para perros', '🐕', '#4ECDC4', 2),
('Gatos', 'Comunidades específicas para gatos', '🐱', '#45B7D1', 3),
('Aves', 'Comunidades para aves y pájaros', '🦜', '#96CEB4', 4),
('Peces', 'Comunidades para peces y acuarios', '🐠', '#FFEAA7', 5),
('Reptiles', 'Comunidades para reptiles y anfibios', '🦎', '#DDA0DD', 6),
('Roedores', 'Comunidades para hamsters, conejos, etc.', '🐹', '#98D8C8', 7),
('Caballos', 'Comunidades para caballos y equinos', '🐎', '#F7DC6F', 8),
('Adopción', 'Grupos de adopción y rescate', '🏠', '#BB8FCE', 9),
('Salud', 'Grupos sobre salud y veterinaria', '🏥', '#85C1E9', 10),
('Entrenamiento', 'Grupos sobre entrenamiento y comportamiento', '🎾', '#F8C471', 11),
('Eventos', 'Grupos para eventos y meetups', '🎉', '#F1948A', 12),
('Comercio', 'Grupos de compra y venta', '🛒', '#82E0AA', 13),
('Otros', 'Otros tipos de grupos', '🌟', '#FAD7A0', 14)
ON CONFLICT (name) DO NOTHING;

-- Insertar círculos de ejemplo
INSERT INTO circles (
    name, 
    slug, 
    description, 
    category, 
    type, 
    admin_id,
    tags,
    rules,
    is_featured
) VALUES 
(
    'Amantes de Perros',
    'amantes-de-perros',
    'Comunidad para todos los amantes de los perros. Comparte fotos, consejos y experiencias.',
    'Perros',
    'public',
    (SELECT id FROM users WHERE username = 'admin' LIMIT 1),
    ARRAY['perros', 'mascotas', 'comunidad'],
    '1. Respeta a todos los miembros\n2. No spam\n3. Mantén el contenido apropiado\n4. Comparte solo fotos de tus propios perros',
    TRUE
),
(
    'Gatos de la Ciudad',
    'gatos-de-la-ciudad',
    'Para los gatos urbanos y sus humanos. Consejos para gatos de apartamento.',
    'Gatos',
    'public',
    (SELECT id FROM users WHERE username = 'admin' LIMIT 1),
    ARRAY['gatos', 'urbano', 'apartamento'],
    '1. Solo contenido relacionado con gatos\n2. No promoción comercial sin autorización\n3. Mantén un ambiente positivo',
    FALSE
),
(
    'Adopción Responsable',
    'adopcion-responsable',
    'Grupo para promover la adopción responsable de mascotas.',
    'Adopción',
    'public',
    (SELECT id FROM users WHERE username = 'admin' LIMIT 1),
    ARRAY['adopción', 'rescate', 'responsabilidad'],
    '1. Solo publicaciones de adopción reales\n2. Información completa de la mascota\n3. Seguimiento post-adopción',
    TRUE
)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- COMENTARIOS
-- =====================================================

COMMENT ON TABLE circles IS 'Tabla principal de grupos temáticos (círculos)';
COMMENT ON TABLE circle_members IS 'Miembros de cada círculo con sus roles';
COMMENT ON TABLE circle_invites IS 'Invitaciones pendientes a círculos';
COMMENT ON TABLE circle_posts IS 'Posts específicos publicados en círculos';
COMMENT ON TABLE circle_categories IS 'Categorías para organizar los círculos';

COMMENT ON COLUMN circles.settings IS 'JSON con configuraciones específicas del círculo';
COMMENT ON COLUMN circles.tags IS 'Array de etiquetas para búsqueda y categorización';
COMMENT ON COLUMN circles.moderator_ids IS 'Array de IDs de moderadores del círculo';
COMMENT ON COLUMN circle_members.role IS 'Rol del usuario en el círculo (admin/moderator/member)';
COMMENT ON COLUMN circle_invites.invitee_email IS 'Email de la persona invitada (puede no estar registrada)';
