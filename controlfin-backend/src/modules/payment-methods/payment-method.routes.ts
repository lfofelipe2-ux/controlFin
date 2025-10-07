import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { authMiddleware } from '../../middlewares/auth.middleware';
import {
  CreatePaymentMethodSchema,
  PaymentMethodQuerySchema,
  UpdatePaymentMethodSchema,
} from './payment-method.schemas.json';
import { paymentMethodService } from './payment-method.service';

export async function paymentMethodRoutes(fastify: FastifyInstance) {
  // Apply authentication middleware to all routes
  fastify.addHook('preHandler', authMiddleware);

  // Create payment method
  fastify.post(
    '/',
    {
      schema: {
        body: CreatePaymentMethodSchema,
        response: {
          201: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              paymentMethod: {
                type: 'object',
                properties: {
                  _id: { type: 'string' },
                  spaceId: { type: 'string' },
                  userId: { type: 'string' },
                  name: { type: 'string' },
                  description: { type: 'string', nullable: true },
                  type: {
                    type: 'string',
                    enum: ['cash', 'card', 'bank', 'digital', 'crypto', 'other'],
                  },
                  icon: { type: 'string', nullable: true },
                  color: { type: 'string' },
                  isDefault: { type: 'boolean' },
                  metadata: {
                    type: 'object',
                    properties: {
                      last4Digits: { type: 'string', nullable: true },
                      bankName: { type: 'string', nullable: true },
                      accountNumber: { type: 'string', nullable: true },
                      routingNumber: { type: 'string', nullable: true },
                      cardType: { type: 'string', nullable: true },
                      expiryDate: { type: 'string', nullable: true },
                      currency: { type: 'string', nullable: true },
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
        const userId = (request as any).user?.id;
        const paymentMethodData = request.body;

        const paymentMethod = await paymentMethodService.createPaymentMethod({
 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...(paymentMethodData as any),
          userId,
        });

        return reply.status(201).send({
          message: 'Payment method created successfully',
          paymentMethod,
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(400).send({
          message: 'Failed to create payment method',
          error: (error as Error)?.message || 'Unknown error',
        });
      }
    }
  );

  // Get payment methods
  fastify.get(
    '/',
    {
      schema: {
        querystring: PaymentMethodQuerySchema,
        response: {
          200: {
            type: 'object',
            properties: {
              paymentMethods: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    _id: { type: 'string' },
                    spaceId: { type: 'string' },
                    userId: { type: 'string' },
                    name: { type: 'string' },
                    description: { type: 'string', nullable: true },
                    type: {
                      type: 'string',
                      enum: ['cash', 'card', 'bank', 'digital', 'crypto', 'other'],
                    },
                    icon: { type: 'string', nullable: true },
                    color: { type: 'string' },
                    isDefault: { type: 'boolean' },
                    metadata: {
                      type: 'object',
                      properties: {
                        last4Digits: { type: 'string', nullable: true },
                        bankName: { type: 'string', nullable: true },
                        accountNumber: { type: 'string', nullable: true },
                        routingNumber: { type: 'string', nullable: true },
                        cardType: { type: 'string', nullable: true },
                        expiryDate: { type: 'string', nullable: true },
                        currency: { type: 'string', nullable: true },
                      },
                    },
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
 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userId = (request as any).user?.id;
        const query = request.query;

        const paymentMethods = await paymentMethodService.getPaymentMethods({
 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...(query as any),
          userId,
        });

        return reply.status(200).send({ paymentMethods });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(400).send({
          message: 'Failed to fetch payment methods',
          error: (error as Error)?.message || 'Unknown error',
        });
      }
    }
  );

  // Get payment method by ID
  fastify.get(
    '/:id',
    {
      schema: {
        params: { type: 'object', properties: { id: { type: 'string' } } },
        response: {
          200: {
            type: 'object',
            properties: {
              paymentMethod: {
                type: 'object',
                properties: {
                  _id: { type: 'string' },
                  spaceId: { type: 'string' },
                  userId: { type: 'string' },
                  name: { type: 'string' },
                  description: { type: 'string', nullable: true },
                  type: {
                    type: 'string',
                    enum: ['cash', 'card', 'bank', 'digital', 'crypto', 'other'],
                  },
                  icon: { type: 'string', nullable: true },
                  color: { type: 'string' },
                  isDefault: { type: 'boolean' },
                  metadata: {
                    type: 'object',
                    properties: {
                      last4Digits: { type: 'string', nullable: true },
                      bankName: { type: 'string', nullable: true },
                      accountNumber: { type: 'string', nullable: true },
                      routingNumber: { type: 'string', nullable: true },
                      cardType: { type: 'string', nullable: true },
                      expiryDate: { type: 'string', nullable: true },
                      currency: { type: 'string', nullable: true },
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
        const userId = (request as any).user?.id;
        const { id } = request.params as { id: string };

        const paymentMethod = await paymentMethodService.getPaymentMethodById(id, userId);

        if (!paymentMethod) {
          return reply.status(404).send({
            message: 'Payment method not found',
          });
        }

        return reply.status(200).send({ paymentMethod });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(400).send({
          message: 'Failed to fetch payment method',
          error: (error as Error)?.message || 'Unknown error',
        });
      }
    }
  );

  // Update payment method
  fastify.put(
    '/:id',
    {
      schema: {
        params: { type: 'object', properties: { id: { type: 'string' } } },
        body: UpdatePaymentMethodSchema,
        response: {
          200: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              paymentMethod: {
                type: 'object',
                properties: {
                  _id: { type: 'string' },
                  spaceId: { type: 'string' },
                  userId: { type: 'string' },
                  name: { type: 'string' },
                  description: { type: 'string', nullable: true },
                  type: {
                    type: 'string',
                    enum: ['cash', 'card', 'bank', 'digital', 'crypto', 'other'],
                  },
                  icon: { type: 'string', nullable: true },
                  color: { type: 'string' },
                  isDefault: { type: 'boolean' },
                  metadata: {
                    type: 'object',
                    properties: {
                      last4Digits: { type: 'string', nullable: true },
                      bankName: { type: 'string', nullable: true },
                      accountNumber: { type: 'string', nullable: true },
                      routingNumber: { type: 'string', nullable: true },
                      cardType: { type: 'string', nullable: true },
                      expiryDate: { type: 'string', nullable: true },
                      currency: { type: 'string', nullable: true },
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
        const userId = (request as any).user?.id;
        const { id } = request.params as { id: string };
        const updateData = request.body;

        const paymentMethod = await paymentMethodService.updatePaymentMethod(
          id,
 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
          updateData as any,
          userId
        );

        if (!paymentMethod) {
          return reply.status(404).send({
            message: 'Payment method not found',
          });
        }

        return reply.status(200).send({
          message: 'Payment method updated successfully',
          paymentMethod,
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(400).send({
          message: 'Failed to update payment method',
          error: (error as Error)?.message || 'Unknown error',
        });
      }
    }
  );

  // Delete payment method
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
        const { id } = request.params as { id: string };

        const deleted = await paymentMethodService.deletePaymentMethod(id, userId);

        if (!deleted) {
          return reply.status(404).send({
            message: 'Payment method not found',
          });
        }

        return reply.status(200).send({
          message: 'Payment method deleted successfully',
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(400).send({
          message: 'Failed to delete payment method',
          error: (error as Error)?.message || 'Unknown error',
        });
      }
    }
  );

  // Get default payment methods
  fastify.get(
    '/defaults',
    {
      schema: {
        response: {
          200: {
            type: 'object',
            properties: {
              paymentMethods: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    _id: { type: 'string' },
                    spaceId: { type: 'string' },
                    userId: { type: 'string' },
                    name: { type: 'string' },
                    description: { type: 'string', nullable: true },
                    type: {
                      type: 'string',
                      enum: ['cash', 'card', 'bank', 'digital', 'crypto', 'other'],
                    },
                    icon: { type: 'string', nullable: true },
                    color: { type: 'string' },
                    isDefault: { type: 'boolean' },
                    metadata: {
                      type: 'object',
                      properties: {
                        last4Digits: { type: 'string', nullable: true },
                        bankName: { type: 'string', nullable: true },
                        accountNumber: { type: 'string', nullable: true },
                        routingNumber: { type: 'string', nullable: true },
                        cardType: { type: 'string', nullable: true },
                        expiryDate: { type: 'string', nullable: true },
                        currency: { type: 'string', nullable: true },
                      },
                    },
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
 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userId = (request as any).user?.id;

        const paymentMethods = await paymentMethodService.getDefaultPaymentMethods(userId);

        return reply.status(200).send({ paymentMethods });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(400).send({
          message: 'Failed to fetch default payment methods',
          error: (error as Error)?.message || 'Unknown error',
        });
      }
    }
  );
}
