// JSON Schema definitions for template validation
// These schemas are used by Fastify for request validation

// Create template schema
export const CreateTemplateSchema = {
  type: 'object',
  required: ['spaceId', 'name', 'description', 'type', 'amount', 'categoryId', 'paymentMethodId'],
  properties: {
    spaceId: {
      type: 'string',
      minLength: 1,
      description: 'Space ID is required',
    },
    name: {
      type: 'string',
      minLength: 1,
      description: 'Template name is required',
    },
    description: {
      type: 'string',
      minLength: 1,
      description: 'Template description is required',
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
    tags: {
      type: 'array',
      items: {
        type: 'string',
      },
      description: 'Template tags',
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
      description: 'Additional template metadata',
    },
  },
  additionalProperties: false,
};

// Update template schema
export const UpdateTemplateSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 1,
      description: 'Template name',
    },
    description: {
      type: 'string',
      minLength: 1,
      description: 'Template description',
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
    categoryId: {
      type: 'string',
      description: 'Category ID',
    },
    paymentMethodId: {
      type: 'string',
      description: 'Payment method ID',
    },
    tags: {
      type: 'array',
      items: {
        type: 'string',
      },
      description: 'Template tags',
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
      description: 'Additional template metadata',
    },
    isActive: {
      type: 'boolean',
      description: 'Whether the template is active',
    },
  },
  additionalProperties: false,
};

// Template query schema
export const TemplateQuerySchema = {
  type: 'object',
  properties: {
    spaceId: {
      type: 'string',
      description: 'Space ID filter',
    },
    type: {
      type: 'string',
      enum: ['income', 'expense', 'transfer'],
      description: 'Transaction type filter',
    },
    isActive: {
      type: 'boolean',
      description: 'Active status filter',
    },
    search: {
      type: 'string',
      description: 'Search term for name and description',
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
    sortBy: {
      type: 'string',
      enum: ['name', 'usageCount', 'lastUsed', 'createdAt'],
      default: 'name',
      description: 'Field to sort by',
    },
    sortOrder: {
      type: 'string',
      enum: ['asc', 'desc'],
      default: 'asc',
      description: 'Sort order',
    },
  },
  additionalProperties: false,
};

// Create from template schema
export const CreateFromTemplateSchema = {
  type: 'object',
  required: ['templateId'],
  properties: {
    templateId: {
      type: 'string',
      minLength: 1,
      description: 'Template ID is required',
    },
    overrides: {
      type: 'object',
      properties: {
        amount: {
          type: 'number',
          minimum: 0.01,
          description: 'Override amount',
        },
        description: {
          type: 'string',
          description: 'Override description',
        },
        date: {
          type: 'string',
          format: 'date-time',
          description: 'Override date',
        },
        tags: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'Override tags',
        },
        metadata: {
          type: 'object',
          properties: {
            location: {
              type: 'string',
              description: 'Override location',
            },
            notes: {
              type: 'string',
              description: 'Override notes',
            },
            attachments: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Override attachments',
            },
          },
          additionalProperties: false,
          description: 'Override metadata',
        },
      },
      additionalProperties: false,
      description: 'Overrides for template values',
    },
  },
  additionalProperties: false,
};

// Duplicate template schema
export const DuplicateTemplateSchema = {
  type: 'object',
  required: ['templateId'],
  properties: {
    templateId: {
      type: 'string',
      minLength: 1,
      description: 'Template ID is required',
    },
    newName: {
      type: 'string',
      description: 'New name for the duplicated template',
    },
  },
  additionalProperties: false,
};

// Popular templates query schema
export const PopularTemplatesQuerySchema = {
  type: 'object',
  properties: {
    spaceId: {
      type: 'string',
      description: 'Space ID filter',
    },
    limit: {
      type: 'integer',
      minimum: 1,
      maximum: 50,
      default: 10,
      description: 'Number of popular templates to return',
    },
  },
  additionalProperties: false,
};

// Template stats query schema
export const TemplateStatsQuerySchema = {
  type: 'object',
  properties: {
    spaceId: {
      type: 'string',
      description: 'Space ID filter',
    },
  },
  additionalProperties: false,
};

