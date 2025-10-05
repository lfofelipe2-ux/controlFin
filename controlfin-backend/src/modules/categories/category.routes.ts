import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { authMiddleware } from '../../middlewares/auth.middleware';
import {
  CategoryQuerySchema,
  CreateCategorySchema,
  UpdateCategorySchema,
} from './category.schemas';
import { categoryService } from './category.service';

export async function categoryRoutes(fastify: FastifyInstance) {
  // Apply authentication middleware to all routes
  fastify.addHook('preHandler', authMiddleware);

  // Create category
  fastify.post(
    '/',
    {
      schema: {
        body: CreateCategorySchema,
        response: {
          201: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              category: {
                type: 'object',
                properties: {
                  _id: { type: 'string' },
                  spaceId: { type: 'string' },
                  userId: { type: 'string' },
                  name: { type: 'string' },
                  description: { type: 'string', nullable: true },
                  color: { type: 'string' },
                  icon: { type: 'string', nullable: true },
                  type: { type: 'string', enum: ['income', 'expense', 'transfer'] },
                  isDefault: { type: 'boolean' },
                  parentId: { type: 'string', nullable: true },
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
        const categoryData = request.body;

        const category = await categoryService.createCategory({
          ...(categoryData as any),
          userId,
        });

        return reply.status(201).send({
          message: 'Category created successfully',
          category,
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(400).send({
          message: 'Failed to create category',
          error: (error as Error)?.message || 'Unknown error',
        });
      }
    }
  );

  // Get categories
  fastify.get(
    '/',
    {
      schema: {
        querystring: CategoryQuerySchema,
        response: {
          200: {
            type: 'object',
            properties: {
              categories: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    _id: { type: 'string' },
                    spaceId: { type: 'string' },
                    userId: { type: 'string' },
                    name: { type: 'string' },
                    description: { type: 'string', nullable: true },
                    color: { type: 'string' },
                    icon: { type: 'string', nullable: true },
                    type: { type: 'string', enum: ['income', 'expense', 'transfer'] },
                    isDefault: { type: 'boolean' },
                    parentId: { type: 'string', nullable: true },
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

        const categories = await categoryService.getCategories({
          ...(query as any),
          userId,
        });

        return reply.status(200).send({ categories });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(400).send({
          message: 'Failed to fetch categories',
          error: (error as Error)?.message || 'Unknown error',
        });
      }
    }
  );

  // Get category by ID
  fastify.get(
    '/:id',
    {
      schema: {
        params: { type: 'object', properties: { id: { type: 'string' } } },
        response: {
          200: {
            type: 'object',
            properties: {
              category: {
                type: 'object',
                properties: {
                  _id: { type: 'string' },
                  spaceId: { type: 'string' },
                  userId: { type: 'string' },
                  name: { type: 'string' },
                  description: { type: 'string', nullable: true },
                  color: { type: 'string' },
                  icon: { type: 'string', nullable: true },
                  type: { type: 'string', enum: ['income', 'expense', 'transfer'] },
                  isDefault: { type: 'boolean' },
                  parentId: { type: 'string', nullable: true },
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

        const category = await categoryService.getCategoryById(id, userId);

        if (!category) {
          return reply.status(404).send({
            message: 'Category not found',
          });
        }

        return reply.status(200).send({ category });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(400).send({
          message: 'Failed to fetch category',
          error: (error as Error)?.message || 'Unknown error',
        });
      }
    }
  );

  // Update category
  fastify.put(
    '/:id',
    {
      schema: {
        params: { type: 'object', properties: { id: { type: 'string' } } },
        body: UpdateCategorySchema,
        response: {
          200: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              category: {
                type: 'object',
                properties: {
                  _id: { type: 'string' },
                  spaceId: { type: 'string' },
                  userId: { type: 'string' },
                  name: { type: 'string' },
                  description: { type: 'string', nullable: true },
                  color: { type: 'string' },
                  icon: { type: 'string', nullable: true },
                  type: { type: 'string', enum: ['income', 'expense', 'transfer'] },
                  isDefault: { type: 'boolean' },
                  parentId: { type: 'string', nullable: true },
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

        const category = await categoryService.updateCategory(id, updateData as any, userId);

        if (!category) {
          return reply.status(404).send({
            message: 'Category not found',
          });
        }

        return reply.status(200).send({
          message: 'Category updated successfully',
          category,
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(400).send({
          message: 'Failed to update category',
          error: (error as Error)?.message || 'Unknown error',
        });
      }
    }
  );

  // Delete category
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
        const userId = (request as any).user?.id;
        const { id } = request.params as { id: string };

        const deleted = await categoryService.deleteCategory(id, userId);

        if (!deleted) {
          return reply.status(404).send({
            message: 'Category not found',
          });
        }

        return reply.status(200).send({
          message: 'Category deleted successfully',
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(400).send({
          message: 'Failed to delete category',
          error: (error as Error)?.message || 'Unknown error',
        });
      }
    }
  );

  // Get default categories
  fastify.get(
    '/defaults',
    {
      schema: {
        response: {
          200: {
            type: 'object',
            properties: {
              categories: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    _id: { type: 'string' },
                    spaceId: { type: 'string' },
                    userId: { type: 'string' },
                    name: { type: 'string' },
                    description: { type: 'string', nullable: true },
                    color: { type: 'string' },
                    icon: { type: 'string', nullable: true },
                    type: { type: 'string', enum: ['income', 'expense', 'transfer'] },
                    isDefault: { type: 'boolean' },
                    parentId: { type: 'string', nullable: true },
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

        const categories = await categoryService.getDefaultCategories(userId);

        return reply.status(200).send({ categories });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(400).send({
          message: 'Failed to fetch default categories',
          error: (error as Error)?.message || 'Unknown error',
        });
      }
    }
  );
}
