import winston from "winston";

/**
 * Logger helper for easy access to winston throughout the application
 *
 * Usage:
 * import logger from './helpers/logger';
 *
 * logger.info('User logged in', { userId: 123 });
 * logger.warn('Rate limit approaching', { requests: 95, limit: 100 });
 * logger.error('Database connection failed', { error: err.message });
 */

const logger = winston;

export default logger;

// Named exports for convenience
export const { info, warn, error, debug, verbose } = logger;
