import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { zodToFastifySchema } from '../../utils/schema-converter';
import {
  CreateTransactionSchema,
  TransactionQuerySchema,
  TransactionStatsSchema,
  UpdateTransactionSchema,
} from './transaction.schemas';
import { transactionService } from './transaction.service';

export async function transactionRoutes(fastify: FastifyInstance) {
  // Apply authentication middleware to all routes
  fastify.addHook('preHandler', authMiddleware);

  // Create transaction
  fastify.post(
    '/',
    {
      schema: {
        body: zodToFastifySchema(CreateTransactionSchema),
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
                  metadata: {
                    type: 'object',
                    properties: {
                      location: { type: 'string', nullable: true },
                      notes: { type: 'string', nullable: true },
                      attachments: { type: 'array', items: { type: 'string' } },
                    },
                  },
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

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userId = (request as any).user?._id;
        const transactionData = request.body;

        const transaction = await transactionService.createTransaction({

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...(transactionData as any),
          userId,
        });

        return reply.status(201).send({
          message: 'Transaction created successfully',
          transaction,
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(400).send({
          message: 'Failed to create transaction',
          error: (error as Error)?.message || 'Unknown error',
        });
      }
    }
  );

  // Get transactions with filtering and pagination
  fastify.get(
    '/',
    {
      schema: {
        querystring: zodToFastifySchema(TransactionQuerySchema),
        response: {
          200: {
            type: 'object',
            properties: {
              transactions: {
                type: 'array',
                items: {
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
                    metadata: {
                      type: 'object',
                      properties: {
                        location: { type: 'string', nullable: true },
                        notes: { type: 'string', nullable: true },
                        attachments: { type: 'array', items: { type: 'string' } },
                      },
                    },
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

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userId = (request as any).user?._id;
        const query = request.query;

        const result = await transactionService.getTransactions({

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...(query as any),
          userId,
        });

        return reply.status(200).send(result);
      } catch (error) {
        fastify.log.error(error);
        return reply.status(400).send({
          message: 'Failed to fetch transactions',
          error: (error as Error)?.message || 'Unknown error',
        });
      }
    }
  );

  // Get transaction by ID
  fastify.get(
    '/:id',
    {
      schema: {
        params: { type: 'object', properties: { id: { type: 'string' } } },
        response: {
          200: {
            type: 'object',
            properties: {
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
                  metadata: {
                    type: 'object',
                    properties: {
                      location: { type: 'string', nullable: true },
                      notes: { type: 'string', nullable: true },
                      attachments: { type: 'array', items: { type: 'string' } },
                    },
                  },
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

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userId = (request as any).user?._id;
        const { id } = request.params as { id: string };

        const transaction = await transactionService.getTransactionById(id, userId);

        if (!transaction) {
          return reply.status(404).send({
            message: 'Transaction not found',
          });
        }

        return reply.status(200).send({ transaction });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(400).send({
          message: 'Failed to fetch transaction',
          error: (error as Error)?.message || 'Unknown error',
        });
      }
    }
  );

  // Update transaction
  fastify.put(
    '/:id',
    {
      schema: {
        params: { type: 'object', properties: { id: { type: 'string' } } },
        body: zodToFastifySchema(UpdateTransactionSchema),
        response: {
          200: {
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
                  metadata: {
                    type: 'object',
                    properties: {
                      location: { type: 'string', nullable: true },
                      notes: { type: 'string', nullable: true },
                      attachments: { type: 'array', items: { type: 'string' } },
                    },
                  },
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

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userId = (request as any).user?._id;
        const { id } = request.params as { id: string };
        const updateData = request.body;

        const transaction = await transactionService.updateTransaction(
          id,

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          updateData as any,
          userId
        );

        if (!transaction) {
          return reply.status(404).send({
            message: 'Transaction not found',
          });
        }

        return reply.status(200).send({
          message: 'Transaction updated successfully',
          transaction,
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(400).send({
          message: 'Failed to update transaction',
          error: (error as Error)?.message || 'Unknown error',
        });
      }
    }
  );

  // Delete transaction
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

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userId = (request as any).user?._id;
        const { id } = request.params as { id: string };

        const deleted = await transactionService.deleteTransaction(id, userId);

        if (!deleted) {
          return reply.status(404).send({
            message: 'Transaction not found',
          });
        }

        return reply.status(200).send({
          message: 'Transaction deleted successfully',
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(400).send({
          message: 'Failed to delete transaction',
          error: (error as Error)?.message || 'Unknown error',
        });
      }
    }
  );

  // Get transaction statistics
  fastify.get(
    '/stats/summary',
    {
      schema: {
        querystring: zodToFastifySchema(TransactionStatsSchema),
        response: {
          200: {
            type: 'object',
            properties: {
              summary: {
                type: 'object',
                properties: {
                  totalIncome: { type: 'number' },
                  totalExpenses: { type: 'number' },
                  netAmount: { type: 'number' },
                  transactionCount: { type: 'number' },
                  averageTransaction: { type: 'number' },
                },
              },
              byCategory: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    categoryId: { type: 'string' },
                    categoryName: { type: 'string' },
                    amount: { type: 'number' },
                    count: { type: 'number' },
                    percentage: { type: 'number' },
                  },
                },
              },
              byPaymentMethod: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    paymentMethodId: { type: 'string' },
                    paymentMethodName: { type: 'string' },
                    amount: { type: 'number' },
                    count: { type: 'number' },
                    percentage: { type: 'number' },
                  },
                },
              },
              monthlyTrend: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    month: { type: 'string' },
                    income: { type: 'number' },
                    expenses: { type: 'number' },
                    net: { type: 'number' },
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
        const userId = (request as any).user?._id;
        const query = request.query;

        const stats = await transactionService.getTransactionStats({

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...(query as any),
          userId,
        });

        return reply.status(200).send(stats);
      } catch (error) {
        fastify.log.error(error);
        return reply.status(400).send({
          message: 'Failed to fetch transaction statistics',
          error: (error as Error)?.message || 'Unknown error',
        });
      }
    }
  );

  // Search transactions
  fastify.get(
    '/search',
    {
      schema: {
        querystring: zodToFastifySchema(TransactionQuerySchema),
        response: {
          200: {
            type: 'object',
            properties: {
              transactions: {
                type: 'array',
                items: {
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
                    metadata: {
                      type: 'object',
                      properties: {
                        location: { type: 'string', nullable: true },
                        notes: { type: 'string', nullable: true },
                        attachments: { type: 'array', items: { type: 'string' } },
                      },
                    },
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

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userId = (request as any).user?._id;
        const query = request.query;

        const result = await transactionService.searchTransactions({

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...(query as any),
          userId,
        });

        return reply.status(200).send(result);
      } catch (error) {
        fastify.log.error(error);
        return reply.status(400).send({
          message: 'Failed to search transactions',
          error: (error as Error)?.message || 'Unknown error',
        });
      }
    }
  );
}
