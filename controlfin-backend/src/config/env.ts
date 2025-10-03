import { z } from 'zod';

// Environment configuration with validation
const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().optional(),
  MONGODB_URI: z.string().optional(),
  JWT_SECRET: z.string().optional(),
  JWT_REFRESH_SECRET: z.string().optional(),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  FRONTEND_URL: z.string().optional(),
  RATE_LIMIT_MAX: z.string().optional(),
  RATE_LIMIT_WINDOW_MS: z.string().optional(),
});

const parsed = EnvSchema.parse(process.env);

function requireInProduction(name: string, value: string | undefined): string {
  if (value && value.trim() !== '') return value;
  if (parsed.NODE_ENV === 'production') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return '';
}

function withDevFallback(value: string | undefined, fallback: string): string {
  return value && value.trim() !== '' ? value : fallback;
}

export const env = {
  nodeEnv: parsed.NODE_ENV,
  isProduction: parsed.NODE_ENV === 'production',
  port: parsed.PORT ? Number(parsed.PORT) : 3000,
  mongodbUri:
    parsed.NODE_ENV === 'production'
      ? requireInProduction('MONGODB_URI', parsed.MONGODB_URI)
      : withDevFallback(parsed.MONGODB_URI, 'mongodb://localhost:27017/controlfin-dev'),
  jwtSecret:
    parsed.NODE_ENV === 'production'
      ? requireInProduction('JWT_SECRET', parsed.JWT_SECRET)
      : withDevFallback(parsed.JWT_SECRET, 'dev-jwt-secret-change-me'),
  jwtRefreshSecret:
    parsed.NODE_ENV === 'production'
      ? requireInProduction('JWT_REFRESH_SECRET', parsed.JWT_REFRESH_SECRET)
      : withDevFallback(parsed.JWT_REFRESH_SECRET, 'dev-jwt-refresh-secret-change-me'),
  jwtExpiresIn: parsed.JWT_EXPIRES_IN,
  jwtRefreshExpiresIn: parsed.JWT_REFRESH_EXPIRES_IN,
  frontendUrl: withDevFallback(parsed.FRONTEND_URL, 'http://localhost:5173'),
  rateLimitMax: parsed.RATE_LIMIT_MAX ? Number(parsed.RATE_LIMIT_MAX) : 100,
  rateLimitWindowMs: parsed.RATE_LIMIT_WINDOW_MS ? Number(parsed.RATE_LIMIT_WINDOW_MS) : 60_000,
} as const;

export type Env = typeof env;
