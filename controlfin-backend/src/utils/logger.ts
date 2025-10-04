/**
 * Logger Service
 *
 * Centralized logging service using Winston
 * Provides structured logging with different levels and formats
 */

import winston from 'winston';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Tell winston that you want to link the colors
winston.addColors(colors);

// Define which transports the logger must use
const transports = [
  // Console transport
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
      winston.format.colorize({ all: true }),
      winston.format.printf((info) => `${info['timestamp']} ${info.level}: ${info.message}`)
    ),
  }),
];

// Create the logger
const logger = winston.createLogger({
  level: process.env['NODE_ENV'] === 'production' ? 'warn' : 'debug',
  levels,
  transports,
  exitOnError: false,
});

// Create a stream object with a 'write' function that will be used by Morgan
const stream = {
  write: (message: string) => {
    logger.http(message.substring(0, message.lastIndexOf('\n')));
  },
};

// Add stream to logger with proper typing
// Winston Logger already has a stream property, so we extend it
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(logger as any).stream = stream;

export default logger;
