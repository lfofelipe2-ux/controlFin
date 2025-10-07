// JSON Schema definitions for Fastify validation

// Base category schema
const BaseCategorySchema = {
  type: 'object',
  required: ['spaceId', 'name', 'color', 'type'],
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
    color: {
      type: 'string',
      pattern: '^#[0-9A-F]{6}$',
    },
    icon: {
      type: 'string',
      maxLength: 50,
    },
    type: {
      type: 'string',
      enum: ['income', 'expense', 'transfer'],
    },
    isDefault: {
      type: 'boolean',
      default: false,
    },
    parentId: {
      type: 'string',
    },
  },
  additionalProperties: false,
};

// Create category schema
export const CreateCategorySchema = BaseCategorySchema;

// Update category schema (all fields optional except spaceId)
export const UpdateCategorySchema = {
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
    color: {
      type: 'string',
      pattern: '^#[0-9A-F]{6}$',
    },
    icon: {
      type: 'string',
      maxLength: 50,
    },
    type: {
      type: 'string',
      enum: ['income', 'expense', 'transfer'],
    },
    isDefault: {
      type: 'boolean',
    },
    parentId: {
      type: 'string',
    },
  },
  additionalProperties: false,
};

// Query parameters schema for filtering
export const CategoryQuerySchema = {
  type: 'object',
  properties: {
    spaceId: {
      type: 'string',
    },
    type: {
      type: 'string',
      enum: ['income', 'expense', 'transfer'],
    },
    isDefault: {
      type: 'boolean',
    },
    parentId: {
      type: 'string',
    },
    search: {
      type: 'string',
    },
  },
  additionalProperties: false,
};

// Type definitions for TypeScript
export interface CreateCategoryInput {
  spaceId: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  type: 'income' | 'expense' | 'transfer';
  isDefault?: boolean;
  parentId?: string;
}

export interface UpdateCategoryInput {
  spaceId: string;
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
  type?: 'income' | 'expense' | 'transfer';
  isDefault?: boolean;
  parentId?: string;
}

export interface CategoryQueryInput {
  spaceId?: string;
  type?: 'income' | 'expense' | 'transfer';
  isDefault?: boolean;
  parentId?: string;
  search?: string;
}

