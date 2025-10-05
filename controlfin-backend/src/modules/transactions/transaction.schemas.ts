import { z } from 'zod';

// Base transaction schema
const BaseTransactionSchema = z.object({
  spaceId: z.string().min(1, 'Space ID is required'),
  type: z.enum(['income', 'expense', 'transfer']),
  amount: z.number().positive('Amount must be positive'),
  description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
  categoryId: z.string().min(1, 'Category ID is required'),
  paymentMethodId: z.string().min(1, 'Payment method ID is required'),
  date: z.string().datetime('Invalid date format'),
  tags: z.array(z.string().max(50, 'Tag too long')).optional().default([]),
  isRecurring: z.boolean().optional().default(false),
  recurringId: z.string().optional(),
  metadata: z
    .object({
      location: z.string().max(200, 'Location too long').optional(),
      notes: z.string().max(1000, 'Notes too long').optional(),
      attachments: z.array(z.string()).optional().default([]),
    })
    .optional()
    .default(() => ({ attachments: [] })),
});

// Create transaction schema
export const CreateTransactionSchema = BaseTransactionSchema;

// Update transaction schema (all fields optional except spaceId)
export const UpdateTransactionSchema = BaseTransactionSchema.partial().extend({
  spaceId: z.string().min(1, 'Space ID is required'),
});

// Query parameters schema for filtering
export const TransactionQuerySchema = z.object({
  spaceId: z.string().min(1, 'Space ID is required'),
  userId: z.string().optional(),
  type: z.enum(['income', 'expense', 'transfer', 'all']).optional().default('all'),
  categoryId: z.string().optional(),
  paymentMethodId: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  minAmount: z.number().positive().optional(),
  maxAmount: z.number().positive().optional(),
  tags: z.array(z.string()).optional(),
  isRecurring: z.boolean().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['date', 'amount', 'description', 'createdAt']).optional().default('date'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().max(100).optional().default(20),
});

// Bulk operations schema
export const BulkTransactionSchema = z.object({
  spaceId: z.string().min(1, 'Space ID is required'),
  transactionIds: z.array(z.string()).min(1, 'At least one transaction ID is required'),
  operation: z.enum(['delete', 'update', 'export']),
  updates: z
    .object({
      categoryId: z.string().optional(),
      paymentMethodId: z.string().optional(),
      tags: z.array(z.string()).optional(),
      isRecurring: z.boolean().optional(),
    })
    .optional(),
});

// Import schema for CSV/Excel import
export const ImportTransactionSchema = z.object({
  spaceId: z.string().min(1, 'Space ID is required'),
  userId: z.string().min(1, 'User ID is required'),
  transactions: z.array(BaseTransactionSchema).min(1, 'At least one transaction is required'),
  options: z
    .object({
      skipDuplicates: z.boolean().optional().default(true),
      updateExisting: z.boolean().optional().default(false),
      validateCategories: z.boolean().optional().default(true),
      validatePaymentMethods: z.boolean().optional().default(true),
    })
    .optional()
    .default(() => ({
      skipDuplicates: true,
      updateExisting: false,
      validateCategories: true,
      validatePaymentMethods: true,
    })),
});

// Export schema
export const ExportTransactionSchema = z.object({
  spaceId: z.string().min(1, 'Space ID is required'),
  userId: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  type: z.enum(['income', 'expense', 'transfer', 'all']).optional().default('all'),
  format: z.enum(['csv', 'excel', 'json']).optional().default('excel'),
  includeMetadata: z.boolean().optional().default(false),
  includeCategories: z.boolean().optional().default(true),
  includePaymentMethods: z.boolean().optional().default(true),
});

// Statistics schema
export const TransactionStatsSchema = z.object({
  spaceId: z.string().min(1, 'Space ID is required'),
  userId: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  groupBy: z.enum(['day', 'week', 'month', 'year']).optional().default('month'),
  includeBreakdown: z.boolean().optional().default(true),
});

// Recurring transaction schemas
export const CreateRecurringTransactionSchema = z.object({
  spaceId: z.string().min(1, 'Space ID is required'),
  userId: z.string().min(1, 'User ID is required'),
  type: z.enum(['income', 'expense', 'transfer']),
  amount: z.number().positive('Amount must be positive'),
  description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
  categoryId: z.string().min(1, 'Category ID is required'),
  paymentMethodId: z.string().min(1, 'Payment method ID is required'),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
  interval: z.number().int().positive('Interval must be positive').default(1),
  startDate: z.string().datetime('Invalid start date format'),
  endDate: z.string().datetime('Invalid end date format').optional(),
  isActive: z.boolean().optional().default(true),
  metadata: z
    .object({
      location: z.string().max(200, 'Location too long').optional(),
      notes: z.string().max(1000, 'Notes too long').optional(),
    })
    .optional()
    .default({}),
});

export const UpdateRecurringTransactionSchema = CreateRecurringTransactionSchema.partial().extend({
  spaceId: z.string().min(1, 'Space ID is required'),
});

// Type exports
export type CreateTransactionInput = z.infer<typeof CreateTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof UpdateTransactionSchema>;
export type TransactionQueryInput = z.infer<typeof TransactionQuerySchema>;
export type BulkTransactionInput = z.infer<typeof BulkTransactionSchema>;
export type ImportTransactionInput = z.infer<typeof ImportTransactionSchema>;
export type ExportTransactionInput = z.infer<typeof ExportTransactionSchema>;
export type TransactionStatsInput = z.infer<typeof TransactionStatsSchema>;
export type CreateRecurringTransactionInput = z.infer<typeof CreateRecurringTransactionSchema>;
export type UpdateRecurringTransactionInput = z.infer<typeof UpdateRecurringTransactionSchema>;
