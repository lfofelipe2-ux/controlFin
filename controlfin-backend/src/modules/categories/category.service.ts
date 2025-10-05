import { CategoryModel as Category, ICategory } from './category.model';

export interface CreateCategoryData {
  spaceId: string;
  userId: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  type: 'income' | 'expense' | 'transfer';
  isDefault?: boolean;
  parentId?: string;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
  type?: 'income' | 'expense' | 'transfer';
  isDefault?: boolean;
  parentId?: string;
}

export interface GetCategoriesParams {
  userId: string;
  spaceId?: string;
  type?: 'income' | 'expense' | 'transfer';
  isDefault?: boolean;
  parentId?: string;
  search?: string;
}

class CategoryService {
  async createCategory(data: CreateCategoryData): Promise<ICategory> {
    // Check if parent category exists if parentId is provided
    if (data.parentId) {
      const parentCategory = await Category.findById(data.parentId);
      if (!parentCategory) {
        throw new Error('Parent category not found');
      }
    }

    const category = new Category(data);
    return await category.save();
  }

  async getCategoryById(id: string, userId: string): Promise<ICategory | null> {
    return await Category.findOne({ _id: id, userId });
  }

  async updateCategory(
    id: string,
    updateData: UpdateCategoryData,
    userId: string
  ): Promise<ICategory | null> {
    // Check if parent category exists if parentId is provided
    if (updateData.parentId) {
      const parentCategory = await Category.findById(updateData.parentId);
      if (!parentCategory) {
        throw new Error('Parent category not found');
      }
    }

    return await Category.findOneAndUpdate(
      { _id: id, userId },
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );
  }

  async deleteCategory(id: string, userId: string): Promise<boolean> {
    // Check if category has child categories
    const childCategories = await Category.find({ parentId: id, userId });
    if (childCategories.length > 0) {
      throw new Error('Cannot delete category with child categories');
    }

    // Check if category is used in transactions
    const { TransactionModel } = await import('../transactions/transaction.model');
    const transactionCount = await TransactionModel.countDocuments({ categoryId: id, userId });
    if (transactionCount > 0) {
      throw new Error('Cannot delete category that is used in transactions');
    }

    const result = await Category.deleteOne({ _id: id, userId });
    return result.deletedCount > 0;
  }

  async getCategories(params: GetCategoriesParams): Promise<ICategory[]> {
    const { userId, spaceId, type, isDefault, parentId, search } = params;

    // Build filter query
    const filter: any = { userId };

    if (spaceId) filter.spaceId = spaceId;
    if (type) filter.type = type;
    if (isDefault !== undefined) filter.isDefault = isDefault;
    if (parentId !== undefined) filter.parentId = parentId;

    // Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    return await Category.find(filter).sort({ name: 1 }).populate('parentId', 'name color icon');
  }

  async getDefaultCategories(userId: string): Promise<ICategory[]> {
    return await Category.find({ userId, isDefault: true }).sort({ name: 1 });
  }

  async getCategoriesByType(
    userId: string,
    type: 'income' | 'expense' | 'transfer',
    spaceId?: string
  ): Promise<ICategory[]> {
    const filter: any = { userId, type };
    if (spaceId) filter.spaceId = spaceId;

    return await Category.find(filter).sort({ name: 1 }).populate('parentId', 'name color icon');
  }

  async getParentCategories(userId: string, spaceId?: string): Promise<ICategory[]> {
    const filter: any = { userId, parentId: { $exists: false } };
    if (spaceId) filter.spaceId = spaceId;

    return await Category.find(filter).sort({ name: 1 });
  }

  async getChildCategories(
    userId: string,
    parentId: string,
    spaceId?: string
  ): Promise<ICategory[]> {
    const filter: any = { userId, parentId };
    if (spaceId) filter.spaceId = spaceId;

    return await Category.find(filter).sort({ name: 1 });
  }

  async createDefaultCategories(userId: string, spaceId: string): Promise<ICategory[]> {
    const defaultCategories = [
      // Income categories
      {
        spaceId,
        userId,
        name: 'Salary',
        description: 'Regular salary income',
        color: '#10B981',
        icon: 'money-bill-wave',
        type: 'income' as const,
        isDefault: true,
      },
      {
        spaceId,
        userId,
        name: 'Freelance',
        description: 'Freelance work income',
        color: '#3B82F6',
        icon: 'laptop',
        type: 'income' as const,
        isDefault: true,
      },
      {
        spaceId,
        userId,
        name: 'Investment',
        description: 'Investment returns',
        color: '#8B5CF6',
        icon: 'chart-line',
        type: 'income' as const,
        isDefault: true,
      },
      {
        spaceId,
        userId,
        name: 'Other Income',
        description: 'Other sources of income',
        color: '#06B6D4',
        icon: 'plus-circle',
        type: 'income' as const,
        isDefault: true,
      },

      // Expense categories
      {
        spaceId,
        userId,
        name: 'Food & Dining',
        description: 'Restaurants, groceries, and food expenses',
        color: '#F59E0B',
        icon: 'utensils',
        type: 'expense' as const,
        isDefault: true,
      },
      {
        spaceId,
        userId,
        name: 'Transportation',
        description: 'Gas, public transport, car maintenance',
        color: '#EF4444',
        icon: 'car',
        type: 'expense' as const,
        isDefault: true,
      },
      {
        spaceId,
        userId,
        name: 'Housing',
        description: 'Rent, mortgage, utilities',
        color: '#84CC16',
        icon: 'home',
        type: 'expense' as const,
        isDefault: true,
      },
      {
        spaceId,
        userId,
        name: 'Healthcare',
        description: 'Medical expenses, insurance',
        color: '#EC4899',
        icon: 'heart',
        type: 'expense' as const,
        isDefault: true,
      },
      {
        spaceId,
        userId,
        name: 'Entertainment',
        description: 'Movies, games, hobbies',
        color: '#8B5CF6',
        icon: 'gamepad',
        type: 'expense' as const,
        isDefault: true,
      },
      {
        spaceId,
        userId,
        name: 'Shopping',
        description: 'Clothing, electronics, general shopping',
        color: '#F97316',
        icon: 'shopping-bag',
        type: 'expense' as const,
        isDefault: true,
      },
      {
        spaceId,
        userId,
        name: 'Education',
        description: 'Courses, books, training',
        color: '#06B6D4',
        icon: 'graduation-cap',
        type: 'expense' as const,
        isDefault: true,
      },
      {
        spaceId,
        userId,
        name: 'Other Expenses',
        description: 'Miscellaneous expenses',
        color: '#6B7280',
        icon: 'ellipsis-h',
        type: 'expense' as const,
        isDefault: true,
      },

      // Transfer categories
      {
        spaceId,
        userId,
        name: 'Transfer',
        description: 'Money transfers between accounts',
        color: '#6366F1',
        icon: 'exchange-alt',
        type: 'transfer' as const,
        isDefault: true,
      },
    ];

    // Check if default categories already exist
    const existingCategories = await Category.find({ userId, isDefault: true });
    if (existingCategories.length > 0) {
      return existingCategories;
    }

    // Create default categories
    const categories = await Category.insertMany(defaultCategories);
    return categories;
  }

  async getCategoryStats(
    userId: string,
    spaceId?: string
  ): Promise<{
    totalCategories: number;
    byType: {
      income: number;
      expense: number;
      transfer: number;
    };
    withChildren: number;
    defaultCategories: number;
  }> {
    const filter: any = { userId };
    if (spaceId) filter.spaceId = spaceId;

    const [totalCategories, byType, withChildren, defaultCategories] = await Promise.all([
      Category.countDocuments(filter),
      Category.aggregate([{ $match: filter }, { $group: { _id: '$type', count: { $sum: 1 } } }]),
      Category.countDocuments({ ...filter, parentId: { $exists: true } }),
      Category.countDocuments({ ...filter, isDefault: true }),
    ]);

    const typeStats = {
      income: 0,
      expense: 0,
      transfer: 0,
    };

    byType.forEach((item: any) => {
      typeStats[item._id as keyof typeof typeStats] = item.count;
    });

    return {
      totalCategories,
      byType: typeStats,
      withChildren,
      defaultCategories,
    };
  }
}

export const categoryService = new CategoryService();
