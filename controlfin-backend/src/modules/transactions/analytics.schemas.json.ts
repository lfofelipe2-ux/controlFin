// JSON Schema definitions for analytics validation
// These schemas are used by Fastify for request validation

// Analytics query schema
export const AnalyticsQuerySchema = {
  type: 'object',
  properties: {
    spaceId: {
      type: 'string',
      description: 'Space ID filter',
    },
    startDate: {
      type: 'string',
      format: 'date-time',
      description: 'Start date filter',
    },
    endDate: {
      type: 'string',
      format: 'date-time',
      description: 'End date filter',
    },
    type: {
      type: 'string',
      enum: ['income', 'expense', 'transfer'],
      description: 'Transaction type filter',
    },
    groupBy: {
      type: 'string',
      enum: ['day', 'week', 'month', 'year'],
      default: 'month',
      description: 'Group results by time period',
    },
  },
  additionalProperties: false,
};

// Monthly comparison query schema
export const MonthlyComparisonQuerySchema = {
  type: 'object',
  properties: {
    spaceId: {
      type: 'string',
      description: 'Space ID filter',
    },
  },
  additionalProperties: false,
};

// Financial health query schema
export const FinancialHealthQuerySchema = {
  type: 'object',
  properties: {
    spaceId: {
      type: 'string',
      description: 'Space ID filter',
    },
    startDate: {
      type: 'string',
      format: 'date-time',
      description: 'Start date filter',
    },
    endDate: {
      type: 'string',
      format: 'date-time',
      description: 'End date filter',
    },
  },
  additionalProperties: false,
};

