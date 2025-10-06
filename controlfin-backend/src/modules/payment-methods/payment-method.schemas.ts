import { z } from 'zod';

// Base payment method schema
const BasePaymentMethodSchema = z.object({
  spaceId: z.string().min(1, 'Space ID is required'),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  description: z.string().max(500, 'Description too long').optional(),
  type: z.enum(['cash', 'card', 'bank', 'digital', 'crypto', 'other']),
  icon: z.string().max(50, 'Icon name too long').optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color'),
  isDefault: z.boolean().optional().default(false),
  metadata: z
    .object({
      last4Digits: z.string().max(4, 'Last 4 digits too long').optional(),
      bankName: z.string().max(100, 'Bank name too long').optional(),
      accountNumber: z.string().max(50, 'Account number too long').optional(),
      routingNumber: z.string().max(20, 'Routing number too long').optional(),
      cardType: z.string().max(20, 'Card type too long').optional(),
      expiryDate: z.string().max(10, 'Expiry date too long').optional(),
      currency: z.string().max(10, 'Currency too long').optional(),
    })
    .optional()
    .default({}),
});

// Create payment method schema
export const CreatePaymentMethodSchema = BasePaymentMethodSchema;

// Update payment method schema (all fields optional except spaceId)
export const UpdatePaymentMethodSchema = BasePaymentMethodSchema.partial().extend({
  spaceId: z.string().min(1, 'Space ID is required'),
});

// Query parameters schema for filtering
export const PaymentMethodQuerySchema = z.object({
  spaceId: z.string().optional(),
  type: z.enum(['cash', 'card', 'bank', 'digital', 'crypto', 'other']).optional(),
  isDefault: z.boolean().optional(),
  search: z.string().optional(),
});

// Type exports
export type CreatePaymentMethodInput = z.infer<typeof CreatePaymentMethodSchema>;
export type UpdatePaymentMethodInput = z.infer<typeof UpdatePaymentMethodSchema>;
export type PaymentMethodQueryInput = z.infer<typeof PaymentMethodQuerySchema>;
