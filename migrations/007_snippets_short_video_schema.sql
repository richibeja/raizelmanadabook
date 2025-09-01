-- Migration: 007_snippets_short_video_schema.sql
-- Feature: feature/snippets-mvp
-- Description: Database schema for short-video (Snippets) feature
-- Date: 2024-01-XX

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Snippets table - stores video metadata and processing status
CREATE TABLE snippets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    video_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    duration_seconds INTEGER,
    file_size_bytes BIGINT,
    video_format VARCHAR(10) DEFAULT 'mp4',
    resolution_width INTEGER,
    resolution_height INTEGER,
    processing_status VARCHAR(20) DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
    processing_error TEXT,
    is_public BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    engagement_score DECIMAL(5,2) DEFAULT 0.00,
    hashtags TEXT[], -- Array of hashtags
    mentions UUID[], -- Array of mentioned user IDs
    location VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE, -- For temporary snippets
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Snippet views tracking
CREATE TABLE snippet_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    snippet_id UUID NOT NULL REFERENCES snippets(id) ON DELETE CASCADE,
    viewer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    ip_address INET,
    user_agent TEXT,
    view_duration_seconds INTEGER,
    watched_percentage DECIMAL(5,2),
    is_complete BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Snippet reactions (likes, etc.)
CREATE TABLE snippet_reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    snippet_id UUID NOT NULL REFERENCES snippets(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reaction_type VARCHAR(20) DEFAULT 'like' CHECK (reaction_type IN ('like', 'love', 'laugh', 'wow', 'sad', 'angry')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(snippet_id, user_id, reaction_type)
);

-- Snippet comments
CREATE TABLE snippet_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    snippet_id UUID NOT NULL REFERENCES snippets(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_comment_id UUID REFERENCES snippet_comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_edited BOOLEAN DEFAULT false,
    edited_at TIMESTAMP WITH TIME ZONE,
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Snippet shares
CREATE TABLE snippet_shares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    snippet_id UUID NOT NULL REFERENCES snippets(id) ON DELETE CASCADE,
    sharer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    share_platform VARCHAR(50), -- 'internal', 'facebook', 'twitter', 'instagram', etc.
    share_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Snippet processing queue
CREATE TABLE snippet_processing_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    snippet_id UUID NOT NULL REFERENCES snippets(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'completed', 'failed')),
    priority INTEGER DEFAULT 0,
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    error_message TEXT,
    processing_started_at TIMESTAMP WITH TIME ZONE,
    processing_completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Snippet hashtags (normalized)
CREATE TABLE snippet_hashtags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hashtag VARCHAR(100) UNIQUE NOT NULL,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Snippet hashtag relationships
CREATE TABLE snippet_hashtag_relationships (
    snippet_id UUID NOT NULL REFERENCES snippets(id) ON DELETE CASCADE,
    hashtag_id UUID NOT NULL REFERENCES snippet_hashtags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (snippet_id, hashtag_id)
);

-- Snippet categories
CREATE TABLE snippet_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(7), -- Hex color
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Snippet category relationships
CREATE TABLE snippet_category_relationships (
    snippet_id UUID NOT NULL REFERENCES snippets(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES snippet_categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (snippet_id, category_id)
);

-- Snippet bookmarks
CREATE TABLE snippet_bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    snippet_id UUID NOT NULL REFERENCES snippets(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(snippet_id, user_id)
);

-- Create indexes for performance
CREATE INDEX idx_snippets_author_id ON snippets(author_id);
CREATE INDEX idx_snippets_processing_status ON snippets(processing_status);
CREATE INDEX idx_snippets_created_at ON snippets(created_at DESC);
CREATE INDEX idx_snippets_engagement_score ON snippets(engagement_score DESC);
CREATE INDEX idx_snippets_is_public ON snippets(is_public);
CREATE INDEX idx_snippets_is_featured ON snippets(is_featured);
CREATE INDEX idx_snippets_hashtags ON snippets USING GIN(hashtags);
CREATE INDEX idx_snippets_mentions ON snippets USING GIN(mentions);
CREATE INDEX idx_snippets_expires_at ON snippets(expires_at);

CREATE INDEX idx_snippet_views_snippet_id ON snippet_views(snippet_id);
CREATE INDEX idx_snippet_views_viewer_id ON snippet_views(viewer_id);
CREATE INDEX idx_snippet_views_created_at ON snippet_views(created_at);

CREATE INDEX idx_snippet_reactions_snippet_id ON snippet_reactions(snippet_id);
CREATE INDEX idx_snippet_reactions_user_id ON snippet_reactions(user_id);
CREATE INDEX idx_snippet_reactions_type ON snippet_reactions(reaction_type);

CREATE INDEX idx_snippet_comments_snippet_id ON snippet_comments(snippet_id);
CREATE INDEX idx_snippet_comments_author_id ON snippet_comments(author_id);
CREATE INDEX idx_snippet_comments_parent_id ON snippet_comments(parent_comment_id);
CREATE INDEX idx_snippet_comments_created_at ON snippet_comments(created_at);

CREATE INDEX idx_snippet_shares_snippet_id ON snippet_shares(snippet_id);
CREATE INDEX idx_snippet_shares_sharer_id ON snippet_shares(sharer_id);

CREATE INDEX idx_snippet_processing_queue_status ON snippet_processing_queue(status);
CREATE INDEX idx_snippet_processing_queue_priority ON snippet_processing_queue(priority DESC);
CREATE INDEX idx_snippet_processing_queue_created_at ON snippet_processing_queue(created_at);

CREATE INDEX idx_snippet_hashtags_usage_count ON snippet_hashtags(usage_count DESC);
CREATE INDEX idx_snippet_hashtag_relationships_snippet_id ON snippet_hashtag_relationships(snippet_id);
CREATE INDEX idx_snippet_hashtag_relationships_hashtag_id ON snippet_hashtag_relationships(hashtag_id);

CREATE INDEX idx_snippet_bookmarks_user_id ON snippet_bookmarks(user_id);
CREATE INDEX idx_snippet_bookmarks_snippet_id ON snippet_bookmarks(snippet_id);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_snippets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_snippets_updated_at
    BEFORE UPDATE ON snippets
    FOR EACH ROW
    EXECUTE FUNCTION update_snippets_updated_at();

-- Create trigger for snippet comment updated_at
CREATE OR REPLACE FUNCTION update_snippet_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_snippet_comments_updated_at
    BEFORE UPDATE ON snippet_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_snippet_comments_updated_at();

-- Create trigger for snippet processing queue updated_at
CREATE OR REPLACE FUNCTION update_snippet_processing_queue_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_snippet_processing_queue_updated_at
    BEFORE UPDATE ON snippet_processing_queue
    FOR EACH ROW
    EXECUTE FUNCTION update_snippet_processing_queue_updated_at();

-- Create trigger for snippet hashtags updated_at
CREATE OR REPLACE FUNCTION update_snippet_hashtags_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_snippet_hashtags_updated_at
    BEFORE UPDATE ON snippet_hashtags
    FOR EACH ROW
    EXECUTE FUNCTION update_snippet_hashtags_updated_at();

-- Create function to update snippet counts
CREATE OR REPLACE FUNCTION update_snippet_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Update view count
        IF TG_TABLE_NAME = 'snippet_views' THEN
            UPDATE snippets 
            SET view_count = view_count + 1 
            WHERE id = NEW.snippet_id;
        END IF;
        
        -- Update reaction count
        IF TG_TABLE_NAME = 'snippet_reactions' THEN
            UPDATE snippets 
            SET like_count = (
                SELECT COUNT(*) 
                FROM snippet_reactions 
                WHERE snippet_id = NEW.snippet_id AND reaction_type = 'like'
            )
            WHERE id = NEW.snippet_id;
        END IF;
        
        -- Update comment count
        IF TG_TABLE_NAME = 'snippet_comments' THEN
            UPDATE snippets 
            SET comment_count = comment_count + 1 
            WHERE id = NEW.snippet_id;
        END IF;
        
        -- Update share count
        IF TG_TABLE_NAME = 'snippet_shares' THEN
            UPDATE snippets 
            SET share_count = share_count + 1 
            WHERE id = NEW.snippet_id;
        END IF;
        
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        -- Update reaction count on delete
        IF TG_TABLE_NAME = 'snippet_reactions' THEN
            UPDATE snippets 
            SET like_count = (
                SELECT COUNT(*) 
                FROM snippet_reactions 
                WHERE snippet_id = OLD.snippet_id AND reaction_type = 'like'
            )
            WHERE id = OLD.snippet_id;
        END IF;
        
        -- Update comment count on delete
        IF TG_TABLE_NAME = 'snippet_comments' THEN
            UPDATE snippets 
            SET comment_count = comment_count - 1 
            WHERE id = OLD.snippet_id;
        END IF;
        
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for count updates
CREATE TRIGGER trigger_snippet_views_count
    AFTER INSERT ON snippet_views
    FOR EACH ROW
    EXECUTE FUNCTION update_snippet_counts();

CREATE TRIGGER trigger_snippet_reactions_count
    AFTER INSERT OR DELETE ON snippet_reactions
    FOR EACH ROW
    EXECUTE FUNCTION update_snippet_counts();

CREATE TRIGGER trigger_snippet_comments_count
    AFTER INSERT OR DELETE ON snippet_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_snippet_counts();

CREATE TRIGGER trigger_snippet_shares_count
    AFTER INSERT ON snippet_shares
    FOR EACH ROW
    EXECUTE FUNCTION update_snippet_counts();

-- Create function to calculate engagement score
CREATE OR REPLACE FUNCTION calculate_snippet_engagement_score(snippet_uuid UUID)
RETURNS DECIMAL(5,2) AS $$
DECLARE
    view_weight DECIMAL(3,2) := 0.1;
    like_weight DECIMAL(3,2) := 0.3;
    comment_weight DECIMAL(3,2) := 0.4;
    share_weight DECIMAL(3,2) := 0.2;
    total_score DECIMAL(5,2);
BEGIN
    SELECT 
        (view_count * view_weight) +
        (like_count * like_weight) +
        (comment_count * comment_weight) +
        (share_count * share_weight)
    INTO total_score
    FROM snippets
    WHERE id = snippet_uuid;
    
    RETURN COALESCE(total_score, 0.00);
END;
$$ LANGUAGE plpgsql;

-- Create function to update engagement score
CREATE OR REPLACE FUNCTION update_snippet_engagement_score()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE snippets 
    SET engagement_score = calculate_snippet_engagement_score(id)
    WHERE id = NEW.snippet_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for engagement score updates
CREATE TRIGGER trigger_snippet_engagement_score
    AFTER INSERT OR DELETE ON snippet_reactions
    FOR EACH ROW
    EXECUTE FUNCTION update_snippet_engagement_score();

-- Create function to extract hashtags from text
CREATE OR REPLACE FUNCTION extract_hashtags(text_content TEXT)
RETURNS TEXT[] AS $$
DECLARE
    hashtags TEXT[];
BEGIN
    SELECT array_agg(DISTINCT lower(substring(match, 2)))
    INTO hashtags
    FROM regexp_matches(text_content, '#[a-zA-Z0-9_]+', 'g') AS match;
    
    RETURN COALESCE(hashtags, ARRAY[]::TEXT[]);
END;
$$ LANGUAGE plpgsql;

-- Create function to extract mentions from text
CREATE OR REPLACE FUNCTION extract_mentions(text_content TEXT)
RETURNS UUID[] AS $$
DECLARE
    mentions UUID[];
BEGIN
    -- This is a simplified version - in practice you'd need to match usernames to user IDs
    SELECT array_agg(DISTINCT user_id)
    INTO mentions
    FROM (
        SELECT unnest(regexp_matches(text_content, '@[a-zA-Z0-9_]+', 'g')) AS username
    ) usernames
    JOIN users ON lower(users.username) = lower(substring(usernames.username, 2));
    
    RETURN COALESCE(mentions, ARRAY[]::UUID[]);
END;
$$ LANGUAGE plpgsql;

-- Create function to cleanup expired snippets
CREATE OR REPLACE FUNCTION cleanup_expired_snippets()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM snippets 
    WHERE expires_at IS NOT NULL 
    AND expires_at < NOW() 
    AND deleted_at IS NULL;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Create views for common queries
CREATE VIEW snippets_with_stats AS
SELECT 
    s.*,
    u.username as author_username,
    u.avatar_url as author_avatar,
    u.is_verified as author_verified,
    CASE 
        WHEN s.created_at > NOW() - INTERVAL '24 hours' THEN true 
        ELSE false 
    END as is_recent,
    CASE 
        WHEN s.view_count > 1000 OR s.like_count > 100 THEN true 
        ELSE false 
    END as is_trending
FROM snippets s
JOIN users u ON s.author_id = u.id
WHERE s.deleted_at IS NULL;

CREATE VIEW public_snippets_feed AS
SELECT 
    s.*,
    u.username as author_username,
    u.avatar_url as author_avatar,
    u.is_verified as author_verified,
    array_agg(DISTINCT c.name) as categories,
    array_agg(DISTINCT h.hashtag) as hashtags
FROM snippets s
JOIN users u ON s.author_id = u.id
LEFT JOIN snippet_category_relationships scr ON s.id = scr.snippet_id
LEFT JOIN snippet_categories c ON scr.category_id = c.id
LEFT JOIN snippet_hashtag_relationships shr ON s.id = shr.snippet_id
LEFT JOIN snippet_hashtags h ON shr.hashtag_id = h.id
WHERE s.is_public = true 
AND s.deleted_at IS NULL
AND s.processing_status = 'completed'
GROUP BY s.id, u.username, u.avatar_url, u.is_verified
ORDER BY s.created_at DESC;

CREATE VIEW trending_snippets AS
SELECT 
    s.*,
    u.username as author_username,
    u.avatar_url as author_avatar,
    s.engagement_score,
    ROW_NUMBER() OVER (ORDER BY s.engagement_score DESC, s.created_at DESC) as trend_rank
FROM snippets s
JOIN users u ON s.author_id = u.id
WHERE s.is_public = true 
AND s.deleted_at IS NULL
AND s.processing_status = 'completed'
AND s.created_at > NOW() - INTERVAL '7 days'
ORDER BY s.engagement_score DESC, s.created_at DESC
LIMIT 50;

-- Insert initial data
INSERT INTO snippet_categories (name, description, icon, color) VALUES
('Mascotas Divertidas', 'Videos graciosos de mascotas', 'laugh', '#FF6B6B'),
('Adiestramiento', 'Técnicas de entrenamiento', 'graduation-cap', '#4ECDC4'),
('Salud y Cuidado', 'Consejos de salud y bienestar', 'heart', '#45B7D1'),
('Aventuras', 'Mascotas en la naturaleza', 'map-pin', '#96CEB4'),
('Comida y Recetas', 'Recetas caseras para mascotas', 'utensils', '#FFEAA7'),
('Adopción', 'Historias de adopción', 'home', '#DDA0DD'),
('Razas Específicas', 'Contenido por tipo de mascota', 'users', '#98D8C8'),
('Consejos Veterinarios', 'Consejos de profesionales', 'stethoscope', '#F7DC6F');

-- Insert sample snippets (for testing)
INSERT INTO snippets (author_id, title, description, video_url, thumbnail_url, duration_seconds, file_size_bytes, processing_status, hashtags, is_public) VALUES
(
    (SELECT id FROM users WHERE username = 'admin' LIMIT 1),
    'Mi perro aprendiendo a dar la pata',
    'Después de semanas de entrenamiento, finalmente lo logró! 🐾',
    'https://example.com/videos/dog-trick.mp4',
    'https://example.com/thumbnails/dog-trick.jpg',
    45,
    5242880,
    'completed',
    ARRAY['#perro', '#adiestramiento', '#truco'],
    true
),
(
    (SELECT id FROM users WHERE username = 'admin' LIMIT 1),
    'Gato durmiendo en posiciones extrañas',
    '¿Cómo puede ser tan cómodo? 😸',
    'https://example.com/videos/cat-sleeping.mp4',
    'https://example.com/thumbnails/cat-sleeping.jpg',
    30,
    3145728,
    'completed',
    ARRAY['#gato', '#dormir', '#gracioso'],
    true
);

-- Insert sample hashtags
INSERT INTO snippet_hashtags (hashtag, usage_count) VALUES
('perro', 1),
('adiestramiento', 1),
('truco', 1),
('gato', 1),
('dormir', 1),
('gracioso', 1);

-- Create hashtag relationships
INSERT INTO snippet_hashtag_relationships (snippet_id, hashtag_id)
SELECT s.id, h.id
FROM snippets s
CROSS JOIN snippet_hashtags h
WHERE h.hashtag = ANY(s.hashtags);

-- Update engagement scores
UPDATE snippets 
SET engagement_score = calculate_snippet_engagement_score(id);

COMMENT ON TABLE snippets IS 'Stores short video content (Snippets) with metadata and processing status';
COMMENT ON TABLE snippet_views IS 'Tracks video views and engagement metrics';
COMMENT ON TABLE snippet_reactions IS 'User reactions to videos (likes, loves, etc.)';
COMMENT ON TABLE snippet_comments IS 'Comments on videos with threading support';
COMMENT ON TABLE snippet_shares IS 'Tracks video sharing across platforms';
COMMENT ON TABLE snippet_processing_queue IS 'Queue for video processing tasks';
COMMENT ON TABLE snippet_hashtags IS 'Normalized hashtags for better search and discovery';
COMMENT ON TABLE snippet_categories IS 'Categories for organizing video content';
COMMENT ON TABLE snippet_bookmarks IS 'User bookmarks for saving videos';
