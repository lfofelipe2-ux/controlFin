import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { templateService } from './template.service';

const CreateTemplateSchema = z.object({
  spaceId: z.string(),
  name: z.string().min(1),
  description: z.string().min(1),
  type: z.enum(['income', 'expense', 'transfer']),
  amount: z.number().positive(),
  categoryId: z.string(),
  paymentMethodId: z.string(),
  tags: z.array(z.string()).optional(),
  metadata: z
    .object({
      location: z.string().optional(),
      notes: z.string().optional(),
      attachments: z.array(z.string()).optional(),
    })
    .optional(),
});

const UpdateTemplateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  type: z.enum(['income', 'expense', 'transfer']).optional(),
  amount: z.number().positive().optional(),
  categoryId: z.string().optional(),
  paymentMethodId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  metadata: z
    .object({
      location: z.string().optional(),
      notes: z.string().optional(),
      attachments: z.array(z.string()).optional(),
    })
    .optional(),
  isActive: z.boolean().optional(),
});

const TemplateQuerySchema = z.object({
  spaceId: z.string().optional(),
  type: z.enum(['income', 'expense', 'transfer']).optional(),
  isActive: z.boolean().optional(),
  search: z.string().optional(),
  page: z.number().min(1).optional().default(1),
  limit: z.number().min(1).max(100).optional().default(20),
  sortBy: z.enum(['name', 'usageCount', 'lastUsed', 'createdAt']).optional().default('name'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
});

const CreateFromTemplateSchema = z.object({
  templateId: z.string(),
  overrides: z
    .object({
      amount: z.number().positive().optional(),
      description: z.string().optional(),
      date: z.string().datetime().optional(),
      tags: z.array(z.string()).optional(),
      metadata: z
        .object({
          location: z.string().optional(),
          notes: z.string().optional(),
          attachments: z.array(z.string()).optional(),
        })
        .optional(),
    })
    .optional(),
});

const DuplicateTemplateSchema = z.object({
  templateId: z.string(),
  newName: z.string().optional(),
});

export async function templateRoutes(fastify: FastifyInstance) {
  // Apply authentication middleware to all routes
  fastify.addHook('preHandler', authMiddleware);

  // Create template
  fastify.post(
    '/',
    {
      schema: {
        body: CreateTemplateSchema,
        response: {
          201: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              template: {
                type: 'object',
                properties: {
                  _id: { type: 'string' },
                  spaceId: { type: 'string' },
                  userId: { type: 'string' },
                  name: { type: 'string' },
                  description: { type: 'string' },
                  type: { type: 'string', enum: ['income', 'expense', 'transfer'] },
                  amount: { type: 'number' },
                  categoryId: { type: 'string' },
                  paymentMethodId: { type: 'string' },
                  tags: { type: 'array', items: { type: 'string' } },
                  metadata: { type: 'object' },
                  isActive: { type: 'boolean' },
                  usageCount: { type: 'number' },
                  lastUsed: { type: 'string', nullable: true },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' },
                },
              },
            },
          },
          400: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              error: { type: 'string' },
            },
          },
          401: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = (request as any).user?.id;
        const templateData = request.body;

        const template = await templateService.createTemplate({
          ...(templateData as any),
          userId,
        });

        return reply.status(201).send({
          message: 'Template created successfully',
          template,
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(400).send({
          message: 'Failed to create template',
          error: (error as Error)?.message || 'Unknown error',
        });
      }
    }
  );

  // Get templates
  fastify.get(
    '/',
    {
      schema: {
        querystring: TemplateQuerySchema,
        response: {
          200: {
            type: 'object',
            properties: {
              templates: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    _id: { type: 'string' },
                    spaceId: { type: 'string' },
                    userId: { type: 'string' },
                    name: { type: 'string' },
                    description: { type: 'string' },
                    type: { type: 'string', enum: ['income', 'expense', 'transfer'] },
                    amount: { type: 'number' },
                    categoryId: { type: 'string' },
                    paymentMethodId: { type: 'string' },
                    tags: { type: 'array', items: { type: 'string' } },
                    metadata: { type: 'object' },
                    isActive: { type: 'boolean' },
                    usageCount: { type: 'number' },
                    lastUsed: { type: 'string', nullable: true },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                  },
                },
              },
              pagination: {
                type: 'object',
                properties: {
                  page: { type: 'number' },
                  limit: { type: 'number' },
                  total: { type: 'number' },
                  pages: { type: 'number' },
                },
              },
            },
          },
          400: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              error: { type: 'string' },
            },
          },
          401: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = (request as any).user?.id;
        const query = request.query;

        const result = await templateService.getTemplates({
          ...(query as any),
          userId,
        });

        return reply.status(200).send({
          templates: result.data,
          pagination: result.pagination,
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(400).send({
          message: 'Failed to fetch templates',
          error: (error as Error)?.message || 'Unknown error',
        });
      }
    }
  );

  // Get template by ID
  fastify.get(
    '/:id',
    {
      schema: {
        params: { type: 'object', properties: { id: { type: 'string' } } },
        response: {
          200: {
            type: 'object',
            properties: {
              template: {
                type: 'object',
                properties: {
                  _id: { type: 'string' },
                  spaceId: { type: 'string' },
                  userId: { type: 'string' },
                  name: { type: 'string' },
                  description: { type: 'string' },
                  type: { type: 'string', enum: ['income', 'expense', 'transfer'] },
                  amount: { type: 'number' },
                  categoryId: { type: 'string' },
                  paymentMethodId: { type: 'string' },
                  tags: { type: 'array', items: { type: 'string' } },
                  metadata: { type: 'object' },
                  isActive: { type: 'boolean' },
                  usageCount: { type: 'number' },
                  lastUsed: { type: 'string', nullable: true },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' },
                },
              },
            },
          },
          404: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
          401: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = (request as any).user?.id;
        const { id } = request.params as { id: string };

        const template = await templateService.getTemplateById(id, userId);

        if (!template) {
          return reply.status(404).send({
            message: 'Template not found',
          });
        }

        return reply.status(200).send({ template });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(400).send({
          message: 'Failed to fetch template',
          error: (error as Error)?.message || 'Unknown error',
        });
      }
    }
  );

  // Update template
  fastify.put(
    '/:id',
    {
      schema: {
        params: { type: 'object', properties: { id: { type: 'string' } } },
        body: UpdateTemplateSchema,
        response: {
          200: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              template: {
                type: 'object',
                properties: {
                  _id: { type: 'string' },
                  spaceId: { type: 'string' },
                  userId: { type: 'string' },
                  name: { type: 'string' },
                  description: { type: 'string' },
                  type: { type: 'string', enum: ['income', 'expense', 'transfer'] },
                  amount: { type: 'number' },
                  categoryId: { type: 'string' },
                  paymentMethodId: { type: 'string' },
                  tags: { type: 'array', items: { type: 'string' } },
                  metadata: { type: 'object' },
                  isActive: { type: 'boolean' },
                  usageCount: { type: 'number' },
                  lastUsed: { type: 'string', nullable: true },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' },
                },
              },
            },
          },
          404: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
          400: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              error: { type: 'string' },
            },
          },
          401: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = (request as any).user?.id;
        const { id } = request.params as { id: string };
        const updateData = request.body;

        const template = await templateService.updateTemplate(id, updateData as any, userId);

        if (!template) {
          return reply.status(404).send({
            message: 'Template not found',
          });
        }

        return reply.status(200).send({
          message: 'Template updated successfully',
          template,
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(400).send({
          message: 'Failed to update template',
          error: (error as Error)?.message || 'Unknown error',
        });
      }
    }
  );

  // Delete template
  fastify.delete(
    '/:id',
    {
      schema: {
        params: { type: 'object', properties: { id: { type: 'string' } } },
        response: {
          200: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
          404: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
          401: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = (request as any).user?.id;
        const { id } = request.params as { id: string };

        const deleted = await templateService.deleteTemplate(id, userId);

        if (!deleted) {
          return reply.status(404).send({
            message: 'Template not found',
          });
        }

        return reply.status(200).send({
          message: 'Template deleted successfully',
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(400).send({
          message: 'Failed to delete template',
          error: (error as Error)?.message || 'Unknown error',
        });
      }
    }
  );

  // Create transaction from template
  fastify.post(
    '/:id/create-transaction',
    {
      schema: {
        params: { type: 'object', properties: { id: { type: 'string' } } },
        body: CreateFromTemplateSchema,
        response: {
          201: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              transaction: {
                type: 'object',
                properties: {
                  _id: { type: 'string' },
                  spaceId: { type: 'string' },
                  userId: { type: 'string' },
                  type: { type: 'string', enum: ['income', 'expense', 'transfer'] },
                  amount: { type: 'number' },
                  description: { type: 'string' },
                  categoryId: { type: 'string' },
                  paymentMethodId: { type: 'string' },
                  date: { type: 'string', format: 'date-time' },
                  tags: { type: 'array', items: { type: 'string' } },
                  isRecurring: { type: 'boolean' },
                  recurringId: { type: 'string', nullable: true },
                  metadata: { type: 'object' },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' },
                },
              },
            },
          },
          400: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              error: { type: 'string' },
            },
          },
          401: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = (request as any).user?.id;
        const { id } = request.params as { id: string };
        const data = request.body;

        const transaction = await templateService.createTransactionFromTemplate(
          id,
          userId,
          (data as any).overrides
        );

        return reply.status(201).send({
          message: 'Transaction created from template successfully',
          transaction,
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(400).send({
          message: 'Failed to create transaction from template',
          error: (error as Error)?.message || 'Unknown error',
        });
      }
    }
  );

  // Get popular templates
  fastify.get(
    '/popular',
    {
      schema: {
        querystring: z.object({
          spaceId: z.string().optional(),
          limit: z.number().min(1).max(50).optional().default(10),
        }),
        response: {
          200: {
            type: 'object',
            properties: {
              templates: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    _id: { type: 'string' },
                    spaceId: { type: 'string' },
                    userId: { type: 'string' },
                    name: { type: 'string' },
                    description: { type: 'string' },
                    type: { type: 'string', enum: ['income', 'expense', 'transfer'] },
                    amount: { type: 'number' },
                    categoryId: { type: 'string' },
                    paymentMethodId: { type: 'string' },
                    tags: { type: 'array', items: { type: 'string' } },
                    metadata: { type: 'object' },
                    isActive: { type: 'boolean' },
                    usageCount: { type: 'number' },
                    lastUsed: { type: 'string', nullable: true },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
          400: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              error: { type: 'string' },
            },
          },
          401: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = (request as any).user?.id;
        const query = request.query;

        const templates = await templateService.getPopularTemplates(
          userId,
          (query as any).spaceId,
          (query as any).limit
        );

        return reply.status(200).send({ templates });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(400).send({
          message: 'Failed to fetch popular templates',
          error: (error as Error)?.message || 'Unknown error',
        });
      }
    }
  );

  // Duplicate template
  fastify.post(
    '/:id/duplicate',
    {
      schema: {
        params: { type: 'object', properties: { id: { type: 'string' } } },
        body: DuplicateTemplateSchema,
        response: {
          201: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              template: {
                type: 'object',
                properties: {
                  _id: { type: 'string' },
                  spaceId: { type: 'string' },
                  userId: { type: 'string' },
                  name: { type: 'string' },
                  description: { type: 'string' },
                  type: { type: 'string', enum: ['income', 'expense', 'transfer'] },
                  amount: { type: 'number' },
                  categoryId: { type: 'string' },
                  paymentMethodId: { type: 'string' },
                  tags: { type: 'array', items: { type: 'string' } },
                  metadata: { type: 'object' },
                  isActive: { type: 'boolean' },
                  usageCount: { type: 'number' },
                  lastUsed: { type: 'string', nullable: true },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' },
                },
              },
            },
          },
          400: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              error: { type: 'string' },
            },
          },
          401: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = (request as any).user?.id;
        const { id } = request.params as { id: string };
        const data = request.body;

        const template = await templateService.duplicateTemplate(id, userId, (data as any).newName);

        return reply.status(201).send({
          message: 'Template duplicated successfully',
          template,
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(400).send({
          message: 'Failed to duplicate template',
          error: (error as Error)?.message || 'Unknown error',
        });
      }
    }
  );

  // Get template stats
  fastify.get(
    '/stats',
    {
      schema: {
        querystring: z.object({
          spaceId: z.string().optional(),
        }),
        response: {
          200: {
            type: 'object',
            properties: {
              stats: {
                type: 'object',
                properties: {
                  totalTemplates: { type: 'number' },
                  activeTemplates: { type: 'number' },
                  byType: {
                    type: 'object',
                    properties: {
                      income: { type: 'number' },
                      expense: { type: 'number' },
                      transfer: { type: 'number' },
                    },
                  },
                  mostUsed: { type: 'object', nullable: true },
                  totalUsage: { type: 'number' },
                },
              },
            },
          },
          400: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              error: { type: 'string' },
            },
          },
          401: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = (request as any).user?.id;
        const query = request.query;

        const stats = await templateService.getTemplateStats(userId, (query as any).spaceId);

        return reply.status(200).send({ stats });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(400).send({
          message: 'Failed to fetch template stats',
          error: (error as Error)?.message || 'Unknown error',
        });
      }
    }
  );
}
