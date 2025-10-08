// JSON Schema definitions for bulk operations validation
// These schemas are used by Fastify for request validation

// Base transaction schema for bulk operations
const BaseTransactionSchema = {
  type: 'object',
  required: ['type', 'amount', 'description', 'categoryId', 'paymentMethodId', 'date'],
  properties: {
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
      description: 'Description is required',
    },
    categoryId: {
      type: 'string',
      description: 'Category ID',
    },
    paymentMethodId: {
      type: 'string',
      description: 'Payment method ID',
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
          description: 'Transaction location',
        },
        notes: {
          type: 'string',
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

// Bulk create schema
export const BulkCreateSchema = {
  type: 'object',
  required: ['spaceId', 'transactions'],
  properties: {
    spaceId: {
      type: 'string',
      minLength: 1,
      description: 'Space ID is required',
    },
    transactions: {
      type: 'array',
      items: BaseTransactionSchema,
      minItems: 1,
      description: 'At least one transaction is required',
    },
  },
  additionalProperties: false,
};

// Bulk update schema
export const BulkUpdateSchema = {
  type: 'object',
  required: ['transactionIds', 'updates'],
  properties: {
    transactionIds: {
      type: 'array',
      items: {
        type: 'string',
      },
      minItems: 1,
      description: 'At least one transaction ID is required',
    },
    updates: {
      type: 'object',
      properties: {
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
          description: 'Description is required',
        },
        categoryId: {
          type: 'string',
          description: 'Category ID',
        },
        paymentMethodId: {
          type: 'string',
          description: 'Payment method ID',
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
              description: 'Transaction location',
            },
            notes: {
              type: 'string',
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
      description: 'Updates to apply to transactions',
    },
  },
  additionalProperties: false,
};

// Bulk delete schema
export const BulkDeleteSchema = {
  type: 'object',
  required: ['transactionIds'],
  properties: {
    transactionIds: {
      type: 'array',
      items: {
        type: 'string',
      },
      minItems: 1,
      description: 'At least one transaction ID is required',
    },
  },
  additionalProperties: false,
};

// Bulk duplicate schema
export const BulkDuplicateSchema = {
  type: 'object',
  required: ['transactionIds'],
  properties: {
    transactionIds: {
      type: 'array',
      items: {
        type: 'string',
      },
      minItems: 1,
      description: 'At least one transaction ID is required',
    },
  },
  additionalProperties: false,
};

// Bulk categorize schema
export const BulkCategorizeSchema = {
  type: 'object',
  required: ['transactionIds', 'categoryId'],
  properties: {
    transactionIds: {
      type: 'array',
      items: {
        type: 'string',
      },
      minItems: 1,
      description: 'At least one transaction ID is required',
    },
    categoryId: {
      type: 'string',
      minLength: 1,
      description: 'Category ID is required',
    },
  },
  additionalProperties: false,
};

// Bulk tag schema
export const BulkTagSchema = {
  type: 'object',
  required: ['transactionIds', 'tags'],
  properties: {
    transactionIds: {
      type: 'array',
      items: {
        type: 'string',
      },
      minItems: 1,
      description: 'At least one transaction ID is required',
    },
    tags: {
      type: 'array',
      items: {
        type: 'string',
      },
      minItems: 1,
      description: 'At least one tag is required',
    },
    operation: {
      type: 'string',
      enum: ['add', 'remove', 'replace'],
      default: 'add',
      description: 'Tag operation type',
    },
  },
  additionalProperties: false,
};

// Bulk export schema
export const BulkExportSchema = {
  type: 'object',
  required: ['transactionIds'],
  properties: {
    transactionIds: {
      type: 'array',
      items: {
        type: 'string',
      },
      minItems: 1,
      description: 'At least one transaction ID is required',
    },
    format: {
      type: 'string',
      enum: ['csv', 'json'],
      default: 'csv',
      description: 'Export format',
    },
  },
  additionalProperties: false,
};

