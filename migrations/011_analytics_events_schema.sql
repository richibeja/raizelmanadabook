-- Migration: Analytics Events Schema
-- Description: Sistema de tracking de eventos y métricas para analytics
-- Date: 2024-12-19

-- Tabla principal de eventos de analytics
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id VARCHAR(255),
    event_type VARCHAR(100) NOT NULL,
    event_category VARCHAR(50) NOT NULL,
    event_data JSONB,
    page_url VARCHAR(500),
    referrer VARCHAR(500),
    user_agent TEXT,
    ip_address INET,
    device_type VARCHAR(20),
    location_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    INDEXED (event_type, event_category, created_at),
    INDEXED (user_id, created_at),
    INDEXED (session_id, created_at)
);

-- Tabla de métricas agregadas (para performance)
CREATE TABLE IF NOT EXISTS analytics_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,2) NOT NULL,
    metric_unit VARCHAR(20),
    dimension_key VARCHAR(100),
    dimension_value VARCHAR(255),
    date_bucket DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (metric_name, dimension_key, dimension_value, date_bucket)
);

-- Tabla de sesiones de usuario
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id VARCHAR(255) UNIQUE NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER,
    page_views INTEGER DEFAULT 0,
    device_type VARCHAR(20),
    browser VARCHAR(50),
    os VARCHAR(50),
    country VARCHAR(2),
    city VARCHAR(100),
    INDEXED (user_id, started_at),
    INDEXED (session_id)
);

-- Tabla de funnels de conversión
CREATE TABLE IF NOT EXISTS conversion_funnels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    funnel_name VARCHAR(100) NOT NULL,
    step_name VARCHAR(100) NOT NULL,
    step_order INTEGER NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id VARCHAR(255),
    entered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    conversion_value DECIMAL(10,2),
    INDEXED (funnel_name, step_name, entered_at),
    INDEXED (user_id, funnel_name)
);

-- Tabla de cohortes de usuarios
CREATE TABLE IF NOT EXISTS user_cohorts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cohort_name VARCHAR(100) NOT NULL,
    cohort_date DATE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    retention_day_1 BOOLEAN DEFAULT FALSE,
    retention_day_7 BOOLEAN DEFAULT FALSE,
    retention_day_30 BOOLEAN DEFAULT FALSE,
    INDEXED (cohort_name, cohort_date),
    INDEXED (user_id, cohort_name)
);

-- Funciones para analytics

-- Función para registrar un evento
CREATE OR REPLACE FUNCTION track_event(
    p_user_id UUID DEFAULT NULL,
    p_session_id VARCHAR(255) DEFAULT NULL,
    p_event_type VARCHAR(100),
    p_event_category VARCHAR(50),
    p_event_data JSONB DEFAULT '{}',
    p_page_url VARCHAR(500) DEFAULT NULL,
    p_referrer VARCHAR(500) DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_device_type VARCHAR(20) DEFAULT NULL,
    p_location_data JSONB DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
    event_id UUID;
BEGIN
    INSERT INTO analytics_events (
        user_id, session_id, event_type, event_category, event_data,
        page_url, referrer, user_agent, ip_address, device_type, location_data
    ) VALUES (
        p_user_id, p_session_id, p_event_type, p_event_category, p_event_data,
        p_page_url, p_referrer, p_user_agent, p_ip_address, p_device_type, p_location_data
    ) RETURNING id INTO event_id;
    
    RETURN event_id;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar métricas agregadas
CREATE OR REPLACE FUNCTION update_metric(
    p_metric_name VARCHAR(100),
    p_metric_value DECIMAL(15,2),
    p_metric_unit VARCHAR(20) DEFAULT NULL,
    p_dimension_key VARCHAR(100) DEFAULT NULL,
    p_dimension_value VARCHAR(255) DEFAULT NULL,
    p_date_bucket DATE DEFAULT CURRENT_DATE
) RETURNS VOID AS $$
BEGIN
    INSERT INTO analytics_metrics (
        metric_name, metric_value, metric_unit, dimension_key, dimension_value, date_bucket
    ) VALUES (
        p_metric_name, p_metric_value, p_metric_unit, p_dimension_key, p_dimension_value, p_date_bucket
    )
    ON CONFLICT (metric_name, dimension_key, dimension_value, date_bucket)
    DO UPDATE SET 
        metric_value = analytics_metrics.metric_value + EXCLUDED.metric_value,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Función para obtener métricas del dashboard
CREATE OR REPLACE FUNCTION get_dashboard_metrics(
    p_date_from DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    p_date_to DATE DEFAULT CURRENT_DATE
) RETURNS TABLE (
    metric_name VARCHAR(100),
    metric_value DECIMAL(15,2),
    metric_unit VARCHAR(20),
    dimension_key VARCHAR(100),
    dimension_value VARCHAR(255),
    date_bucket DATE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        am.metric_name,
        am.metric_value,
        am.metric_unit,
        am.dimension_key,
        am.dimension_value,
        am.date_bucket
    FROM analytics_metrics am
    WHERE am.date_bucket BETWEEN p_date_from AND p_date_to
    ORDER BY am.date_bucket DESC, am.metric_name;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener eventos por tipo
CREATE OR REPLACE FUNCTION get_events_by_type(
    p_event_type VARCHAR(100),
    p_limit INTEGER DEFAULT 100,
    p_offset INTEGER DEFAULT 0
) RETURNS TABLE (
    id UUID,
    user_id UUID,
    event_type VARCHAR(100),
    event_category VARCHAR(50),
    event_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ae.id,
        ae.user_id,
        ae.event_type,
        ae.event_category,
        ae.event_data,
        ae.created_at
    FROM analytics_events ae
    WHERE ae.event_type = p_event_type
    ORDER BY ae.created_at DESC
    LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_analytics_metrics_updated_at
    BEFORE UPDATE ON analytics_metrics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Datos iniciales para testing
INSERT INTO analytics_metrics (metric_name, metric_value, metric_unit, dimension_key, dimension_value, date_bucket) VALUES
('total_users', 1250, 'users', 'platform', 'web', CURRENT_DATE),
('total_posts', 3420, 'posts', 'platform', 'web', CURRENT_DATE),
('total_snippets', 890, 'videos', 'platform', 'web', CURRENT_DATE),
('total_ads_spent', 1250.50, 'USD', 'platform', 'web', CURRENT_DATE),
('daily_active_users', 450, 'users', 'platform', 'web', CURRENT_DATE),
('engagement_rate', 0.68, 'percentage', 'platform', 'web', CURRENT_DATE),
('avg_session_duration', 420, 'seconds', 'platform', 'web', CURRENT_DATE),
('conversion_rate', 0.12, 'percentage', 'platform', 'web', CURRENT_DATE);

-- Eventos de ejemplo
SELECT track_event(
    NULL, 'session_123', 'page_view', 'navigation',
    '{"page": "/home", "title": "Home"}',
    '/home', '/login', 'Mozilla/5.0...', '192.168.1.1', 'desktop'
);

SELECT track_event(
    NULL, 'session_123', 'post_create', 'content',
    '{"post_id": "uuid-123", "type": "text", "has_media": false}',
    '/create-post', '/home', 'Mozilla/5.0...', '192.168.1.1', 'desktop'
);

SELECT track_event(
    NULL, 'session_456', 'snippet_view', 'video',
    '{"snippet_id": "uuid-456", "duration": 15, "completed": true}',
    '/snippets/123', '/snippets', 'Mozilla/5.0...', '192.168.1.2', 'mobile'
);

SELECT track_event(
    NULL, 'session_789', 'ad_click', 'monetization',
    '{"ad_id": "uuid-789", "campaign_id": "camp-123", "bid_type": "CPC"}',
    '/ads/123', '/feed', 'Mozilla/5.0...', '192.168.1.3', 'desktop'
);
