import { Pool } from 'pg';

// Configuración de la base de datos PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'manadabook',
  password: process.env.DB_PASSWORD || 'password',
  port: parseInt(process.env.DB_PORT || '5432'),
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Función para ejecutar queries
export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Función para obtener un cliente del pool
export function getClient() {
  return pool.connect();
}

// Función para cerrar el pool
export async function closePool() {
  await pool.end();
}

// Función para verificar conexión
export async function testConnection() {
  try {
    const result = await query('SELECT NOW()');
    console.log('Database connected successfully:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Función para ejecutar migraciones
export async function runMigrations() {
  try {
    // Aquí se ejecutarían las migraciones SQL
    // Por ahora, verificamos que las tablas existan
    const tables = ['users', 'pets', 'posts', 'reactions', 'comments', 'follows'];
    
    for (const table of tables) {
      const result = await query(`SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = $1
      )`, [table]);
      
      if (!result.rows[0].exists) {
        console.warn(`Table ${table} does not exist. Run migrations first.`);
      } else {
        console.log(`Table ${table} exists.`);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Migration check failed:', error);
    return false;
  }
}

export default pool;
