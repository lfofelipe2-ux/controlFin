// JSON Schema definitions for transaction validation
// These schemas are used by Fastify for request validation

// Base transaction schema
const BaseTransactionSchema = {
  type: 'object',
  required: ['spaceId', 'type', 'amount', 'description', 'categoryId', 'paymentMethodId', 'date'],
  properties: {
    spaceId: {
      type: 'string',
      minLength: 1,
      description: 'Space ID is required',
    },
    type: {
      type: 'string',
      enum: ['income', 'expense', 'transfer'],
      description: 'Transaction type',
    },
    amount: {
      type: 'number',
      minimum: 0.01,
      description: 'Amount must be positive',
    },
    description: {
      type: 'string',
      minLength: 1,
      maxLength: 500,
      description: 'Description is required and must be less than 500 characters',
    },
    categoryId: {
      type: 'string',
      minLength: 1,
      description: 'Category ID is required',
    },
    paymentMethodId: {
      type: 'string',
      minLength: 1,
      description: 'Payment method ID is required',
    },
    date: {
      type: 'string',
      format: 'date-time',
      description: 'Transaction date in ISO format',
    },
    tags: {
      type: 'array',
      items: {
        type: 'string',
        maxLength: 50,
      },
      default: [],
      description: 'Transaction tags',
    },
    isRecurring: {
      type: 'boolean',
      default: false,
      description: 'Whether this is a recurring transaction',
    },
    recurringId: {
      type: 'string',
      description: 'ID of the recurring transaction template',
    },
    metadata: {
      type: 'object',
      properties: {
        location: {
          type: 'string',
          maxLength: 200,
          description: 'Transaction location',
        },
        notes: {
          type: 'string',
          maxLength: 1000,
          description: 'Additional notes',
        },
        attachments: {
          type: 'array',
          items: {
            type: 'string',
          },
          default: [],
          description: 'Attachment URLs',
        },
      },
      additionalProperties: false,
      default: { attachments: [] },
      description: 'Additional transaction metadata',
    },
  },
  additionalProperties: false,
};

// Create transaction schema
export const CreateTransactionSchema = BaseTransactionSchema;

// Update transaction schema (all fields optional except spaceId)
export const UpdateTransactionSchema = {
  type: 'object',
  required: ['spaceId'],
  properties: {
    spaceId: {
      type: 'string',
      minLength: 1,
      description: 'Space ID is required',
    },
    type: {
      type: 'string',
      enum: ['income', 'expense', 'transfer'],
      description: 'Transaction type',
    },
    amount: {
      type: 'number',
      minimum: 0.01,
      description: 'Amount must be positive',
    },
    description: {
      type: 'string',
      minLength: 1,
      maxLength: 500,
      description: 'Description is required and must be less than 500 characters',
    },
    categoryId: {
      type: 'string',
      minLength: 1,
      description: 'Category ID is required',
    },
    paymentMethodId: {
      type: 'string',
      minLength: 1,
      description: 'Payment method ID is required',
    },
    date: {
      type: 'string',
      format: 'date-time',
      description: 'Transaction date in ISO format',
    },
    tags: {
      type: 'array',
      items: {
        type: 'string',
        maxLength: 50,
      },
      description: 'Transaction tags',
    },
    isRecurring: {
      type: 'boolean',
      description: 'Whether this is a recurring transaction',
    },
    recurringId: {
      type: 'string',
      description: 'ID of the recurring transaction template',
    },
    metadata: {
      type: 'object',
      properties: {
        location: {
          type: 'string',
          maxLength: 200,
          description: 'Transaction location',
        },
        notes: {
          type: 'string',
          maxLength: 1000,
          description: 'Additional notes',
        },
        attachments: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'Attachment URLs',
        },
      },
      additionalProperties: false,
      description: 'Additional transaction metadata',
    },
  },
  additionalProperties: false,
};

// Query parameters schema for filtering
export const TransactionQuerySchema = {
  type: 'object',
  required: ['spaceId'],
  properties: {
    spaceId: {
      type: 'string',
      minLength: 1,
      description: 'Space ID is required',
    },
    userId: {
      type: 'string',
      description: 'User ID filter',
    },
    type: {
      type: 'string',
      enum: ['income', 'expense', 'transfer', 'all'],
      default: 'all',
      description: 'Transaction type filter',
    },
    categoryId: {
      type: 'string',
      description: 'Category ID filter',
    },
    paymentMethodId: {
      type: 'string',
      description: 'Payment method ID filter',
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
    minAmount: {
      type: 'number',
      minimum: 0.01,
      description: 'Minimum amount filter',
    },
    maxAmount: {
      type: 'number',
      minimum: 0.01,
      description: 'Maximum amount filter',
    },
    tags: {
      type: 'array',
      items: {
        type: 'string',
      },
      description: 'Tags filter',
    },
    isRecurring: {
      type: 'boolean',
      description: 'Recurring transaction filter',
    },
    search: {
      type: 'string',
      description: 'Search term for description',
    },
    sortBy: {
      type: 'string',
      enum: ['date', 'amount', 'description', 'createdAt'],
      default: 'date',
      description: 'Field to sort by',
    },
    sortOrder: {
      type: 'string',
      enum: ['asc', 'desc'],
      default: 'desc',
      description: 'Sort order',
    },
    page: {
      type: 'integer',
      minimum: 1,
      default: 1,
      description: 'Page number',
    },
    limit: {
      type: 'integer',
      minimum: 1,
      maximum: 100,
      default: 20,
      description: 'Number of items per page',
    },
  },
  additionalProperties: false,
};

// Bulk operations schema
export const BulkTransactionSchema = {
  type: 'object',
  required: ['spaceId', 'transactionIds', 'operation'],
  properties: {
    spaceId: {
      type: 'string',
      minLength: 1,
      description: 'Space ID is required',
    },
    transactionIds: {
      type: 'array',
      items: {
        type: 'string',
      },
      minItems: 1,
      description: 'At least one transaction ID is required',
    },
    operation: {
      type: 'string',
      enum: ['delete', 'update', 'export'],
      description: 'Bulk operation type',
    },
    updates: {
      type: 'object',
      properties: {
        categoryId: {
          type: 'string',
          description: 'New category ID',
        },
        paymentMethodId: {
          type: 'string',
          description: 'New payment method ID',
        },
        tags: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'New tags',
        },
        isRecurring: {
          type: 'boolean',
          description: 'New recurring status',
        },
      },
      additionalProperties: false,
      description: 'Updates to apply to transactions',
    },
  },
  additionalProperties: false,
};

// Import schema for CSV/Excel import
export const ImportTransactionSchema = {
  type: 'object',
  required: ['spaceId', 'userId', 'transactions'],
  properties: {
    spaceId: {
      type: 'string',
      minLength: 1,
      description: 'Space ID is required',
    },
    userId: {
      type: 'string',
      minLength: 1,
      description: 'User ID is required',
    },
    transactions: {
      type: 'array',
      items: BaseTransactionSchema,
      minItems: 1,
      description: 'At least one transaction is required',
    },
    options: {
      type: 'object',
      properties: {
        skipDuplicates: {
          type: 'boolean',
          default: true,
          description: 'Skip duplicate transactions',
        },
        updateExisting: {
          type: 'boolean',
          default: false,
          description: 'Update existing transactions',
        },
        validateCategories: {
          type: 'boolean',
          default: true,
          description: 'Validate category IDs',
        },
        validatePaymentMethods: {
          type: 'boolean',
          default: true,
          description: 'Validate payment method IDs',
        },
      },
      additionalProperties: false,
      default: {
        skipDuplicates: true,
        updateExisting: false,
        validateCategories: true,
        validatePaymentMethods: true,
      },
      description: 'Import options',
    },
  },
  additionalProperties: false,
};

// Export schema
export const ExportTransactionSchema = {
  type: 'object',
  required: ['spaceId'],
  properties: {
    spaceId: {
      type: 'string',
      minLength: 1,
      description: 'Space ID is required',
    },
    userId: {
      type: 'string',
      description: 'User ID filter',
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
      enum: ['income', 'expense', 'transfer', 'all'],
      default: 'all',
      description: 'Transaction type filter',
    },
    format: {
      type: 'string',
      enum: ['csv', 'excel', 'json'],
      default: 'excel',
      description: 'Export format',
    },
    includeMetadata: {
      type: 'boolean',
      default: false,
      description: 'Include transaction metadata',
    },
    includeCategories: {
      type: 'boolean',
      default: true,
      description: 'Include category information',
    },
    includePaymentMethods: {
      type: 'boolean',
      default: true,
      description: 'Include payment method information',
    },
  },
  additionalProperties: false,
};

// Statistics schema
export const TransactionStatsSchema = {
  type: 'object',
  required: ['spaceId'],
  properties: {
    spaceId: {
      type: 'string',
      minLength: 1,
      description: 'Space ID is required',
    },
    userId: {
      type: 'string',
      description: 'User ID filter',
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
    groupBy: {
      type: 'string',
      enum: ['day', 'week', 'month', 'year'],
      default: 'month',
      description: 'Group statistics by time period',
    },
    includeBreakdown: {
      type: 'boolean',
      default: true,
      description: 'Include detailed breakdown',
    },
  },
  additionalProperties: false,
};

// Recurring transaction schemas
export const CreateRecurringTransactionSchema = {
  type: 'object',
  required: ['spaceId', 'userId', 'type', 'amount', 'description', 'categoryId', 'paymentMethodId', 'frequency', 'interval', 'startDate'],
  properties: {
    spaceId: {
      type: 'string',
      minLength: 1,
      description: 'Space ID is required',
    },
    userId: {
      type: 'string',
      minLength: 1,
      description: 'User ID is required',
    },
    type: {
      type: 'string',
      enum: ['income', 'expense', 'transfer'],
      description: 'Transaction type',
    },
    amount: {
      type: 'number',
      minimum: 0.01,
      description: 'Amount must be positive',
    },
    description: {
      type: 'string',
      minLength: 1,
      maxLength: 500,
      description: 'Description is required and must be less than 500 characters',
    },
    categoryId: {
      type: 'string',
      minLength: 1,
      description: 'Category ID is required',
    },
    paymentMethodId: {
      type: 'string',
      minLength: 1,
      description: 'Payment method ID is required',
    },
    frequency: {
      type: 'string',
      enum: ['daily', 'weekly', 'monthly', 'yearly'],
      description: 'Recurrence frequency',
    },
    interval: {
      type: 'integer',
      minimum: 1,
      default: 1,
      description: 'Interval between occurrences',
    },
    startDate: {
      type: 'string',
      format: 'date-time',
      description: 'Start date for recurring transaction',
    },
    endDate: {
      type: 'string',
      format: 'date-time',
      description: 'End date for recurring transaction',
    },
    isActive: {
      type: 'boolean',
      default: true,
      description: 'Whether the recurring transaction is active',
    },
    metadata: {
      type: 'object',
      properties: {
        location: {
          type: 'string',
          maxLength: 200,
          description: 'Transaction location',
        },
        notes: {
          type: 'string',
          maxLength: 1000,
          description: 'Additional notes',
        },
      },
      additionalProperties: false,
      default: {},
      description: 'Additional transaction metadata',
    },
  },
  additionalProperties: false,
};

export const UpdateRecurringTransactionSchema = {
  type: 'object',
  required: ['spaceId'],
  properties: {
    spaceId: {
      type: 'string',
      minLength: 1,
      description: 'Space ID is required',
    },
    userId: {
      type: 'string',
      minLength: 1,
      description: 'User ID is required',
    },
    type: {
      type: 'string',
      enum: ['income', 'expense', 'transfer'],
      description: 'Transaction type',
    },
    amount: {
      type: 'number',
      minimum: 0.01,
      description: 'Amount must be positive',
    },
    description: {
      type: 'string',
      minLength: 1,
      maxLength: 500,
      description: 'Description is required and must be less than 500 characters',
    },
    categoryId: {
      type: 'string',
      minLength: 1,
      description: 'Category ID is required',
    },
    paymentMethodId: {
      type: 'string',
      minLength: 1,
      description: 'Payment method ID is required',
    },
    frequency: {
      type: 'string',
      enum: ['daily', 'weekly', 'monthly', 'yearly'],
      description: 'Recurrence frequency',
    },
    interval: {
      type: 'integer',
      minimum: 1,
      description: 'Interval between occurrences',
    },
    startDate: {
      type: 'string',
      format: 'date-time',
      description: 'Start date for recurring transaction',
    },
    endDate: {
      type: 'string',
      format: 'date-time',
      description: 'End date for recurring transaction',
    },
    isActive: {
      type: 'boolean',
      description: 'Whether the recurring transaction is active',
    },
    metadata: {
      type: 'object',
      properties: {
        location: {
          type: 'string',
          maxLength: 200,
          description: 'Transaction location',
        },
        notes: {
          type: 'string',
          maxLength: 1000,
          description: 'Additional notes',
        },
      },
      additionalProperties: false,
      description: 'Additional transaction metadata',
    },
  },
  additionalProperties: false,
};

