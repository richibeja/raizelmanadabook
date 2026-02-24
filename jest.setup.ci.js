// Mock de variables de entorno para CI
process.env.NEXT_PUBLIC_FIREBASE_API_KEY = 'test-api-key'
process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = 'test-project'
process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = 'test-project.firebaseapp.com'
process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = 'test-project.firebasestorage.app'
process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = '123456789'
process.env.NEXT_PUBLIC_FIREBASE_APP_ID = '1:123456789:web:test'

// Mock de base de datos para CI
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
process.env.REDIS_URL = 'redis://localhost:6379'

// Mock de console para evitar warnings en CI
global.console = {
  ...console,
  // Uncomment to ignore a specific log level
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
}
