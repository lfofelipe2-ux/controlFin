import { performance } from 'perf_hooks';

export interface PerformanceMetrics {
  operation: string;
  duration: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export class PerformanceMonitor {
  private static metrics: PerformanceMetrics[] = [];
  private static maxMetrics = 1000; // Keep last 1000 metrics

  static startTimer(operation: string): () => void {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;

      this.recordMetric({
        operation,
        duration,
        timestamp: new Date(),
      });
    };
  }

  static recordMetric(metric: PerformanceMetrics): void {
    this.metrics.push(metric);

    // Keep only the last maxMetrics entries
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }

  static getMetrics(operation?: string): PerformanceMetrics[] {
    if (operation) {
      return this.metrics.filter((m) => m.operation === operation);
    }
    return [...this.metrics];
  }

  static getAverageDuration(operation: string): number {
    const operationMetrics = this.getMetrics(operation);
    if (operationMetrics.length === 0) return 0;

    const totalDuration = operationMetrics.reduce((sum, metric) => sum + metric.duration, 0);
    return totalDuration / operationMetrics.length;
  }

  static getSlowOperations(threshold: number = 1000): PerformanceMetrics[] {
    return this.metrics.filter((metric) => metric.duration > threshold);
  }

  static getMetricsSummary(): {
    totalOperations: number;
    averageDuration: number;
    slowOperations: number;
    operationsByType: Record<string, number>;
  } {
    const totalOperations = this.metrics.length;
    const averageDuration =
      totalOperations > 0
        ? this.metrics.reduce((sum, metric) => sum + metric.duration, 0) / totalOperations
        : 0;

    const slowOperations = this.getSlowOperations().length;

    const operationsByType = this.metrics.reduce(
      (acc, metric) => {
        acc[metric.operation] = (acc[metric.operation] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      totalOperations,
      averageDuration,
      slowOperations,
      operationsByType,
    };
  }

  static clearMetrics(): void {
    this.metrics = [];
  }
}

// Middleware for Fastify to monitor request performance
export const performanceMiddleware = async (request: any, reply: any) => {
  const stopTimer = PerformanceMonitor.startTimer(`request:${request.method}:${request.url}`);

  reply.addHook('onSend', () => {
    stopTimer();
  });
};

// Decorator for monitoring function performance
export function monitorPerformance(operationName: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const stopTimer = PerformanceMonitor.startTimer(`${operationName}:${propertyName}`);

      try {
        const result = await method.apply(this, args);
        return result;
      } finally {
        stopTimer();
      }
    };

    return descriptor;
  };
}

// Utility for monitoring database operations
export class DatabasePerformanceMonitor {
  static async monitorQuery<T>(operation: string, queryFn: () => Promise<T>): Promise<T> {
    const stopTimer = PerformanceMonitor.startTimer(`database:${operation}`);

    try {
      const result = await queryFn();
      return result;
    } finally {
      stopTimer();
    }
  }
}

// Utility for monitoring API endpoint performance
export class APIPerformanceMonitor {
  static async monitorEndpoint<T>(
    endpoint: string,
    method: string,
    handler: () => Promise<T>
  ): Promise<T> {
    const stopTimer = PerformanceMonitor.startTimer(`api:${method}:${endpoint}`);

    try {
      const result = await handler();
      return result;
    } finally {
      stopTimer();
    }
  }
}
