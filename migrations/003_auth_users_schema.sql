-- =====================================================
-- MIGRACIÓN 003: Sistema de Autenticación y Perfiles
-- =====================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- TABLA: users (Usuarios del sistema)
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    location VARCHAR(255),
    website VARCHAR(255),
    date_of_birth DATE,
    gender VARCHAR(20) CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
    is_verified BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT TRUE,
    email_verified_at TIMESTAMP,
    phone_verified_at TIMESTAMP,
    last_login_at TIMESTAMP,
    login_count INTEGER DEFAULT 0,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin', 'business')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'banned', 'deleted')),
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: user_sessions (Sesiones de usuario)
-- =====================================================
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    refresh_token_hash VARCHAR(255) NOT NULL,
    device_info JSONB,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: user_follows (Seguimientos entre usuarios)
-- =====================================================
CREATE TABLE IF NOT EXISTS user_follows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    followee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'accepted' CHECK (status IN ('pending', 'accepted', 'blocked')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(follower_id, followee_id)
);

-- =====================================================
-- TABLA: user_verification_tokens (Tokens de verificación)
-- =====================================================
CREATE TABLE IF NOT EXISTS user_verification_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('email', 'phone', 'password_reset')),
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: user_notifications (Preferencias de notificaciones)
-- =====================================================
CREATE TABLE IF NOT EXISTS user_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    email_enabled BOOLEAN DEFAULT TRUE,
    push_enabled BOOLEAN DEFAULT TRUE,
    in_app_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, type)
);

-- =====================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================

-- Índices para users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_location ON users(location);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Índices para user_sessions
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token_hash ON user_sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);

-- Índices para user_follows
CREATE INDEX IF NOT EXISTS idx_user_follows_follower_id ON user_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_followee_id ON user_follows(followee_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_status ON user_follows(status);

-- Índices para user_verification_tokens
CREATE INDEX IF NOT EXISTS idx_user_verification_tokens_user_id ON user_verification_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_user_verification_tokens_token_hash ON user_verification_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_user_verification_tokens_type ON user_verification_tokens(type);
CREATE INDEX IF NOT EXISTS idx_user_verification_tokens_expires_at ON user_verification_tokens(expires_at);

-- Índices para user_notifications
CREATE INDEX IF NOT EXISTS idx_user_notifications_user_id ON user_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notifications_type ON user_notifications(type);

-- =====================================================
-- FUNCIONES Y TRIGGERS
-- =====================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_follows_updated_at BEFORE UPDATE ON user_follows
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_notifications_updated_at BEFORE UPDATE ON user_notifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para limpiar sesiones expiradas
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM user_sessions WHERE expires_at < CURRENT_TIMESTAMP;
END;
$$ language 'plpgsql';

-- Función para limpiar tokens de verificación expirados
CREATE OR REPLACE FUNCTION cleanup_expired_verification_tokens()
RETURNS void AS $$
BEGIN
    DELETE FROM user_verification_tokens WHERE expires_at < CURRENT_TIMESTAMP;
END;
$$ language 'plpgsql';

-- =====================================================
-- VISTAS ÚTILES
-- =====================================================

-- Vista de usuarios con estadísticas
CREATE OR REPLACE VIEW users_with_stats AS
SELECT 
    u.*,
    COUNT(DISTINCT f1.id) as followers_count,
    COUNT(DISTINCT f2.id) as following_count,
    COUNT(DISTINCT p.id) as posts_count,
    COUNT(DISTINCT pe.id) as pets_count
FROM users u
LEFT JOIN user_follows f1 ON u.id = f1.followee_id AND f1.status = 'accepted'
LEFT JOIN user_follows f2 ON u.id = f2.follower_id AND f2.status = 'accepted'
LEFT JOIN posts p ON u.id = p.author_id
LEFT JOIN pets pe ON u.id = pe.owner_id
WHERE u.status = 'active'
GROUP BY u.id;

-- Vista de usuarios públicos para búsqueda
CREATE OR REPLACE VIEW public_users AS
SELECT 
    id,
    username,
    first_name,
    last_name,
    avatar_url,
    bio,
    location,
    followers_count,
    following_count,
    posts_count,
    pets_count,
    created_at
FROM users_with_stats
WHERE is_public = TRUE AND status = 'active';

-- =====================================================
-- DATOS INICIALES
-- =====================================================

-- Insertar usuario administrador por defecto
INSERT INTO users (
    username, 
    email, 
    password_hash, 
    first_name, 
    last_name, 
    role, 
    is_verified,
    bio
) VALUES (
    'admin',
    'admin@manadabook.com',
    crypt('admin123', gen_salt('bf')),
    'Administrador',
    'ManadaBook',
    'admin',
    TRUE,
    'Administrador del sistema ManadaBook'
) ON CONFLICT (username) DO NOTHING;

-- Insertar preferencias de notificaciones por defecto
INSERT INTO user_notifications (user_id, type, email_enabled, push_enabled, in_app_enabled)
SELECT 
    u.id,
    unnest(ARRAY[
        'new_follower',
        'new_post',
        'new_comment',
        'new_like',
        'new_message',
        'circle_invite',
        'marketplace_order',
        'system_announcement'
    ])
FROM users u
WHERE u.role = 'user'
ON CONFLICT (user_id, type) DO NOTHING;

-- =====================================================
-- COMENTARIOS
-- =====================================================

COMMENT ON TABLE users IS 'Tabla principal de usuarios del sistema';
COMMENT ON TABLE user_sessions IS 'Sesiones activas de usuarios para JWT';
COMMENT ON TABLE user_follows IS 'Relaciones de seguimiento entre usuarios';
COMMENT ON TABLE user_verification_tokens IS 'Tokens para verificación de email/phone';
COMMENT ON TABLE user_notifications IS 'Preferencias de notificaciones por usuario';

COMMENT ON COLUMN users.preferences IS 'JSON con preferencias del usuario (tema, idioma, etc.)';
COMMENT ON COLUMN user_sessions.device_info IS 'JSON con información del dispositivo';
COMMENT ON COLUMN user_sessions.ip_address IS 'IP del dispositivo para seguridad';
