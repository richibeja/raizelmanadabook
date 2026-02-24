-- Migración 002: Tabla de Afiliados/Aliados
-- Fecha: 2024-12-19
-- Descripción: Sistema de aliados para distribución de productos Raízel

-- Crear tabla affiliates
CREATE TABLE IF NOT EXISTS affiliates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    contact_type VARCHAR(50) NOT NULL CHECK (contact_type IN ('WhatsApp', 'Email', 'Teléfono', 'Web')),
    contact_value VARCHAR(255) NOT NULL,
    region VARCHAR(255),
    description TEXT,
    logo_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Crear índice para búsquedas por región
CREATE INDEX IF NOT EXISTS idx_affiliates_region ON affiliates(region);

-- Crear índice para búsquedas por tipo de contacto
CREATE INDEX IF NOT EXISTS idx_affiliates_contact_type ON affiliates(contact_type);

-- Crear trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_affiliates_updated_at 
    BEFORE UPDATE ON affiliates 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insertar datos de ejemplo para desarrollo
INSERT INTO affiliates (name, contact_type, contact_value, region, description) VALUES
('Mascotas Naturales Bogotá', 'WhatsApp', '+57 300 123 4567', 'Bogotá', 'Distribuidor autorizado en la capital'),
('Pet Shop Medellín', 'Email', 'info@petshopmedellin.com', 'Medellín', 'Tienda especializada en productos naturales'),
('Veterinaria Cali Natural', 'Teléfono', '+57 2 123 4567', 'Cali', 'Clínica veterinaria con productos Raízel'),
('Mascotas Barranquilla', 'Web', 'https://mascotasbarranquilla.com', 'Barranquilla', 'Tienda online de productos naturales'),
('Pet Store Bucaramanga', 'WhatsApp', '+57 300 987 6543', 'Bucaramanga', 'Distribuidor en Santander');

-- Comentarios de la tabla
COMMENT ON TABLE affiliates IS 'Tabla de aliados y distribuidores autorizados de productos Raízel';
COMMENT ON COLUMN affiliates.name IS 'Nombre del aliado o empresa';
COMMENT ON COLUMN affiliates.contact_type IS 'Tipo de contacto: WhatsApp, Email, Teléfono, Web';
COMMENT ON COLUMN affiliates.contact_value IS 'Valor del contacto (número, email, URL)';
COMMENT ON COLUMN affiliates.region IS 'Región o ciudad donde opera el aliado';
COMMENT ON COLUMN affiliates.description IS 'Descripción del aliado y sus servicios';
COMMENT ON COLUMN affiliates.logo_url IS 'URL del logo del aliado (opcional)';
COMMENT ON COLUMN affiliates.is_active IS 'Indica si el aliado está activo';
COMMENT ON COLUMN affiliates.created_at IS 'Fecha de creación del registro';
COMMENT ON COLUMN affiliates.updated_at IS 'Fecha de última actualización';
