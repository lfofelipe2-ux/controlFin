import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { createErrorResponse } from '../../utils/route-helpers';
import { zodToFastifySchema } from '../../utils/schema-converter';
import {
  TransactionQuerySchema
} from './transaction.schemas';
import { transactionService } from './transaction.service';

export async function transactionRoutes(fastify: FastifyInstance) {
  // Security middleware is applied globally in server.ts

  // Create transaction
  fastify.post(
    '/',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            type: { type: 'string', enum: ['income', 'expense', 'transfer'] },
            amount: { type: 'number' },
            description: { type: 'string' },
            categoryId: { type: 'string' },
            paymentMethodId: { type: 'string' },
            date: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
            isRecurring: { type: 'boolean' },
            recurringId: { type: 'string' },
            metadata: {
              type: 'object',
              properties: {
                location: { type: 'string' },
                notes: { type: 'string' },
                attachments: { type: 'array', items: { type: 'string' } },
              },
            },
          },
          required: ['type', 'amount', 'description', 'categoryId', 'paymentMethodId', 'date'],
        },
        querystring: {
          type: 'object',
          properties: {
            spaceId: { type: 'string' },
          },
          required: ['spaceId'],
        },
        response: {
          201: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: {
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
              message: { type: 'string' },
            },
          },
          400: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              error: { type: 'string' },
              code: { type: 'string' },
              statusCode: { type: 'number' },
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
        const { spaceId } = request.query as { spaceId: string };



        const transaction = await transactionService.createTransaction({
          ...(transactionData as Record<string, unknown>),
          userId,
          spaceId,
        } as CreateTransactionData);

        reply.code(201).send({
          success: true,
          data: { transaction },
          message: 'Transaction created successfully',
        });
      } catch (error) {
        fastify.log.error(error);
        const errorMessage = (error as Error)?.message || 'Failed to create transaction';
        const statusCode = errorMessage.includes('not found') ? 404 : 400;
        createErrorResponse(
          reply,
          'TRANSACTION_CREATE_FAILED',
          errorMessage,
          statusCode
        );
      }
    }
  );

  // Get transactions with filtering and pagination
  fastify.get(
    '/',
    {
      schema: {
        querystring: {
          type: 'object',
          properties: {
            spaceId: { type: 'string' },
            userId: { type: 'string' },
            type: { type: 'string', enum: ['income', 'expense', 'transfer', 'all'] },
            categoryId: { type: 'string' },
            paymentMethodId: { type: 'string' },
            startDate: { type: 'string' },
            endDate: { type: 'string' },
            minAmount: { type: 'number' },
            maxAmount: { type: 'number' },
            tags: { type: 'array', items: { type: 'string' } },
            isRecurring: { type: 'boolean' },
            search: { type: 'string' },
            sortBy: { type: 'string', enum: ['date', 'amount', 'description', 'createdAt'] },
            sortOrder: { type: 'string', enum: ['asc', 'desc'] },
            page: { type: 'number' },
            limit: { type: 'number' },
          },
          // Remove required validation to allow middleware to handle authentication first
        },
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: {
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
            },
          },
          400: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              error: { type: 'string' },
              code: { type: 'string' },
              statusCode: { type: 'number' },
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
          ...(query as Record<string, unknown>),
          userId,
        });

        reply.code(200).send({
          success: true,
          data: result,
          message: 'Transactions retrieved successfully',
        });
      } catch (error) {
        fastify.log.error(error);
        reply.code(400).send({
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
              success: { type: 'boolean' },
              data: {
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
              success: { type: 'boolean' },
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

        const transaction = await transactionService.getTransactionById(id, userId);

        reply.code(200).send({
          success: true,
          data: transaction,
          message: 'Transaction retrieved successfully',
        });
      } catch (error) {
        fastify.log.error(error);
        const errorMessage = (error as Error)?.message || 'Unknown error';
        const statusCode = errorMessage.includes('not found') ? 404 : 400;
        reply.code(statusCode).send({
          success: false,
          message: errorMessage,
          error: errorMessage,
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
        body: {
          type: 'object',
          properties: {
            type: { type: 'string', enum: ['income', 'expense', 'transfer'] },
            amount: { type: 'number' },
            description: { type: 'string' },
            categoryId: { type: 'string' },
            paymentMethodId: { type: 'string' },
            date: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
            isRecurring: { type: 'boolean' },
            recurringId: { type: 'string' },
            metadata: {
              type: 'object',
              properties: {
                location: { type: 'string' },
                notes: { type: 'string' },
                attachments: { type: 'array', items: { type: 'string' } },
              },
            },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: {
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
              message: { type: 'string' },
            },
          },
          404: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
              error: { type: 'string' },
            },
          },
          400: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              error: { type: 'string' },
              code: { type: 'string' },
              statusCode: { type: 'number' },
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

        reply.code(200).send({
          success: true,
          data: transaction,
          message: 'Transaction updated successfully',
        });
      } catch (error) {
        fastify.log.error(error);
        const errorMessage = (error as Error)?.message || 'Unknown error';
        const statusCode = errorMessage.includes('not found') ? 404 : 400;
        reply.code(statusCode).send({
          success: false,
          message: errorMessage,
          error: errorMessage,
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
              success: { type: 'boolean' },
              data: {
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
              message: { type: 'string' },
            },
          },
          404: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
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

        const deleted = await transactionService.deleteTransaction(id, userId);

        reply.code(200).send({
          success: true,
          data: deleted,
          message: 'Transaction deleted successfully',
        });
      } catch (error) {
        fastify.log.error(error);
        const errorMessage = (error as Error)?.message || 'Unknown error';
        const statusCode = errorMessage.includes('not found') ? 404 : 400;
        reply.code(statusCode).send({
          success: false,
          message: errorMessage,
          error: errorMessage,
        });
      }
    }
  );

  // Get transaction statistics
  fastify.get(
    '/stats/summary',
    {
      schema: {
        querystring: {
          type: 'object',
          properties: {
            spaceId: { type: 'string' },
          },
          required: ['spaceId'],
        },
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: {
                type: 'object',
                properties: {
                  totalIncome: { type: 'number' },
                  totalExpense: { type: 'number' },
                  netAmount: { type: 'number' },
                  transactionCount: { type: 'number' },
                  averageTransaction: { type: 'number' },
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
              message: { type: 'string' },
            },
          },
          400: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              error: { type: 'string' },
              code: { type: 'string' },
              statusCode: { type: 'number' },
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

        reply.code(200).send({
          success: true,
          data: stats,
          message: 'Transaction statistics retrieved successfully',
        });
      } catch (error) {
        fastify.log.error(error);
        reply.code(400).send({
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
              success: { type: 'boolean' },
              error: { type: 'string' },
              code: { type: 'string' },
              statusCode: { type: 'number' },
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

        reply.code(200).send(result);
      } catch (error) {
        fastify.log.error(error);
        reply.code(400).send({
          message: 'Failed to search transactions',
          error: (error as Error)?.message || 'Unknown error',
        });
      }
    }
  );
}
