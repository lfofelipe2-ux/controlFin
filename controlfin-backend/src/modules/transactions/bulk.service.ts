import { CategoryModel as Category } from '../categories/category.model';
import { PaymentMethodModel as PaymentMethod } from '../payment-methods/payment-method.model';
import { ITransaction, TransactionModel as Transaction } from './transaction.model';

export interface BulkCreateData {
  spaceId: string;
  userId: string;
  transactions: Array<{
    type: 'income' | 'expense' | 'transfer';
    amount: number;
    description: string;
    categoryId: string;
    paymentMethodId: string;
    date: Date;
    tags?: string[];
    isRecurring?: boolean;
    recurringId?: string;
    metadata?: {
      location?: string;
      notes?: string;
      attachments?: string[];
    };
  }>;
}

export interface BulkUpdateData {
  transactionIds: string[];
  updates: {
    type?: 'income' | 'expense' | 'transfer';
    amount?: number;
    description?: string;
    categoryId?: string;
    paymentMethodId?: string;
    date?: Date;
    tags?: string[];
    isRecurring?: boolean;
    recurringId?: string;
    metadata?: {
      location?: string;
      notes?: string;
      attachments?: string[];
    };
  };
}

export interface BulkDeleteData {
  transactionIds: string[];
}

export interface BulkOperationResult {
  success: boolean;
  processed: number;
  failed: number;
  errors: Array<{
    transactionId?: string;
    error: string;
    index?: number;
  }>;
  created?: ITransaction[];
  updated?: ITransaction[];
}

export interface BulkValidationResult {
  valid: boolean;
  errors: Array<{
    index: number;
    field: string;
    message: string;
  }>;
}

class BulkService {
  async bulkCreate(data: BulkCreateData): Promise<BulkOperationResult> {
    const { spaceId, userId, transactions } = data;
    const result: BulkOperationResult = {
      success: true,
      processed: 0,
      failed: 0,
      errors: [],
      created: [],
    };

    // Validate all transactions first
    const validation = await this.validateBulkTransactions(transactions);
    if (!validation.valid) {
      return {
        success: false,
        processed: 0,
        failed: transactions.length,
        errors: validation.errors.map((err) => ({
          index: err.index,
          error: `${err.field}: ${err.message}`,
        })),
      };
    }

    // Process transactions in batches
    const batchSize = 100;
    const batches = this.chunkArray(transactions, batchSize);

    for (const batch of batches) {
      try {
        const batchData = batch.map((transaction) => ({
          ...transaction,
          spaceId,
          userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));

        const created = await Transaction.insertMany(batchData, { ordered: false });
        if (result.created) {
          result.created.push(...created);
        }
        result.processed += created.length;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        // Handle partial batch failures
        if (error.writeErrors) {
          for (const writeError of error.writeErrors) {
            result.errors.push({
              index: writeError.index,
              error: writeError.errmsg,
            });
            result.failed++;
          }
        } else {
          result.errors.push({
            error: error.message,
          });
          result.failed += batch.length;
        }
      }
    }

    result.success = result.failed === 0;
    return result;
  }

  async bulkUpdate(data: BulkUpdateData, userId: string): Promise<BulkOperationResult> {
    const { transactionIds, updates } = data;
    const result: BulkOperationResult = {
      success: true,
      processed: 0,
      failed: 0,
      errors: [],
      updated: [],
    };

    // Validate updates
    if (updates.categoryId) {
      const category = await Category.findById(updates.categoryId);
      if (!category) {
        return {
          success: false,
          processed: 0,
          failed: transactionIds.length,
          errors: [{ error: 'Category not found' }],
        };
      }
    }

    if (updates.paymentMethodId) {
      const paymentMethod = await PaymentMethod.findById(updates.paymentMethodId);
      if (!paymentMethod) {
        return {
          success: false,
          processed: 0,
          failed: transactionIds.length,
          errors: [{ error: 'Payment method not found' }],
        };
      }
    }

    try {
      const updateResult = await Transaction.updateMany(
        { _id: { $in: transactionIds }, userId },
        { ...updates, updatedAt: new Date() }
      );

      result.processed = updateResult.modifiedCount;
      result.failed = transactionIds.length - updateResult.modifiedCount;

      // Get updated transactions
      const updatedTransactions = await Transaction.find({
        _id: { $in: transactionIds },
        userId,
      });

      result.updated = updatedTransactions;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      result.success = false;
      result.failed = transactionIds.length;
      result.errors.push({ error: error.message });
    }

    return result;
  }

  async bulkDelete(data: BulkDeleteData, userId: string): Promise<BulkOperationResult> {
    const { transactionIds } = data;
    const result: BulkOperationResult = {
      success: true,
      processed: 0,
      failed: 0,
      errors: [],
    };

    try {
      const deleteResult = await Transaction.deleteMany({
        _id: { $in: transactionIds },
        userId,
      });

      result.processed = deleteResult.deletedCount;
      result.failed = transactionIds.length - deleteResult.deletedCount;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      result.success = false;
      result.failed = transactionIds.length;
      result.errors.push({ error: error.message });
    }

    return result;
  }

  async bulkDuplicate(transactionIds: string[], userId: string): Promise<BulkOperationResult> {
    const result: BulkOperationResult = {
      success: true,
      processed: 0,
      failed: 0,
      errors: [],
      created: [],
    };

    try {
      const transactions = await Transaction.find({
        _id: { $in: transactionIds },
        userId,
      });

      const duplicatedTransactions = transactions.map((transaction) => ({
        ...transaction.toObject(),
        _id: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      const created = await Transaction.insertMany(duplicatedTransactions);
      result.created = created;
      result.processed = created.length;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      result.success = false;
      result.failed = transactionIds.length;
      result.errors.push({ error: error.message });
    }

    return result;
  }

  async bulkCategorize(
    transactionIds: string[],
    categoryId: string,
    userId: string
  ): Promise<BulkOperationResult> {
    // Validate category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return {
        success: false,
        processed: 0,
        failed: transactionIds.length,
        errors: [{ error: 'Category not found' }],
      };
    }

    return this.bulkUpdate(
      {
        transactionIds,
        updates: { categoryId },
      },
      userId
    );
  }

  async bulkTag(
    transactionIds: string[],
    tags: string[],
    userId: string,
    operation: 'add' | 'remove' | 'replace' = 'add'
  ): Promise<BulkOperationResult> {
    const result: BulkOperationResult = {
      success: true,
      processed: 0,
      failed: 0,
      errors: [],
      updated: [],
    };

    try {
      const transactions = await Transaction.find({
        _id: { $in: transactionIds },
        userId,
      });

      const updatePromises = transactions.map(async (transaction) => {
        let newTags: string[];

        switch (operation) {
          case 'add':
            newTags = [...new Set([...transaction.tags, ...tags])];
            break;
          case 'remove':
            newTags = transaction.tags.filter((tag) => !tags.includes(tag));
            break;
          case 'replace':
            newTags = tags;
            break;
          default:
            newTags = transaction.tags;
        }

        return Transaction.findByIdAndUpdate(
          transaction._id,
          { tags: newTags, updatedAt: new Date() },
          { new: true }
        );
      });

      const updated = await Promise.all(updatePromises);
      result.updated = updated.filter(Boolean) as ITransaction[];
      result.processed = result.updated.length;
      result.failed = transactionIds.length - result.processed;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      result.success = false;
      result.failed = transactionIds.length;
      result.errors.push({ error: error.message });
    }

    return result;
  }

  async bulkExport(
    transactionIds: string[],
    userId: string,
    format: 'csv' | 'json' = 'csv'
  ): Promise<{ data: string; filename: string }> {
    const transactions = await Transaction.find({
      _id: { $in: transactionIds },
      userId,
    })
      .populate('categoryId', 'name')
      .populate('paymentMethodId', 'name')
      .sort({ date: -1 });

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `transactions-export-${timestamp}.${format}`;

    if (format === 'json') {
      return {
        data: JSON.stringify(transactions, null, 2),
        filename,
      };
    }

    // CSV format
    const headers = [
      'Date',
      'Type',
      'Amount',
      'Description',
      'Category',
      'Payment Method',
      'Tags',
      'Location',
      'Notes',
    ];

    const csvRows = transactions.map((transaction) => [
      transaction.date.toISOString().split('T')[0],
      transaction.type,
      transaction.amount.toString(),
      transaction.description,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (transaction.categoryId as any)?.name || '',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (transaction.paymentMethodId as any)?.name || '',
      transaction.tags.join(';'),
      transaction.metadata?.location || '',
      transaction.metadata?.notes || '',
    ]);

    const csvContent = [headers, ...csvRows]
      .map((row) => row.map((field) => `"${field}"`).join(','))
      .join('\n');

    return {
      data: csvContent,
      filename,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async validateBulkTransactions(transactions: any[]): Promise<BulkValidationResult> {
    const errors: Array<{ index: number; field: string; message: string }> = [];

    // Get all unique category and payment method IDs
    const categoryIds = [...new Set(transactions.map((t) => t.categoryId))];
    const paymentMethodIds = [...new Set(transactions.map((t) => t.paymentMethodId))];

    const [categories, paymentMethods] = await Promise.all([
      Category.find({ _id: { $in: categoryIds } }),
      PaymentMethod.find({ _id: { $in: paymentMethodIds } }),
    ]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const categoryMap = new Map(categories.map((c: any) => [c._id.toString(), c]));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const paymentMethodMap = new Map(paymentMethods.map((pm: any) => [pm._id.toString(), pm]));

    transactions.forEach((transaction, index) => {
      // Validate required fields
      if (!transaction.type || !['income', 'expense', 'transfer'].includes(transaction.type)) {
        errors.push({
          index,
          field: 'type',
          message: 'Invalid or missing transaction type',
        });
      }

      if (
        !transaction.amount ||
        typeof transaction.amount !== 'number' ||
        transaction.amount <= 0
      ) {
        errors.push({
          index,
          field: 'amount',
          message: 'Amount must be a positive number',
        });
      }

      if (!transaction.description || typeof transaction.description !== 'string') {
        errors.push({
          index,
          field: 'description',
          message: 'Description is required',
        });
      }

      if (!transaction.categoryId || !categoryMap.has(transaction.categoryId)) {
        errors.push({
          index,
          field: 'categoryId',
          message: 'Invalid or missing category',
        });
      }

      if (!transaction.paymentMethodId || !paymentMethodMap.has(transaction.paymentMethodId)) {
        errors.push({
          index,
          field: 'paymentMethodId',
          message: 'Invalid or missing payment method',
        });
      }

      if (!transaction.date || isNaN(new Date(transaction.date).getTime())) {
        errors.push({
          index,
          field: 'date',
          message: 'Invalid date format',
        });
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}

export const bulkService = new BulkService();
