-- Migración para mejorar el esquema de mascotas
-- Añade campos adicionales para soportar cualquier tipo de animal

-- Añadir nuevos campos a la tabla pets
ALTER TABLE pets 
ADD COLUMN IF NOT EXISTS age_years INTEGER,
ADD COLUMN IF NOT EXISTS age_months INTEGER,
ADD COLUMN IF NOT EXISTS age_estimated VARCHAR(50), -- "joven", "adulto", "senior", etc.
ADD COLUMN IF NOT EXISTS personality VARCHAR(255), -- "juguetón", "tímido", "curioso", etc.
ADD COLUMN IF NOT EXISTS interests JSONB DEFAULT '[]', -- ["jugar", "pasear", "nadar", "cazar", "dormir"]
ADD COLUMN IF NOT EXISTS pet_location VARCHAR(255), -- ciudad o país de la mascota
ADD COLUMN IF NOT EXISTS microchip VARCHAR(50), -- número de microchip
ADD COLUMN IF NOT EXISTS adoption_date DATE, -- fecha de adopción
ADD COLUMN IF NOT EXISTS special_needs TEXT, -- necesidades especiales
ADD COLUMN IF NOT EXISTS favorite_food TEXT, -- comida favorita
ADD COLUMN IF NOT EXISTS favorite_activities TEXT, -- actividades favoritas
ADD COLUMN IF NOT EXISTS social_media_handle VARCHAR(100), -- @username para redes sociales
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE, -- mascota destacada
ADD COLUMN IF NOT EXISTS followers_count INTEGER DEFAULT 0, -- número de seguidores
ADD COLUMN IF NOT EXISTS posts_count INTEGER DEFAULT 0; -- número de posts

-- Mejorar el campo gender para ser más inclusivo
ALTER TABLE pets 
ALTER COLUMN gender TYPE VARCHAR(20);

-- Actualizar comentarios de la tabla
COMMENT ON TABLE pets IS 'Tabla de mascotas - soporta cualquier tipo de animal';
COMMENT ON COLUMN pets.species IS 'Tipo de animal: perro, gato, ave, pez, reptil, roedor, caballo, exótica, otro';
COMMENT ON COLUMN pets.breed IS 'Raza específica (opcional para algunos animales)';
COMMENT ON COLUMN pets.age_years IS 'Edad en años';
COMMENT ON COLUMN pets.age_months IS 'Edad en meses (para mascotas jóvenes)';
COMMENT ON COLUMN pets.age_estimated IS 'Estimación de edad: joven, adulto, senior, etc.';
COMMENT ON COLUMN pets.personality IS 'Personalidad: juguetón, tímido, curioso, etc.';
COMMENT ON COLUMN pets.interests IS 'Array de intereses: ["jugar", "pasear", "nadar", "cazar", "dormir"]';
COMMENT ON COLUMN pets.pet_location IS 'Ubicación de la mascota (ciudad o país)';
COMMENT ON COLUMN pets.gender IS 'Género: macho, hembra, indefinido';

-- Crear índices para los nuevos campos
CREATE INDEX IF NOT EXISTS idx_pets_species ON pets(species);
CREATE INDEX IF NOT EXISTS idx_pets_owner_id ON pets(owner_id);
CREATE INDEX IF NOT EXISTS idx_pets_is_featured ON pets(is_featured);
CREATE INDEX IF NOT EXISTS idx_pets_followers_count ON pets(followers_count DESC);

-- Crear tabla de especies predefinidas para autocompletado
CREATE TABLE IF NOT EXISTS pet_species (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL, -- mamífero, ave, pez, reptil, etc.
    icon VARCHAR(50), -- emoji o nombre de icono
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insertar especies comunes
INSERT INTO pet_species (name, category, icon) VALUES
-- Mamíferos
('Perro', 'mamífero', '🐕'),
('Gato', 'mamífero', '🐱'),
('Conejo', 'mamífero', '🐰'),
('Hamster', 'mamífero', '🐹'),
('Cobayo', 'mamífero', '🐹'),
('Hurón', 'mamífero', '🦦'),
('Ardilla', 'mamífero', '🐿️'),
('Erizo', 'mamífero', '🦔'),
('Chinchilla', 'mamífero', '🐹'),
('Conejo Enano', 'mamífero', '🐰'),

-- Aves
('Perico', 'ave', '🦜'),
('Canario', 'ave', '🐦'),
('Cacatúa', 'ave', '🦜'),
('Loro', 'ave', '🦜'),
('Agapornis', 'ave', '🦜'),
('Cacatúa Ninfa', 'ave', '🦜'),
('Diamante Mandarín', 'ave', '🐦'),
('Cotorra', 'ave', '🦜'),

-- Peces
('Pez Dorado', 'pez', '🐠'),
('Betta', 'pez', '🐠'),
('Guppy', 'pez', '🐠'),
('Molly', 'pez', '🐠'),
('Platy', 'pez', '🐠'),
('Tetra', 'pez', '🐠'),
('Cíclido', 'pez', '🐠'),
('Pez Ángel', 'pez', '🐠'),

-- Reptiles
('Iguana', 'reptil', '🦎'),
('Gecko', 'reptil', '🦎'),
('Tortuga', 'reptil', '🐢'),
('Serpiente', 'reptil', '🐍'),
('Camaleón', 'reptil', '🦎'),
('Dragón Barbudo', 'reptil', '🦎'),
('Tortuga de Agua', 'reptil', '🐢'),
('Tortuga Terrestre', 'reptil', '🐢'),

-- Otros
('Caballo', 'equino', '🐎'),
('Pony', 'equino', '🐎'),
('Burro', 'equino', '🦙'),
('Cerdo', 'mamífero', '🐷'),
('Cabra', 'mamífero', '🐐'),
('Oveja', 'mamífero', '🐑'),
('Vaca', 'mamífero', '🐄'),
('Pollo', 'ave', '🐔'),
('Pato', 'ave', '🦆'),
('Ganso', 'ave', '🦢'),

-- Exóticos
('Hurón', 'exótico', '🦦'),
('Conejo Rex', 'exótico', '🐰'),
('Conejo Angora', 'exótico', '🐰'),
('Conejo Holandés', 'exótico', '🐰'),
('Conejo Mini Lop', 'exótico', '🐰'),
('Conejo Lionhead', 'exótico', '🐰'),
('Conejo Netherland Dwarf', 'exótico', '🐰'),
('Otro', 'otro', '🐾')
ON CONFLICT (name) DO NOTHING;

-- Crear tabla de personalidades predefinidas
CREATE TABLE IF NOT EXISTS pet_personalities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insertar personalidades comunes
INSERT INTO pet_personalities (name, description, icon) VALUES
('Juguetón', 'Siempre listo para jugar y divertirse', '🎾'),
('Tímido', 'Reservado y necesita tiempo para confiar', '😊'),
('Curioso', 'Explora todo y siempre investiga', '🔍'),
('Tranquilo', 'Relajado y disfruta de la calma', '😌'),
('Energético', 'Lleno de vida y siempre activo', '⚡'),
('Cariñoso', 'Muy afectuoso y busca contacto', '❤️'),
('Independiente', 'Le gusta su espacio y autonomía', '🦁'),
('Protector', 'Cuida de su familia y territorio', '🛡️'),
('Inteligente', 'Aprende rápido y es muy listo', '🧠'),
('Sociable', 'Se lleva bien con otros animales', '🤝'),
('Territorial', 'Defiende su espacio personal', '🏠'),
('Aventurero', 'Le encanta explorar nuevos lugares', '🗺️'),
('Dormilón', 'Disfruta mucho de las siestas', '😴'),
('Comelón', 'Siempre tiene hambre y ama la comida', '🍖'),
('Nadador', 'Le encanta el agua y nadar', '🏊'),
('Cazador', 'Instinto natural de caza', '🎯'),
('Músico', 'Reacciona a sonidos y música', '🎵'),
('Artista', 'Le gusta crear y ser creativo', '🎨'),
('Deportista', 'Necesita mucho ejercicio', '🏃'),
('Filósofo', 'Reflexivo y observador', '🤔')
ON CONFLICT (name) DO NOTHING;

-- Crear tabla de intereses predefinidos
CREATE TABLE IF NOT EXISTS pet_interests (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    category VARCHAR(50), -- ejercicio, social, mental, etc.
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insertar intereses comunes
INSERT INTO pet_interests (name, category, icon) VALUES
-- Ejercicio y Actividad
('Jugar', 'ejercicio', '🎾'),
('Pasear', 'ejercicio', '🚶'),
('Nadar', 'ejercicio', '🏊'),
('Correr', 'ejercicio', '🏃'),
('Saltar', 'ejercicio', '🦘'),
('Trepar', 'ejercicio', '🧗'),
('Cazar', 'ejercicio', '🎯'),
('Perseguir', 'ejercicio', '🏃'),

-- Social
('Socializar', 'social', '🤝'),
('Acariciar', 'social', '🤗'),
('Abrazar', 'social', '💕'),
('Besos', 'social', '💋'),
('Jugar con otros', 'social', '👥'),

-- Mental
('Resolver puzzles', 'mental', '🧩'),
('Aprender trucos', 'mental', '🎓'),
('Explorar', 'mental', '🔍'),
('Observar', 'mental', '👀'),
('Investigar', 'mental', '🔬'),

-- Relajación
('Dormir', 'relajación', '😴'),
('Tomar el sol', 'relajación', '☀️'),
('Descansar', 'relajación', '🛋️'),
('Meditar', 'relajación', '🧘'),
('Ronronear', 'relajación', '😸'),

-- Comida
('Comer', 'comida', '🍖'),
('Masticar', 'comida', '🦴'),
('Buscar comida', 'comida', '🔍'),
('Probar nuevos sabores', 'comida', '👅'),

-- Otros
('Escuchar música', 'otros', '🎵'),
('Ver TV', 'otros', '📺'),
('Mirar por la ventana', 'otros', '🪟'),
('Recibir masajes', 'otros', '💆'),
('Jugar con juguetes', 'otros', '🧸'),
('Esconderse', 'otros', '🕳️'),
('Marcar territorio', 'otros', '📍'),
('Ladrar/Maullar', 'otros', '🗣️')
ON CONFLICT (name) DO NOTHING;

-- Crear tabla de razas por especie
CREATE TABLE IF NOT EXISTS pet_breeds (
    id SERIAL PRIMARY KEY,
    species_id INTEGER REFERENCES pet_species(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    size VARCHAR(20), -- pequeño, mediano, grande
    energy_level VARCHAR(20), -- baja, media, alta
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(species_id, name)
);

-- Insertar razas de perros (ejemplo)
INSERT INTO pet_breeds (species_id, name, description, size, energy_level) 
SELECT ps.id, 'Golden Retriever', 'Perro familiar muy cariñoso', 'grande', 'alta'
FROM pet_species ps WHERE ps.name = 'Perro'
ON CONFLICT (species_id, name) DO NOTHING;

INSERT INTO pet_breeds (species_id, name, description, size, energy_level) 
SELECT ps.id, 'Labrador', 'Perro inteligente y leal', 'grande', 'alta'
FROM pet_species ps WHERE ps.name = 'Perro'
ON CONFLICT (species_id, name) DO NOTHING;

INSERT INTO pet_breeds (species_id, name, description, size, energy_level) 
SELECT ps.id, 'Pastor Alemán', 'Perro protector y trabajador', 'grande', 'alta'
FROM pet_species ps WHERE ps.name = 'Perro'
ON CONFLICT (species_id, name) DO NOTHING;

INSERT INTO pet_breeds (species_id, name, description, size, energy_level) 
SELECT ps.id, 'Bulldog Francés', 'Perro pequeño y cariñoso', 'pequeño', 'media'
FROM pet_species ps WHERE ps.name = 'Perro'
ON CONFLICT (species_id, name) DO NOTHING;

INSERT INTO pet_breeds (species_id, name, description, size, energy_level) 
SELECT ps.id, 'Chihuahua', 'Perro muy pequeño y alerta', 'pequeño', 'media'
FROM pet_species ps WHERE ps.name = 'Perro'
ON CONFLICT (species_id, name) DO NOTHING;

-- Insertar razas de gatos (ejemplo)
INSERT INTO pet_breeds (species_id, name, description, size, energy_level) 
SELECT ps.id, 'Siamés', 'Gato vocal y cariñoso', 'mediano', 'alta'
FROM pet_species ps WHERE ps.name = 'Gato'
ON CONFLICT (species_id, name) DO NOTHING;

INSERT INTO pet_breeds (species_id, name, description, size, energy_level) 
SELECT ps.id, 'Persa', 'Gato tranquilo y elegante', 'mediano', 'baja'
FROM pet_species ps WHERE ps.name = 'Gato'
ON CONFLICT (species_id, name) DO NOTHING;

INSERT INTO pet_breeds (species_id, name, description, size, energy_level) 
SELECT ps.id, 'Maine Coon', 'Gato grande y majestuoso', 'grande', 'media'
FROM pet_species ps WHERE ps.name = 'Gato'
ON CONFLICT (species_id, name) DO NOTHING;

INSERT INTO pet_breeds (species_id, name, description, size, energy_level) 
SELECT ps.id, 'Sphynx', 'Gato sin pelo muy cariñoso', 'mediano', 'alta'
FROM pet_species ps WHERE ps.name = 'Gato'
ON CONFLICT (species_id, name) DO NOTHING;

-- Crear función para calcular edad automáticamente
CREATE OR REPLACE FUNCTION calculate_pet_age()
RETURNS TRIGGER AS $$
BEGIN
    -- Si tenemos fecha de nacimiento, calcular edad
    IF NEW.date_of_birth IS NOT NULL THEN
        NEW.age_years := EXTRACT(YEAR FROM AGE(CURRENT_DATE, NEW.date_of_birth));
        NEW.age_months := EXTRACT(MONTH FROM AGE(CURRENT_DATE, NEW.date_of_birth));
        
        -- Establecer estimación de edad
        IF NEW.age_years < 1 THEN
            NEW.age_estimated := 'cachorro';
        ELSIF NEW.age_years < 3 THEN
            NEW.age_estimated := 'joven';
        ELSIF NEW.age_years < 7 THEN
            NEW.age_estimated := 'adulto';
        ELSE
            NEW.age_estimated := 'senior';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para calcular edad automáticamente
CREATE TRIGGER trigger_calculate_pet_age
    BEFORE INSERT OR UPDATE ON pets
    FOR EACH ROW EXECUTE FUNCTION calculate_pet_age();

-- Crear función para actualizar contadores de mascotas
CREATE OR REPLACE FUNCTION update_pet_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Incrementar contador de posts del usuario
        UPDATE users SET posts_count = posts_count + 1 WHERE id = NEW.author_id;
        
        -- Si el post tiene mascota, incrementar contador de posts de la mascota
        IF NEW.pet_id IS NOT NULL THEN
            UPDATE pets SET posts_count = posts_count + 1 WHERE id = NEW.pet_id;
        END IF;
        
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        -- Decrementar contador de posts del usuario
        UPDATE users SET posts_count = posts_count - 1 WHERE id = OLD.author_id;
        
        -- Si el post tenía mascota, decrementar contador de posts de la mascota
        IF OLD.pet_id IS NOT NULL THEN
            UPDATE pets SET posts_count = posts_count - 1 WHERE id = OLD.pet_id;
        END IF;
        
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para actualizar contadores de posts
CREATE TRIGGER trigger_update_pet_post_counts
    AFTER INSERT OR DELETE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_pet_counts();

-- Crear vista para mascotas con información completa
CREATE OR REPLACE VIEW pets_with_details AS
SELECT 
    p.*,
    u.username as owner_username,
    u.first_name as owner_first_name,
    u.last_name as owner_last_name,
    ps.name as species_name,
    ps.icon as species_icon,
    ps.category as species_category,
    pb.name as breed_name,
    pb.size as breed_size,
    pb.energy_level as breed_energy_level
FROM pets p
LEFT JOIN users u ON p.owner_id = u.id
LEFT JOIN pet_species ps ON p.species = ps.name
LEFT JOIN pet_breeds pb ON p.breed = pb.name AND ps.id = pb.species_id;

-- Crear índices adicionales para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_pets_species_breed ON pets(species, breed);
CREATE INDEX IF NOT EXISTS idx_pets_age_years ON pets(age_years);
CREATE INDEX IF NOT EXISTS idx_pets_gender ON pets(gender);
CREATE INDEX IF NOT EXISTS idx_pets_is_sterilized ON pets(is_sterilized);
CREATE INDEX IF NOT EXISTS idx_pets_created_at ON pets(created_at DESC);

-- Comentarios adicionales
COMMENT ON TABLE pet_species IS 'Especies de mascotas predefinidas para autocompletado';
COMMENT ON TABLE pet_personalities IS 'Personalidades predefinidas para mascotas';
COMMENT ON TABLE pet_interests IS 'Intereses predefinidos para mascotas';
COMMENT ON TABLE pet_breeds IS 'Razas por especie para autocompletado';
COMMENT ON VIEW pets_with_details IS 'Vista con información completa de mascotas incluyendo datos del dueño y especie';
