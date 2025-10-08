// JSON Schema definitions for Fastify validation

// Base payment method schema
const BasePaymentMethodSchema = {
  type: 'object',
  required: ['spaceId', 'name', 'type', 'color'],
  properties: {
    spaceId: {
      type: 'string',
      minLength: 1,
    },
    name: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
    },
    description: {
      type: 'string',
      maxLength: 500,
    },
    type: {
      type: 'string',
      enum: ['cash', 'card', 'bank', 'digital', 'crypto', 'other'],
    },
    icon: {
      type: 'string',
      maxLength: 50,
    },
    color: {
      type: 'string',
      pattern: '^#[0-9A-F]{6}$',
    },
    isDefault: {
      type: 'boolean',
      default: false,
    },
    metadata: {
      type: 'object',
      properties: {
        last4Digits: {
          type: 'string',
          maxLength: 4,
        },
        bankName: {
          type: 'string',
          maxLength: 100,
        },
        accountNumber: {
          type: 'string',
          maxLength: 50,
        },
        routingNumber: {
          type: 'string',
          maxLength: 20,
        },
        cardType: {
          type: 'string',
          maxLength: 20,
        },
        expiryDate: {
          type: 'string',
          maxLength: 10,
        },
        currency: {
          type: 'string',
          maxLength: 10,
        },
      },
      additionalProperties: false,
    },
  },
  additionalProperties: false,
};

// Create payment method schema
export const CreatePaymentMethodSchema = BasePaymentMethodSchema;

// Update payment method schema (all fields optional except spaceId)
export const UpdatePaymentMethodSchema = {
  type: 'object',
  required: ['spaceId'],
  properties: {
    spaceId: {
      type: 'string',
      minLength: 1,
    },
    name: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
    },
    description: {
      type: 'string',
      maxLength: 500,
    },
    type: {
      type: 'string',
      enum: ['cash', 'card', 'bank', 'digital', 'crypto', 'other'],
    },
    icon: {
      type: 'string',
      maxLength: 50,
    },
    color: {
      type: 'string',
      pattern: '^#[0-9A-F]{6}$',
    },
    isDefault: {
      type: 'boolean',
    },
    metadata: {
      type: 'object',
      properties: {
        last4Digits: {
          type: 'string',
          maxLength: 4,
        },
        bankName: {
          type: 'string',
          maxLength: 100,
        },
        accountNumber: {
          type: 'string',
          maxLength: 50,
        },
        routingNumber: {
          type: 'string',
          maxLength: 20,
        },
        cardType: {
          type: 'string',
          maxLength: 20,
        },
        expiryDate: {
          type: 'string',
          maxLength: 10,
        },
        currency: {
          type: 'string',
          maxLength: 10,
        },
      },
      additionalProperties: false,
    },
  },
  additionalProperties: false,
};

// Query parameters schema for filtering
export const PaymentMethodQuerySchema = {
  type: 'object',
  properties: {
    spaceId: {
      type: 'string',
    },
    type: {
      type: 'string',
      enum: ['cash', 'card', 'bank', 'digital', 'crypto', 'other'],
    },
    isDefault: {
      type: 'boolean',
    },
    search: {
      type: 'string',
    },
  },
  additionalProperties: false,
};

// Type definitions for TypeScript
export interface CreatePaymentMethodInput {
  spaceId: string;
  name: string;
  description?: string;
  type: 'cash' | 'card' | 'bank' | 'digital' | 'crypto' | 'other';
  icon?: string;
  color: string;
  isDefault?: boolean;
  metadata?: {
    last4Digits?: string;
    bankName?: string;
    accountNumber?: string;
    routingNumber?: string;
    cardType?: string;
    expiryDate?: string;
    currency?: string;
  };
}

export interface UpdatePaymentMethodInput {
  spaceId: string;
  name?: string;
  description?: string;
  type?: 'cash' | 'card' | 'bank' | 'digital' | 'crypto' | 'other';
  icon?: string;
  color?: string;
  isDefault?: boolean;
  metadata?: {
    last4Digits?: string;
    bankName?: string;
    accountNumber?: string;
    routingNumber?: string;
    cardType?: string;
    expiryDate?: string;
    currency?: string;
  };
}

export interface PaymentMethodQueryInput {
  spaceId?: string;
  type?: 'cash' | 'card' | 'bank' | 'digital' | 'crypto' | 'other';
  isDefault?: boolean;
  search?: string;
}

