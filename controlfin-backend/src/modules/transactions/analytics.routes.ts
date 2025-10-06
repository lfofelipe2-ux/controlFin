import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { analyticsService } from './analytics.service';

const AnalyticsQuerySchema = z.object({
  spaceId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  type: z.enum(['income', 'expense', 'transfer']).optional(),
  groupBy: z.enum(['day', 'week', 'month', 'year']).optional().default('month'),
});

export async function analyticsRoutes(fastify: FastifyInstance) {
  // Apply authentication middleware to all routes
  fastify.addHook('preHandler', authMiddleware);

  // Get spending trends
  fastify.get(
    '/trends',
    {
      schema: {
        querystring: AnalyticsQuerySchema,
        response: {
          200: {
            type: 'object',
            properties: {
              trends: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    period: { type: 'string' },
                    income: { type: 'number' },
                    expenses: { type: 'number' },
                    net: { type: 'number' },
                    transactionCount: { type: 'number' },
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
        const query = request.query;

        const trends = await analyticsService.getSpendingTrends({
 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...(query as any),
          userId,
        });

        return reply.status(200).send({ trends });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(400).send({
          message: 'Failed to fetch spending trends',
          error: (error as Error)?.message || 'Unknown error',
        });
      }
    }
  );

  // Get category analysis
  fastify.get(
    '/categories',
    {
      schema: {
        querystring: AnalyticsQuerySchema,
        response: {
          200: {
            type: 'object',
            properties: {
              categories: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    categoryId: { type: 'string' },
                    categoryName: { type: 'string' },
                    amount: { type: 'number' },
                    count: { type: 'number' },
                    percentage: { type: 'number' },
                    trend: { type: 'string', enum: ['up', 'down', 'stable'] },
                    avgTransaction: { type: 'number' },
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
        const query = request.query;

        const categories = await analyticsService.getCategoryAnalysis({
 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...(query as any),
          userId,
        });

        return reply.status(200).send({ categories });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(400).send({
          message: 'Failed to fetch category analysis',
          error: (error as Error)?.message || 'Unknown error',
        });
      }
    }
  );

  // Get payment method analysis
  fastify.get(
    '/payment-methods',
    {
      schema: {
        querystring: AnalyticsQuerySchema,
        response: {
          200: {
            type: 'object',
            properties: {
              paymentMethods: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    paymentMethodId: { type: 'string' },
                    paymentMethodName: { type: 'string' },
                    amount: { type: 'number' },
                    count: { type: 'number' },
                    percentage: { type: 'number' },
                    avgTransaction: { type: 'number' },
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
        const query = request.query;

        const paymentMethods = await analyticsService.getPaymentMethodAnalysis({
 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...(query as any),
          userId,
        });

        return reply.status(200).send({ paymentMethods });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(400).send({
          message: 'Failed to fetch payment method analysis',
          error: (error as Error)?.message || 'Unknown error',
        });
      }
    }
  );

  // Get monthly comparison
  fastify.get(
    '/monthly-comparison',
    {
      schema: {
        querystring: z.object({
          spaceId: z.string().optional(),
        }),
        response: {
          200: {
            type: 'object',
            properties: {
              comparison: {
                type: 'object',
                properties: {
                  currentMonth: {
                    type: 'object',
                    properties: {
                      income: { type: 'number' },
                      expenses: { type: 'number' },
                      net: { type: 'number' },
                      transactionCount: { type: 'number' },
                    },
                  },
                  previousMonth: {
                    type: 'object',
                    properties: {
                      income: { type: 'number' },
                      expenses: { type: 'number' },
                      net: { type: 'number' },
                      transactionCount: { type: 'number' },
                    },
                  },
                  changes: {
                    type: 'object',
                    properties: {
                      incomeChange: { type: 'number' },
                      expenseChange: { type: 'number' },
                      netChange: { type: 'number' },
                      transactionCountChange: { type: 'number' },
                    },
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
        const query = request.query;

        const comparison = await analyticsService.getMonthlyComparison({
 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...(query as any),
          userId,
        });

        return reply.status(200).send({ comparison });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(400).send({
          message: 'Failed to fetch monthly comparison',
          error: (error as Error)?.message || 'Unknown error',
        });
      }
    }
  );

  // Get financial health
  fastify.get(
    '/financial-health',
    {
      schema: {
        querystring: z.object({
          spaceId: z.string().optional(),
          startDate: z.string().optional(),
          endDate: z.string().optional(),
        }),
        response: {
          200: {
            type: 'object',
            properties: {
              health: {
                type: 'object',
                properties: {
                  totalIncome: { type: 'number' },
                  totalExpenses: { type: 'number' },
                  netWorth: { type: 'number' },
                  savingsRate: { type: 'number' },
                  expenseRatio: { type: 'number' },
                  monthlyTrend: { type: 'string', enum: ['improving', 'declining', 'stable'] },
                  topSpendingCategory: { type: 'string' },
                  topIncomeCategory: { type: 'string' },
                  averageTransaction: { type: 'number' },
                  transactionFrequency: { type: 'number' },
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
        const query = request.query;

        const health = await analyticsService.getFinancialHealth({
 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...(query as any),
          userId,
        });

        return reply.status(200).send({ health });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(400).send({
          message: 'Failed to fetch financial health',
          error: (error as Error)?.message || 'Unknown error',
        });
      }
    }
  );
}
