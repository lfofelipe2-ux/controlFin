import { env } from './env';

export const productionConfig = {
  // Server configuration
  server: {
    port: env.port || 3001,
    host: env.host || '0.0.0.0',
    trustProxy: true,
  },

  // Database configuration
  database: {
    uri: env.databaseUrl,
    options: {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferMaxEntries: 0,
      bufferCommands: false,
    },
  },

  // Security configuration
  security: {
    cors: {
      origin: [env.frontendUrl],
      credentials: true,
    },
    helmet: {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
    },
    rateLimit: {
      max: env.rateLimitMax || 100,
      timeWindow: `${env.rateLimitWindowMs || 60000} ms`,
    },
  },

  // Logging configuration
  logging: {
    level: env.logLevel || 'info',
    format: 'json',
    transports: [
      {
        type: 'file',
        filename: 'logs/error.log',
        level: 'error',
      },
      {
        type: 'file',
        filename: 'logs/combined.log',
        level: 'info',
      },
    ],
  },

  // Monitoring configuration
  monitoring: {
    enabled: true,
    healthCheckInterval: 30000, // 30 seconds
    performanceThreshold: 2000, // 2 seconds
    memoryThreshold: 1000, // 1GB
  },

  // JWT configuration
  jwt: {
    secret: env.jwtSecret,
    expiresIn: env.jwtExpiresIn || '24h',
    refreshExpiresIn: env.jwtRefreshExpiresIn || '7d',
  },

  // Google OAuth configuration
  oauth: {
    google: {
      clientId: env.googleClientId,
      clientSecret: env.googleClientSecret,
      callbackUrl: `${env.backendUrl}/api/auth/google/callback`,
    },
  },

  // File upload configuration
  fileUpload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    uploadPath: 'uploads/',
  },

  // Cache configuration
  cache: {
    enabled: true,
    ttl: 300, // 5 minutes
    max: 1000, // Maximum number of items
  },

  // Email configuration (for notifications)
  email: {
    enabled: false, // Disabled by default
    provider: 'smtp',
    host: env.smtpHost,
    port: env.smtpPort || 587,
    secure: env.smtpSecure || false,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass,
    },
  },

  // Backup configuration
  backup: {
    enabled: true,
    schedule: '0 2 * * *', // Daily at 2 AM
    retention: 30, // Keep 30 days of backups
    path: 'backups/',
  },
};

export default productionConfig;
