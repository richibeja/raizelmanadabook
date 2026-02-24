-- Migration: Sistema de Moderación y Administración
-- Fecha: 2024-01-XX
-- Descripción: Implementa sistema de reportes, moderación y administración

-- Tabla de reportes
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reported_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reported_post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    reported_message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
    reported_snippet_id UUID REFERENCES snippets(id) ON DELETE CASCADE,
    reported_ad_id UUID REFERENCES ads(id) ON DELETE CASCADE,
    report_type VARCHAR(50) NOT NULL CHECK (report_type IN (
        'spam', 'inappropriate', 'harassment', 'violence', 'fake_news', 
        'copyright', 'privacy', 'scam', 'other'
    )),
    reason TEXT NOT NULL,
    evidence_urls TEXT[], -- URLs de capturas o evidencia
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending', 'reviewing', 'resolved', 'dismissed'
    )),
    priority VARCHAR(20) NOT NULL DEFAULT 'normal' CHECK (priority IN (
        'low', 'normal', 'high', 'urgent'
    )),
    assigned_moderator_id UUID REFERENCES users(id),
    resolution_notes TEXT,
    action_taken VARCHAR(50) CHECK (action_taken IN (
        'warning', 'content_removal', 'temporary_ban', 'permanent_ban', 'no_action'
    )),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Tabla de acciones de moderación
CREATE TABLE IF NOT EXISTS moderation_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    moderator_id UUID NOT NULL REFERENCES users(id),
    target_user_id UUID NOT NULL REFERENCES users(id),
    action_type VARCHAR(50) NOT NULL CHECK (action_type IN (
        'warning', 'content_removal', 'temporary_ban', 'permanent_ban', 'unban'
    )),
    target_type VARCHAR(50) NOT NULL CHECK (target_type IN (
        'user', 'post', 'message', 'snippet', 'ad'
    )),
    target_id UUID, -- ID del contenido específico si aplica
    reason TEXT NOT NULL,
    duration_hours INTEGER, -- Para bans temporales
    evidence_urls TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de rate limiting
CREATE TABLE IF NOT EXISTS rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    action_type VARCHAR(50) NOT NULL CHECK (action_type IN (
        'post_create', 'comment_create', 'message_send', 'snippet_upload',
        'report_create', 'login_attempt', 'register_attempt'
    )),
    count INTEGER NOT NULL DEFAULT 1,
    window_start TIMESTAMP WITH TIME ZONE NOT NULL,
    window_end TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de configuración de rate limits
CREATE TABLE IF NOT EXISTS rate_limit_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action_type VARCHAR(50) UNIQUE NOT NULL,
    max_attempts INTEGER NOT NULL,
    window_minutes INTEGER NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de heurísticas anti-spam
CREATE TABLE IF NOT EXISTS spam_detection (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    content_hash VARCHAR(64) NOT NULL, -- Hash del contenido para detectar duplicados
    content_type VARCHAR(50) NOT NULL CHECK (content_type IN (
        'post', 'comment', 'message'
    )),
    spam_score DECIMAL(3,2) NOT NULL DEFAULT 0.0, -- 0.0 a 1.0
    flags TEXT[], -- ['repetitive', 'links', 'caps', 'emoji_spam']
    is_flagged BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de configuración de spam
CREATE TABLE IF NOT EXISTS spam_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_name VARCHAR(100) UNIQUE NOT NULL,
    rule_type VARCHAR(50) NOT NULL CHECK (rule_type IN (
        'keyword', 'pattern', 'frequency', 'content_analysis'
    )),
    rule_config JSONB NOT NULL,
    threshold DECIMAL(3,2) NOT NULL DEFAULT 0.7,
    action VARCHAR(50) NOT NULL DEFAULT 'flag' CHECK (action IN (
        'flag', 'auto_delete', 'require_moderation'
    )),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de logs de administración
CREATE TABLE IF NOT EXISTS admin_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50) NOT NULL,
    target_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_priority ON reports(priority);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at);
CREATE INDEX IF NOT EXISTS idx_reports_reporter_id ON reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_reports_reported_user_id ON reports(reported_user_id);

CREATE INDEX IF NOT EXISTS idx_moderation_actions_target_user_id ON moderation_actions(target_user_id);
CREATE INDEX IF NOT EXISTS idx_moderation_actions_created_at ON moderation_actions(created_at);

CREATE INDEX IF NOT EXISTS idx_rate_limits_user_action ON rate_limits(user_id, action_type);
CREATE INDEX IF NOT EXISTS idx_rate_limits_window ON rate_limits(window_start, window_end);

CREATE INDEX IF NOT EXISTS idx_spam_detection_user_id ON spam_detection(user_id);
CREATE INDEX IF NOT EXISTS idx_spam_detection_content_hash ON spam_detection(content_hash);
CREATE INDEX IF NOT EXISTS idx_spam_detection_flagged ON spam_detection(is_flagged);

CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_id ON admin_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON admin_logs(created_at);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rate_limits_updated_at BEFORE UPDATE ON rate_limits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_spam_config_updated_at BEFORE UPDATE ON spam_config
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Funciones para moderación

-- Función para crear un reporte
CREATE OR REPLACE FUNCTION create_report(
    p_reporter_id UUID,
    p_reported_user_id UUID DEFAULT NULL,
    p_reported_post_id UUID DEFAULT NULL,
    p_reported_message_id UUID DEFAULT NULL,
    p_reported_snippet_id UUID DEFAULT NULL,
    p_reported_ad_id UUID DEFAULT NULL,
    p_report_type VARCHAR(50),
    p_reason TEXT,
    p_evidence_urls TEXT[] DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
    v_report_id UUID;
    v_priority VARCHAR(20);
BEGIN
    -- Determinar prioridad basada en el tipo de reporte
    CASE p_report_type
        WHEN 'violence', 'harassment' THEN v_priority := 'urgent';
        WHEN 'scam', 'fake_news' THEN v_priority := 'high';
        WHEN 'spam', 'inappropriate' THEN v_priority := 'normal';
        ELSE v_priority := 'low';
    END CASE;

    INSERT INTO reports (
        reporter_id, reported_user_id, reported_post_id, reported_message_id,
        reported_snippet_id, reported_ad_id, report_type, reason, evidence_urls, priority
    ) VALUES (
        p_reporter_id, p_reported_user_id, p_reported_post_id, p_reported_message_id,
        p_reported_snippet_id, p_reported_ad_id, p_report_type, p_reason, p_evidence_urls, v_priority
    ) RETURNING id INTO v_report_id;

    RETURN v_report_id;
END;
$$ LANGUAGE plpgsql;

-- Función para verificar rate limits
CREATE OR REPLACE FUNCTION check_rate_limit(
    p_user_id UUID,
    p_action_type VARCHAR(50)
) RETURNS BOOLEAN AS $$
DECLARE
    v_config RECORD;
    v_current_count INTEGER;
    v_window_start TIMESTAMP WITH TIME ZONE;
    v_window_end TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Obtener configuración del rate limit
    SELECT * INTO v_config FROM rate_limit_config 
    WHERE action_type = p_action_type AND is_active = true;
    
    IF NOT FOUND THEN
        RETURN true; -- Sin límite configurado
    END IF;

    v_window_start := NOW() - INTERVAL '1 minute' * v_config.window_minutes;
    v_window_end := NOW();

    -- Contar intentos en la ventana de tiempo
    SELECT COALESCE(SUM(count), 0) INTO v_current_count
    FROM rate_limits
    WHERE user_id = p_user_id 
      AND action_type = p_action_type
      AND window_start >= v_window_start
      AND window_end <= v_window_end;

    -- Verificar si excede el límite
    IF v_current_count >= v_config.max_attempts THEN
        RETURN false; -- Límite excedido
    END IF;

    -- Registrar el intento
    INSERT INTO rate_limits (user_id, action_type, window_start, window_end)
    VALUES (p_user_id, p_action_type, v_window_start, v_window_end)
    ON CONFLICT (user_id, action_type, window_start, window_end)
    DO UPDATE SET count = rate_limits.count + 1, updated_at = NOW();

    RETURN true; -- Dentro del límite
END;
$$ LANGUAGE plpgsql;

-- Función para calcular spam score
CREATE OR REPLACE FUNCTION calculate_spam_score(
    p_content TEXT,
    p_user_id UUID
) RETURNS DECIMAL(3,2) AS $$
DECLARE
    v_score DECIMAL(3,2) := 0.0;
    v_recent_posts INTEGER;
    v_duplicate_content BOOLEAN;
    v_links_count INTEGER;
    v_caps_ratio DECIMAL(3,2);
BEGIN
    -- Contar posts recientes del usuario (últimas 24h)
    SELECT COUNT(*) INTO v_recent_posts
    FROM posts
    WHERE author_id = p_user_id 
      AND created_at >= NOW() - INTERVAL '24 hours';

    IF v_recent_posts > 10 THEN
        v_score := v_score + 0.3;
    END IF;

    -- Verificar contenido duplicado
    SELECT EXISTS(
        SELECT 1 FROM posts 
        WHERE author_id = p_user_id 
          AND content = p_content
          AND created_at >= NOW() - INTERVAL '7 days'
    ) INTO v_duplicate_content;

    IF v_duplicate_content THEN
        v_score := v_score + 0.4;
    END IF;

    -- Contar enlaces
    v_links_count := array_length(regexp_matches(p_content, 'https?://[^\s]+', 'g'), 1);
    IF v_links_count > 3 THEN
        v_score := v_score + 0.2;
    END IF;

    -- Calcular ratio de mayúsculas
    v_caps_ratio := LENGTH(regexp_replace(p_content, '[^A-Z]', '', 'g'))::DECIMAL / 
                    GREATEST(LENGTH(p_content), 1);
    IF v_caps_ratio > 0.7 THEN
        v_score := v_score + 0.2;
    END IF;

    RETURN LEAST(v_score, 1.0);
END;
$$ LANGUAGE plpgsql;

-- Función para obtener reportes pendientes
CREATE OR REPLACE FUNCTION get_pending_reports(
    p_limit INTEGER DEFAULT 50,
    p_offset INTEGER DEFAULT 0
) RETURNS TABLE (
    report_id UUID,
    reporter_name VARCHAR(255),
    reported_user_name VARCHAR(255),
    report_type VARCHAR(50),
    reason TEXT,
    priority VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE,
    content_preview TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.id,
        u1.name as reporter_name,
        u2.name as reported_user_name,
        r.report_type,
        r.reason,
        r.priority,
        r.created_at,
        CASE 
            WHEN r.reported_post_id IS NOT NULL THEN 
                (SELECT LEFT(content, 100) FROM posts WHERE id = r.reported_post_id)
            WHEN r.reported_message_id IS NOT NULL THEN 
                (SELECT LEFT(content, 100) FROM messages WHERE id = r.reported_message_id)
            ELSE 'N/A'
        END as content_preview
    FROM reports r
    LEFT JOIN users u1 ON r.reporter_id = u1.id
    LEFT JOIN users u2 ON r.reported_user_id = u2.id
    WHERE r.status = 'pending'
    ORDER BY 
        CASE r.priority
            WHEN 'urgent' THEN 1
            WHEN 'high' THEN 2
            WHEN 'normal' THEN 3
            WHEN 'low' THEN 4
        END,
        r.created_at ASC
    LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- Datos iniciales de configuración
INSERT INTO rate_limit_config (action_type, max_attempts, window_minutes) VALUES
    ('post_create', 10, 60),
    ('comment_create', 30, 60),
    ('message_send', 50, 60),
    ('snippet_upload', 5, 60),
    ('report_create', 5, 60),
    ('login_attempt', 5, 15),
    ('register_attempt', 3, 60)
ON CONFLICT (action_type) DO NOTHING;

INSERT INTO spam_config (rule_name, rule_type, rule_config, threshold, action) VALUES
    ('excessive_links', 'pattern', '{"pattern": "https?://[^\\s]+", "max_count": 3}', 0.7, 'flag'),
    ('all_caps', 'pattern', '{"pattern": "^[A-Z\\s]+$", "min_length": 10}', 0.8, 'flag'),
    ('repetitive_content', 'frequency', '{"time_window_hours": 24, "max_duplicates": 3}', 0.6, 'auto_delete'),
    ('emoji_spam', 'pattern', '{"pattern": "[\\u{1F600}-\\u{1F64F}]", "max_count": 10}', 0.7, 'flag')
ON CONFLICT (rule_name) DO NOTHING;

-- Datos de ejemplo para testing
INSERT INTO reports (reporter_id, reported_user_id, report_type, reason, priority) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'spam', 'Usuario publicando contenido repetitivo', 'normal'),
    ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', 'harassment', 'Comentarios ofensivos y acoso', 'urgent')
ON CONFLICT DO NOTHING;
