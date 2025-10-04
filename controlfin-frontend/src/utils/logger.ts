/**
 * Logger Service
 *
 * Centralized logging service for frontend
 * Provides structured logging with different levels
 */

import log from 'loglevel';

// Configure log level based on environment
const logLevel = process.env.NODE_ENV === 'production' ? 'warn' : 'debug';
log.setLevel(logLevel);

// Create a custom logger with consistent formatting
const logger = {
  error: (message: string, ...args: unknown[]) => {
    log.error(`[ERROR] ${message}`, ...args);
  },
  warn: (message: string, ...args: unknown[]) => {
    log.warn(`[WARN] ${message}`, ...args);
  },
  info: (message: string, ...args: unknown[]) => {
    log.info(`[INFO] ${message}`, ...args);
  },
  debug: (message: string, ...args: unknown[]) => {
    log.debug(`[DEBUG] ${message}`, ...args);
  },
};

export default logger;
