import { z } from 'zod';

// Base category schema
const BaseCategorySchema = z.object({
  spaceId: z.string().min(1, 'Space ID is required'),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  description: z.string().max(500, 'Description too long').optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color'),
  icon: z.string().max(50, 'Icon name too long').optional(),
  type: z.enum(['income', 'expense', 'transfer']),
  isDefault: z.boolean().optional().default(false),
  parentId: z.string().optional(),
});

// Create category schema
export const CreateCategorySchema = BaseCategorySchema;

// Update category schema (all fields optional except spaceId)
export const UpdateCategorySchema = BaseCategorySchema.partial().extend({
  spaceId: z.string().min(1, 'Space ID is required'),
});

// Query parameters schema for filtering
export const CategoryQuerySchema = z.object({
  spaceId: z.string().optional(),
  type: z.enum(['income', 'expense', 'transfer']).optional(),
  isDefault: z.boolean().optional(),
  parentId: z.string().optional(),
  search: z.string().optional(),
});

// Type exports
export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>;
export type CategoryQueryInput = z.infer<typeof CategoryQuerySchema>;
