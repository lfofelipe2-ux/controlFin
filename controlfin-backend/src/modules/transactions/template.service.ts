import { Document, Schema, model } from 'mongoose';
import { CategoryModel as Category } from '../categories/category.model';
import { PaymentMethodModel as PaymentMethod } from '../payment-methods/payment-method.model';
import { ITransaction, TransactionModel as Transaction } from './transaction.model';

export interface ITransactionTemplate extends Document {
  _id: string;
  spaceId: string;
  userId: string;
  name: string;
  description: string;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  categoryId: string;
  paymentMethodId: string;
  tags: string[];
  metadata: {
    location?: string;
    notes?: string;
    attachments?: string[];
  };
  isActive: boolean;
  usageCount: number;
  lastUsed?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionTemplateSchema = new Schema<ITransactionTemplate>(
  {
    spaceId: { type: String, required: true },
    userId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['income', 'expense', 'transfer'], required: true },
    amount: { type: Number, required: true },
    categoryId: { type: String, required: true },
    paymentMethodId: { type: String, required: true },
    tags: [{ type: String }],
    metadata: {
      location: { type: String },
      notes: { type: String },
      attachments: [{ type: String }],
    },
    isActive: { type: Boolean, default: true },
    usageCount: { type: Number, default: 0 },
    lastUsed: { type: Date },
  },
  {
    timestamps: true,
  }
);

export const TransactionTemplateModel = model<ITransactionTemplate>(
  'TransactionTemplate',
  TransactionTemplateSchema
);

export interface CreateTemplateData {
  spaceId: string;
  userId: string;
  name: string;
  description: string;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  categoryId: string;
  paymentMethodId: string;
  tags?: string[];
  metadata?: {
    location?: string;
    notes?: string;
    attachments?: string[];
  };
}

export interface UpdateTemplateData {
  name?: string;
  description?: string;
  type?: 'income' | 'expense' | 'transfer';
  amount?: number;
  categoryId?: string;
  paymentMethodId?: string;
  tags?: string[];
  metadata?: {
    location?: string;
    notes?: string;
    attachments?: string[];
  };
  isActive?: boolean;
}

export interface GetTemplatesParams {
  userId: string;
  spaceId?: string;
  type?: 'income' | 'expense' | 'transfer';
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'usageCount' | 'lastUsed' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedTemplateResult {
  data: ITransactionTemplate[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class TemplateService {
  async createTemplate(data: CreateTemplateData): Promise<ITransactionTemplate> {
    // Validate category exists
    const category = await Category.findById(data.categoryId);
    if (!category) {
      throw new Error('Category not found');
    }

    // Validate payment method exists
    const paymentMethod = await PaymentMethod.findById(data.paymentMethodId);
    if (!paymentMethod) {
      throw new Error('Payment method not found');
    }

    const template = new TransactionTemplateModel(data);
    return await template.save();
  }

  async getTemplateById(id: string, userId: string): Promise<ITransactionTemplate | null> {
    return await TransactionTemplateModel.findOne({ _id: id, userId })
      .populate('categoryId', 'name color icon')
      .populate('paymentMethodId', 'name type icon');
  }

  async updateTemplate(
    id: string,
    updateData: UpdateTemplateData,
    userId: string
  ): Promise<ITransactionTemplate | null> {
    // Validate category if provided
    if (updateData.categoryId) {
      const category = await Category.findById(updateData.categoryId);
      if (!category) {
        throw new Error('Category not found');
      }
    }

    // Validate payment method if provided
    if (updateData.paymentMethodId) {
      const paymentMethod = await PaymentMethod.findById(updateData.paymentMethodId);
      if (!paymentMethod) {
        throw new Error('Payment method not found');
      }
    }

    return await TransactionTemplateModel.findOneAndUpdate(
      { _id: id, userId },
      { ...updateData, updatedAt: new Date() },
      { new: true }
    )
      .populate('categoryId', 'name color icon')
      .populate('paymentMethodId', 'name type icon');
  }

  async deleteTemplate(id: string, userId: string): Promise<boolean> {
    const result = await TransactionTemplateModel.deleteOne({ _id: id, userId });
    return result.deletedCount > 0;
  }

  async getTemplates(params: GetTemplatesParams): Promise<PaginatedTemplateResult> {
    const {
      userId,
      spaceId,
      type,
      isActive,
      search,
      page = 1,
      limit = 20,
      sortBy = 'name',
      sortOrder = 'asc',
    } = params;

    // Build filter query
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = { userId };

    if (spaceId) filter.spaceId = spaceId;
    if (type) filter.type = type;
    if (isActive !== undefined) filter.isActive = isActive;

    // Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    // Build sort object
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const [templates, total] = await Promise.all([
      TransactionTemplateModel.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('categoryId', 'name color icon')
        .populate('paymentMethodId', 'name type icon'),
      TransactionTemplateModel.countDocuments(filter),
    ]);

    return {
      data: templates,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async createTransactionFromTemplate(
    templateId: string,
    userId: string,
    overrides?: Partial<{
      amount: number;
      description: string;
      date: Date;
      tags: string[];
      metadata: {
        location?: string;
        notes?: string;
        attachments?: string[];
      };
    }>
  ): Promise<ITransaction> {
    const template = await TransactionTemplateModel.findOne({ _id: templateId, userId });
    if (!template) {
      throw new Error('Template not found');
    }

    if (!template.isActive) {
      throw new Error('Template is not active');
    }

    // Create transaction from template
    const transactionData = {
      spaceId: template.spaceId,
      userId: template.userId,
      type: template.type,
      amount: overrides?.amount || template.amount,
      description: overrides?.description || template.description,
      categoryId: template.categoryId,
      paymentMethodId: template.paymentMethodId,
      date: overrides?.date || new Date(),
      tags: overrides?.tags || template.tags,
      isRecurring: false,
      metadata: {
        ...template.metadata,
        ...overrides?.metadata,
      },
    };

    const transaction = new Transaction(transactionData);
    const savedTransaction = await transaction.save();

    // Update template usage
    await TransactionTemplateModel.findByIdAndUpdate(templateId, {
      $inc: { usageCount: 1 },
      lastUsed: new Date(),
    });

    return savedTransaction;
  }

  async getPopularTemplates(
    userId: string,
    spaceId?: string,
    limit: number = 10
  ): Promise<ITransactionTemplate[]> {
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = { userId, isActive: true };
    if (spaceId) filter.spaceId = spaceId;

    return await TransactionTemplateModel.find(filter)
      .sort({ usageCount: -1, lastUsed: -1 })
      .limit(limit)
      .populate('categoryId', 'name color icon')
      .populate('paymentMethodId', 'name type icon');
  }

  async getTemplatesByCategory(
    userId: string,
    categoryId: string,
    spaceId?: string
  ): Promise<ITransactionTemplate[]> {
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = { userId, categoryId, isActive: true };
    if (spaceId) filter.spaceId = spaceId;

    return await TransactionTemplateModel.find(filter)
      .sort({ usageCount: -1 })
      .populate('categoryId', 'name color icon')
      .populate('paymentMethodId', 'name type icon');
  }

  async getTemplatesByType(
    userId: string,
    type: 'income' | 'expense' | 'transfer',
    spaceId?: string
  ): Promise<ITransactionTemplate[]> {
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = { userId, type, isActive: true };
    if (spaceId) filter.spaceId = spaceId;

    return await TransactionTemplateModel.find(filter)
      .sort({ usageCount: -1 })
      .populate('categoryId', 'name color icon')
      .populate('paymentMethodId', 'name type icon');
  }

  async duplicateTemplate(
    templateId: string,
    userId: string,
    newName?: string
  ): Promise<ITransactionTemplate> {
    const template = await TransactionTemplateModel.findOne({ _id: templateId, userId });
    if (!template) {
      throw new Error('Template not found');
    }

    const duplicatedTemplate = new TransactionTemplateModel({
      ...template.toObject(),
      _id: undefined,
      name: newName || `${template.name} (Copy)`,
      usageCount: 0,
      lastUsed: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return await duplicatedTemplate.save();
  }

  async getTemplateStats(
    userId: string,
    spaceId?: string
  ): Promise<{
    totalTemplates: number;
    activeTemplates: number;
    byType: {
      income: number;
      expense: number;
      transfer: number;
    };
    mostUsed: ITransactionTemplate | null;
    totalUsage: number;
  }> {
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = { userId };
    if (spaceId) filter.spaceId = spaceId;

    const [totalTemplates, activeTemplates, byType, mostUsed, totalUsage] = await Promise.all([
      TransactionTemplateModel.countDocuments(filter),
      TransactionTemplateModel.countDocuments({ ...filter, isActive: true }),
      TransactionTemplateModel.aggregate([
        { $match: filter },
        { $group: { _id: '$type', count: { $sum: 1 } } },
      ]),
      TransactionTemplateModel.findOne(filter).sort({ usageCount: -1 }),
      TransactionTemplateModel.aggregate([
        { $match: filter },
        { $group: { _id: null, total: { $sum: '$usageCount' } } },
      ]),
    ]);

    const typeStats = {
      income: 0,
      expense: 0,
      transfer: 0,
    };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
    byType.forEach((item: any) => {
      if (item._id && item.count) {
        typeStats[item._id as keyof typeof typeStats] = item.count;
      }
    });

    return {
      totalTemplates,
      activeTemplates,
      byType: typeStats,
      mostUsed,
      totalUsage: totalUsage[0]?.total || 0,
    };
  }
}

export const templateService = new TemplateService();
