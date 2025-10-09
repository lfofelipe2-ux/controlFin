// Test environment setup
process.env.NODE_ENV = 'test';
process.env.PORT = '0'; // Use random port for tests
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.MONGODB_URI = 'mongodb://localhost:27017/test-controlfin';

// Redis configuration for tests (use mock or disable)
process.env.REDIS_URL = 'redis://localhost:6379';
process.env.REDIS_ENABLED = 'false'; // Disable Redis for tests

// Mock OAuth environment variables to prevent server startup errors
process.env.GOOGLE_CLIENT_ID = 'test-google-client-id';
process.env.GOOGLE_CLIENT_SECRET = 'test-google-client-secret';
process.env.GOOGLE_CALLBACK_URL = 'http://localhost:3000/auth/google/callback';
process.env.GOOGLE_REDIRECT_URI = 'http://localhost:3000/auth/google/callback';

// Mock other required environment variables
process.env.FRONTEND_URL = 'http://localhost:3000';
process.env.RATE_LIMIT_MAX = '0'; // Disable rate limiting for tests
process.env.RATE_LIMIT_WINDOW_MS = '60000';
process.env.LOG_LEVEL = 'error';

// Disable console.log during tests to reduce noise
const originalConsoleLog = console.log;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
console.log = (...args: any[]) => {
  if (!args[0]?.includes?.('Connected to MongoDB') &&
    !args[0]?.includes?.('🛑 Shutting down server')) {
    originalConsoleLog(...args);
  }
};
