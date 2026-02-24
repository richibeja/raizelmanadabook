-- Migration: 009_realtime_messaging_schema.sql
-- Description: Sistema de mensajería en tiempo real y notificaciones
-- Date: 2024-01-15

-- Tabla de conversaciones (directas y grupales)
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(20) NOT NULL CHECK (type IN ('direct', 'group')),
    title VARCHAR(255),
    description TEXT,
    avatar_url TEXT,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Tabla de participantes de conversaciones
CREATE TABLE IF NOT EXISTS conversation_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    left_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    unread_count INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    UNIQUE(conversation_id, user_id)
);

-- Tabla de mensajes
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'video', 'audio', 'file', 'location', 'sticker')),
    media_urls TEXT[],
    reply_to_id UUID REFERENCES messages(id) ON DELETE SET NULL,
    edited_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Tabla de notificaciones en tiempo real
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    data JSONB DEFAULT '{}'::jsonb,
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    action_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Tabla de sesiones de WebSocket
CREATE TABLE IF NOT EXISTS websocket_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id VARCHAR(255) UNIQUE NOT NULL,
    socket_id VARCHAR(255),
    user_agent TEXT,
    ip_address INET,
    is_active BOOLEAN DEFAULT true,
    connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    disconnected_at TIMESTAMP WITH TIME ZONE,
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_conversations_type ON conversations(type);
CREATE INDEX IF NOT EXISTS idx_conversations_created_by ON conversations(created_by);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message ON conversations(last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_active ON conversations(is_active);

CREATE INDEX IF NOT EXISTS idx_conversation_participants_conversation ON conversation_participants(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_user ON conversation_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_active ON conversation_participants(is_active);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_last_read ON conversation_participants(last_read_at);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_type ON messages(message_type);
CREATE INDEX IF NOT EXISTS idx_messages_not_deleted ON messages(is_deleted) WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_expires ON notifications(expires_at) WHERE expires_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_websocket_sessions_user ON websocket_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_websocket_sessions_active ON websocket_sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_websocket_sessions_last_activity ON websocket_sessions(last_activity_at);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para marcar mensajes como leídos
CREATE OR REPLACE FUNCTION mark_conversation_as_read(
    p_conversation_id UUID,
    p_user_id UUID
)
RETURNS VOID AS $$
BEGIN
    UPDATE conversation_participants 
    SET last_read_at = NOW(), unread_count = 0
    WHERE conversation_id = p_conversation_id 
    AND user_id = p_user_id;
    
    -- Marcar notificaciones relacionadas como leídas
    UPDATE notifications 
    SET is_read = true, read_at = NOW()
    WHERE user_id = p_user_id 
    AND data->>'conversation_id' = p_conversation_id::text
    AND is_read = false;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener conversaciones de un usuario
CREATE OR REPLACE FUNCTION get_user_conversations(
    p_user_id UUID,
    p_limit INTEGER DEFAULT 20,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    conversation_id UUID,
    conversation_type VARCHAR(20),
    conversation_title VARCHAR(255),
    conversation_avatar TEXT,
    last_message_content TEXT,
    last_message_at TIMESTAMP WITH TIME ZONE,
    unread_count INTEGER,
    participant_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.type,
        c.title,
        c.avatar_url,
        m.content,
        c.last_message_at,
        cp.unread_count,
        COUNT(cp2.id)::INTEGER as participant_count
    FROM conversations c
    INNER JOIN conversation_participants cp ON c.id = cp.conversation_id
    LEFT JOIN conversation_participants cp2 ON c.id = cp2.conversation_id AND cp2.is_active = true
    LEFT JOIN messages m ON c.id = m.conversation_id AND m.id = (
        SELECT id FROM messages 
        WHERE conversation_id = c.id AND is_deleted = false 
        ORDER BY created_at DESC LIMIT 1
    )
    WHERE cp.user_id = p_user_id 
    AND cp.is_active = true
    AND c.is_active = true
    GROUP BY c.id, c.type, c.title, c.avatar_url, m.content, c.last_message_at, cp.unread_count
    ORDER BY c.last_message_at DESC
    LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener mensajes de una conversación
CREATE OR REPLACE FUNCTION get_conversation_messages(
    p_conversation_id UUID,
    p_limit INTEGER DEFAULT 50,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    message_id UUID,
    sender_id UUID,
    sender_name VARCHAR(255),
    sender_avatar TEXT,
    content TEXT,
    message_type VARCHAR(20),
    media_urls TEXT[],
    reply_to_id UUID,
    created_at TIMESTAMP WITH TIME ZONE,
    is_edited BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.id,
        m.sender_id,
        u.name,
        u.avatar_url,
        m.content,
        m.message_type,
        m.media_urls,
        m.reply_to_id,
        m.created_at,
        m.edited_at IS NOT NULL as is_edited
    FROM messages m
    INNER JOIN users u ON m.sender_id = u.id
    WHERE m.conversation_id = p_conversation_id 
    AND m.is_deleted = false
    ORDER BY m.created_at DESC
    LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- Función para crear notificación
CREATE OR REPLACE FUNCTION create_notification(
    p_user_id UUID,
    p_type VARCHAR(50),
    p_title VARCHAR(255),
    p_message TEXT DEFAULT NULL,
    p_data JSONB DEFAULT '{}'::jsonb,
    p_priority VARCHAR(20) DEFAULT 'normal',
    p_expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_action_url TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_notification_id UUID;
BEGIN
    INSERT INTO notifications (
        user_id, type, title, message, data, priority, expires_at, action_url
    ) VALUES (
        p_user_id, p_type, p_title, p_message, p_data, p_priority, p_expires_at, p_action_url
    ) RETURNING id INTO v_notification_id;
    
    RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql;

-- Datos iniciales para testing
INSERT INTO conversations (id, type, title, description, created_by) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'direct', NULL, NULL, '550e8400-e29b-41d4-a716-446655440001'),
    ('550e8400-e29b-41d4-a716-446655440002', 'group', 'Amantes de Perros', 'Grupo para compartir fotos de perros', '550e8400-e29b-41d4-a716-446655440001'),
    ('550e8400-e29b-41d4-a716-446655440003', 'group', 'Gatos Felices', 'Comunidad de gatos', '550e8400-e29b-41d4-a716-446655440002');

INSERT INTO conversation_participants (conversation_id, user_id, role) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'member'),
    ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'member'),
    ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'admin'),
    ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'member'),
    ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', 'member'),
    ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'admin'),
    ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'member');

INSERT INTO messages (conversation_id, sender_id, content, message_type) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '¡Hola! ¿Cómo está tu mascota?', 'text'),
    ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '¡Muy bien! Acaba de comer', 'text'),
    ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '¡Compartan fotos de sus perros!', 'text'),
    ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Aquí está mi golden retriever', 'text'),
    ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'Los gatos son los mejores', 'text');

INSERT INTO notifications (user_id, type, title, message, data) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'message', 'Nuevo mensaje', 'Tienes un nuevo mensaje de Juan', '{"conversation_id": "550e8400-e29b-41d4-a716-446655440001"}'),
    ('550e8400-e29b-41d4-a716-446655440002', 'group_invite', 'Invitación a grupo', 'Te invitaron al grupo "Amantes de Perros"', '{"group_id": "550e8400-e29b-41d4-a716-446655440002"}'),
    ('550e8400-e29b-41d4-a716-446655440003', 'like', 'Nuevo like', 'A María le gustó tu foto', '{"post_id": "550e8400-e29b-41d4-a716-446655440001"}');

-- Vistas útiles
CREATE OR REPLACE VIEW conversations_summary AS
SELECT 
    c.id,
    c.type,
    c.title,
    c.avatar_url,
    c.created_by,
    c.last_message_at,
    c.is_active,
    COUNT(cp.id) as participant_count,
    COUNT(CASE WHEN cp.unread_count > 0 THEN 1 END) as conversations_with_unread
FROM conversations c
LEFT JOIN conversation_participants cp ON c.id = cp.conversation_id AND cp.is_active = true
GROUP BY c.id, c.type, c.title, c.avatar_url, c.created_by, c.last_message_at, c.is_active;

CREATE OR REPLACE VIEW unread_notifications_count AS
SELECT 
    user_id,
    COUNT(*) as unread_count,
    COUNT(CASE WHEN priority = 'urgent' THEN 1 END) as urgent_count
FROM notifications 
WHERE is_read = false 
AND (expires_at IS NULL OR expires_at > NOW())
GROUP BY user_id;
