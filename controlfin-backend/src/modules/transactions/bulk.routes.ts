import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { bulkService } from './bulk.service';

const BulkCreateSchema = z.object({
  spaceId: z.string(),
  transactions: z.array(
    z.object({
      type: z.enum(['income', 'expense', 'transfer']),
      amount: z.number().positive(),
      description: z.string().min(1),
      categoryId: z.string(),
      paymentMethodId: z.string(),
      date: z.string().datetime(),
      tags: z.array(z.string()).optional(),
      isRecurring: z.boolean().optional(),
      recurringId: z.string().optional(),
      metadata: z
        .object({
          location: z.string().optional(),
          notes: z.string().optional(),
          attachments: z.array(z.string()).optional(),
        })
        .optional(),
    })
  ),
});

const BulkUpdateSchema = z.object({
  transactionIds: z.array(z.string()),
  updates: z.object({
    type: z.enum(['income', 'expense', 'transfer']).optional(),
    amount: z.number().positive().optional(),
    description: z.string().min(1).optional(),
    categoryId: z.string().optional(),
    paymentMethodId: z.string().optional(),
    date: z.string().datetime().optional(),
    tags: z.array(z.string()).optional(),
    isRecurring: z.boolean().optional(),
    recurringId: z.string().optional(),
    metadata: z
      .object({
        location: z.string().optional(),
        notes: z.string().optional(),
        attachments: z.array(z.string()).optional(),
      })
      .optional(),
  }),
});

const BulkDeleteSchema = z.object({
  transactionIds: z.array(z.string()),
});

const BulkDuplicateSchema = z.object({
  transactionIds: z.array(z.string()),
});

const BulkCategorizeSchema = z.object({
  transactionIds: z.array(z.string()),
  categoryId: z.string(),
});

const BulkTagSchema = z.object({
  transactionIds: z.array(z.string()),
  tags: z.array(z.string()),
  operation: z.enum(['add', 'remove', 'replace']).optional().default('add'),
});

const BulkExportSchema = z.object({
  transactionIds: z.array(z.string()),
  format: z.enum(['csv', 'json']).optional().default('csv'),
});

export async function bulkRoutes(fastify: FastifyInstance) {
  // Apply authentication middleware to all routes
  fastify.addHook('preHandler', authMiddleware);

  // Bulk create transactions
  fastify.post(
    '/create',
    {
      schema: {
        body: BulkCreateSchema,
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              processed: { type: 'number' },
              failed: { type: 'number' },
              errors: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    transactionId: { type: 'string' },
                    error: { type: 'string' },
                    index: { type: 'number' },
                  },
                },
              },
              created: {
                type: 'array',
                items: { type: 'object' },
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


        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userId = (request as any).user?.id;
        const data = request.body;

        const result = await bulkService.bulkCreate({



          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...(data as any),
          userId,
        });

        return reply.status(200).send(result);
      } catch (error) {
        fastify.log.error(error);
        return reply.status(400).send({
          message: 'Failed to bulk create transactions',
          error: (error as Error)?.message || 'Unknown error',
        });
      }
    }
  );

  // Bulk update transactions
  fastify.put(
    '/update',
    {
      schema: {
        body: BulkUpdateSchema,
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              processed: { type: 'number' },
              failed: { type: 'number' },
              errors: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    transactionId: { type: 'string' },
                    error: { type: 'string' },
                    index: { type: 'number' },
                  },
                },
              },
              updated: {
                type: 'array',
                items: { type: 'object' },
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


        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userId = (request as any).user?.id;
        const data = request.body;



        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await bulkService.bulkUpdate(data as any, userId);

        return reply.status(200).send(result);
      } catch (error) {
        fastify.log.error(error);
        return reply.status(400).send({
          message: 'Failed to bulk update transactions',
          error: (error as Error)?.message || 'Unknown error',
        });
      }
    }
  );

  // Bulk delete transactions
  fastify.delete(
    '/delete',
    {
      schema: {
        body: BulkDeleteSchema,
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              processed: { type: 'number' },
              failed: { type: 'number' },
              errors: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    transactionId: { type: 'string' },
                    error: { type: 'string' },
                    index: { type: 'number' },
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


        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userId = (request as any).user?.id;
        const data = request.body;



        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await bulkService.bulkDelete(data as any, userId);

        return reply.status(200).send(result);
      } catch (error) {
        fastify.log.error(error);
        return reply.status(400).send({
          message: 'Failed to bulk delete transactions',
          error: (error as Error)?.message || 'Unknown error',
        });
      }
    }
  );

  // Bulk duplicate transactions
  fastify.post(
    '/duplicate',
    {
      schema: {
        body: BulkDuplicateSchema,
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              processed: { type: 'number' },
              failed: { type: 'number' },
              errors: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    transactionId: { type: 'string' },
                    error: { type: 'string' },
                    index: { type: 'number' },
                  },
                },
              },
              created: {
                type: 'array',
                items: { type: 'object' },
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


        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userId = (request as any).user?.id;
        const data = request.body;



        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await bulkService.bulkDuplicate((data as any).transactionIds, userId);

        return reply.status(200).send(result);
      } catch (error) {
        fastify.log.error(error);
        return reply.status(400).send({
          message: 'Failed to bulk duplicate transactions',
          error: (error as Error)?.message || 'Unknown error',
        });
      }
    }
  );

  // Bulk categorize transactions
  fastify.put(
    '/categorize',
    {
      schema: {
        body: BulkCategorizeSchema,
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              processed: { type: 'number' },
              failed: { type: 'number' },
              errors: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    transactionId: { type: 'string' },
                    error: { type: 'string' },
                    index: { type: 'number' },
                  },
                },
              },
              updated: {
                type: 'array',
                items: { type: 'object' },
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


        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userId = (request as any).user?.id;
        const data = request.body;

        const result = await bulkService.bulkCategorize(


          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (data as any).transactionIds,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (data as any).categoryId,
          userId
        );

        return reply.status(200).send(result);
      } catch (error) {
        fastify.log.error(error);
        return reply.status(400).send({
          message: 'Failed to bulk categorize transactions',
          error: (error as Error)?.message || 'Unknown error',
        });
      }
    }
  );

  // Bulk tag transactions
  fastify.put(
    '/tag',
    {
      schema: {
        body: BulkTagSchema,
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              processed: { type: 'number' },
              failed: { type: 'number' },
              errors: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    transactionId: { type: 'string' },
                    error: { type: 'string' },
                    index: { type: 'number' },
                  },
                },
              },
              updated: {
                type: 'array',
                items: { type: 'object' },
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


        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userId = (request as any).user?.id;
        const data = request.body;

        const result = await bulkService.bulkTag(


          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (data as any).transactionIds,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (data as any).tags,
          userId,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (data as any).operation
        );

        return reply.status(200).send(result);
      } catch (error) {
        fastify.log.error(error);
        return reply.status(400).send({
          message: 'Failed to bulk tag transactions',
          error: (error as Error)?.message || 'Unknown error',
        });
      }
    }
  );

  // Bulk export transactions
  fastify.post(
    '/export',
    {
      schema: {
        body: BulkExportSchema,
        response: {
          200: {
            type: 'object',
            properties: {
              data: { type: 'string' },
              filename: { type: 'string' },
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


        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userId = (request as any).user?.id;
        const data = request.body;

        const result = await bulkService.bulkExport(


          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (data as any).transactionIds,
          userId,


          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (data as any).format
        );

        return reply.status(200).send(result);
      } catch (error) {
        fastify.log.error(error);
        return reply.status(400).send({
          message: 'Failed to bulk export transactions',
          error: (error as Error)?.message || 'Unknown error',
        });
      }
    }
  );
}
