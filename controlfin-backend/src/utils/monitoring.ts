import winston from 'winston';
import { PerformanceMonitor } from './performance-monitor';

// Create logger instance
const logger = winston.createLogger({
  level: process.env['LOG_LEVEL'] || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'controlfin-backend' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Add console transport in development
if (process.env['NODE_ENV'] !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    })
  );
}

export interface MonitoringEvent {
  type: 'error' | 'warning' | 'info' | 'performance' | 'security';
  message: string;
  metadata?: Record<string, any>;
  timestamp?: Date;
}

export class MonitoringSystem {
  private static instance: MonitoringSystem;
  private logger: winston.Logger;

  private constructor() {
    this.logger = logger;
  }

  static getInstance(): MonitoringSystem {
    if (!MonitoringSystem.instance) {
      MonitoringSystem.instance = new MonitoringSystem();
    }
    return MonitoringSystem.instance;
  }

  logEvent(event: MonitoringEvent): void {
    const logData = {
      ...event,
      timestamp: event.timestamp || new Date(),
    };

    switch (event.type) {
      case 'error':
        this.logger.error(event.message, logData);
        break;
      case 'warning':
        this.logger.warn(event.message, logData);
        break;
      case 'info':
        this.logger.info(event.message, logData);
        break;
      case 'performance':
        this.logger.info(`PERFORMANCE: ${event.message}`, logData);
        break;
      case 'security':
        this.logger.warn(`SECURITY: ${event.message}`, logData);
        break;
    }
  }

  logError(message: string, error: Error, metadata?: Record<string, any>): void {
    this.logEvent({
      type: 'error',
      message,
      metadata: {
        ...metadata,
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
      },
    });
  }

  logWarning(message: string, metadata?: Record<string, any>): void {
    this.logEvent({
      type: 'warning',
      message,
      metadata: metadata || {},
    });
  }

  logInfo(message: string, metadata?: Record<string, any>): void {
    this.logEvent({
      type: 'info',
      message,
      metadata: metadata || {},
    });
  }

  logPerformance(operation: string, duration: number, metadata?: Record<string, any>): void {
    this.logEvent({
      type: 'performance',
      message: `Operation ${operation} completed in ${duration}ms`,
      metadata: {
        ...metadata,
        operation,
        duration,
      },
    });
  }

  logSecurity(message: string, metadata?: Record<string, any>): void {
    this.logEvent({
      type: 'security',
      message,
      metadata: metadata || {},
    });
  }

  // Performance monitoring methods
  startPerformanceTimer(operation: string): () => void {
    const stopTimer = PerformanceMonitor.startTimer(operation);

    return () => {
      stopTimer();
      const metrics = PerformanceMonitor.getMetrics(operation);
      const latestMetric = metrics[metrics.length - 1];
      if (latestMetric) {
        this.logPerformance(operation, latestMetric.duration);
      }
    };
  }

  getPerformanceMetrics(): any {
    return PerformanceMonitor.getMetricsSummary();
  }

  getSlowOperations(threshold: number = 1000): any[] {
    return PerformanceMonitor.getSlowOperations(threshold);
  }

  // Health check methods
  async performHealthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    checks: Record<string, any>;
    timestamp: Date;
  }> {
    const checks: Record<string, any> = {};
    let overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

    // Database connectivity check
    try {
      // This would be a real database ping in production
      checks['database'] = { status: 'healthy', responseTime: 10 };
    } catch (error) {
      checks['database'] = { status: 'unhealthy', error: (error as Error).message };
      overallStatus = 'unhealthy';
    }

    // Memory usage check
    const memoryUsage = process.memoryUsage();
    const memoryUsageMB = memoryUsage.heapUsed / 1024 / 1024;
    checks['memory'] = {
      status: memoryUsageMB < 500 ? 'healthy' : memoryUsageMB < 1000 ? 'degraded' : 'unhealthy',
      heapUsed: memoryUsageMB,
      heapTotal: memoryUsage.heapTotal / 1024 / 1024,
    };

    if (checks['memory'].status === 'unhealthy') {
      overallStatus = 'unhealthy';
    } else if (checks['memory'].status === 'degraded') {
      overallStatus = 'degraded';
    }

    // Performance metrics check
    const performanceMetrics = this.getPerformanceMetrics();
    const slowOperations = this.getSlowOperations(2000); // 2 second threshold

    checks['performance'] = {
      status: slowOperations.length === 0 ? 'healthy' : 'degraded',
      averageResponseTime: performanceMetrics.averageDuration,
      slowOperations: slowOperations.length,
    };

    if (checks['performance'].status === 'degraded' && overallStatus === 'healthy') {
      overallStatus = 'degraded';
    }

    return {
      status: overallStatus,
      checks,
      timestamp: new Date(),
    };
  }

  // Alert methods
  async checkAlerts(): Promise<void> {
    const slowOperations = this.getSlowOperations(5000); // 5 second threshold

    // Alert on slow operations
    if (slowOperations.length > 0) {
      this.logWarning('Slow operations detected', {
        slowOperations: slowOperations.map((op) => ({
          operation: op.operation,
          duration: op.duration,
          timestamp: op.timestamp,
        })),
      });
    }

    // Alert on high error rate (this would be implemented with actual error tracking)
    const errorCount = 0; // This would be tracked in a real implementation
    if (errorCount > 10) {
      this.logWarning('High error rate detected', { errorCount });
    }

    // Alert on memory usage
    const memoryUsage = process.memoryUsage();
    const memoryUsageMB = memoryUsage.heapUsed / 1024 / 1024;
    if (memoryUsageMB > 1000) {
      this.logWarning('High memory usage detected', { memoryUsageMB });
    }
  }
}

// Export singleton instance
export const monitoring = MonitoringSystem.getInstance();

// Export logger for direct use
export { logger };
