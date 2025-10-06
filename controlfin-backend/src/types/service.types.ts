import {
    AnalyticsResult,
    CategoryDocument,
    CategoryQueryFilter,
    CategoryQueryResults,
    PaymentMethodDocument,
    PaymentMethodQueryFilter,
    PaymentMethodQueryResults,
    TemplateDocument,
    TemplateQueryFilter,
    TemplateQueryResults,
    TransactionDocument,
    TransactionQueryFilter,
    TransactionQueryResults,
} from './database.types';

// Base service interface
export interface BaseService<TDocument, TCreate, TUpdate> {
    create(data: TCreate): Promise<TDocument>;
    findById(id: string): Promise<TDocument | null>;
    findMany(filter: Partial<TDocument>): Promise<TDocument[]>;
    update(id: string, data: TUpdate): Promise<TDocument | null>;
    delete(id: string): Promise<boolean>;
}

// Transaction service types
export interface CreateTransactionData {
    spaceId: string;
    userId: string;
    type: 'income' | 'expense' | 'transfer';
    amount: number;
    description: string;
    categoryId: string;
    paymentMethodId: string;
    date: Date;
    tags: string[];
    isRecurring?: boolean;
    recurringId?: string;
    metadata?: {
        location?: string;
        notes?: string;
        attachments?: string[];
    };
}

export interface UpdateTransactionData {
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
}

export interface TransactionService extends BaseService<
    TransactionDocument,
    CreateTransactionData,
    UpdateTransactionData
> {
    findBySpaceId(spaceId: string, filter?: TransactionQueryFilter): Promise<TransactionQueryResults>;
    findByUserId(userId: string, filter?: TransactionQueryFilter): Promise<TransactionQueryResults>;
    getAnalytics(spaceId: string, dateRange: { start: Date; end: Date }): Promise<AnalyticsResult>;
    searchTransactions(spaceId: string, query: string): Promise<TransactionQueryResults>;
    getTransactionStats(spaceId: string, dateRange: { start: Date; end: Date }): Promise<{
        totalIncome: number;
        totalExpenses: number;
        netAmount: number;
        transactionCount: number;
    }>;
}

// Category service types
export interface CreateCategoryData {
    spaceId: string;
    name: string;
    type: 'income' | 'expense';
    color: string;
    icon: string;
    parentId?: string;
}

export interface UpdateCategoryData {
    name?: string;
    type?: 'income' | 'expense';
    color?: string;
    icon?: string;
    parentId?: string;
    isActive?: boolean;
}

export interface CategoryService extends BaseService<
    CategoryDocument,
    CreateCategoryData,
    UpdateCategoryData
> {
    findBySpaceId(spaceId: string, filter?: CategoryQueryFilter): Promise<CategoryQueryResults>;
    findByType(spaceId: string, type: 'income' | 'expense'): Promise<CategoryQueryResults>;
    getDefaultCategories(): Promise<CategoryQueryResults>;
}

// Payment method service types
export interface CreatePaymentMethodData {
    spaceId: string;
    userId: string;
    name: string;
    type: 'cash' | 'credit_card' | 'debit_card' | 'bank_transfer' | 'pix' | 'other';
    metadata?: {
        last4?: string;
        bank?: string;
        accountType?: string;
    };
}

export interface UpdatePaymentMethodData {
    name?: string;
    type?: 'cash' | 'credit_card' | 'debit_card' | 'bank_transfer' | 'pix' | 'other';
    isActive?: boolean;
    metadata?: {
        last4?: string;
        bank?: string;
        accountType?: string;
    };
}

export interface PaymentMethodService extends BaseService<
    PaymentMethodDocument,
    CreatePaymentMethodData,
    UpdatePaymentMethodData
> {
    findBySpaceId(spaceId: string, filter?: PaymentMethodQueryFilter): Promise<PaymentMethodQueryResults>;
    findByUserId(userId: string, filter?: PaymentMethodQueryFilter): Promise<PaymentMethodQueryResults>;
    getDefaultPaymentMethods(): Promise<PaymentMethodQueryResults>;
}

// Template service types
export interface CreateTemplateData {
    spaceId: string;
    userId: string;
    name: string;
    description?: string;
    template: {
        type: 'income' | 'expense' | 'transfer';
        amount: number;
        description: string;
        categoryId: string;
        paymentMethodId: string;
        tags: string[];
        metadata?: {
            location?: string;
            notes?: string;
        };
    };
}

export interface UpdateTemplateData {
    name?: string;
    description?: string;
    template?: {
        type?: 'income' | 'expense' | 'transfer';
        amount?: number;
        description?: string;
        categoryId?: string;
        paymentMethodId?: string;
        tags?: string[];
        metadata?: {
            location?: string;
            notes?: string;
        };
    };
}

export interface TemplateService extends BaseService<
    TemplateDocument,
    CreateTemplateData,
    UpdateTemplateData
> {
    findBySpaceId(spaceId: string, filter?: TemplateQueryFilter): Promise<TemplateQueryResults>;
    findByUserId(userId: string, filter?: TemplateQueryFilter): Promise<TemplateQueryResults>;
    getPopularTemplates(spaceId: string, limit?: number): Promise<TemplateQueryResults>;
    createTransactionFromTemplate(templateId: string, overrides?: {
        amount?: number;
        description?: string;
        date?: Date;
        tags?: string[];
    }): Promise<TransactionDocument>;
    duplicateTemplate(templateId: string, newName: string): Promise<TemplateDocument>;
    getTemplateStats(spaceId: string): Promise<{
        totalTemplates: number;
        mostUsed: TemplateDocument[];
        recentlyCreated: TemplateDocument[];
    }>;
}

// Bulk operation types
export interface BulkCreateTransactionsData {
    transactions: CreateTransactionData[];
}

export interface BulkUpdateTransactionsData {
    transactionIds: string[];
    updates: UpdateTransactionData;
}

export interface BulkDeleteTransactionsData {
    transactionIds: string[];
}

export interface BulkCategorizeTransactionsData {
    transactionIds: string[];
    categoryId: string;
}

export interface BulkTagTransactionsData {
    transactionIds: string[];
    tags: string[];
    operation: 'add' | 'remove' | 'replace';
}

export interface BulkExportTransactionsData {
    transactionIds: string[];
    format: 'csv' | 'json';
}

export interface BulkOperationResult {
    success: number;
    failed: number;
    errors: Array<{
        index: number;
        error: string;
    }>;
    results?: unknown[];
}

// Service factory types
export interface ServiceFactory {
    createTransactionService(): TransactionService;
    createCategoryService(): CategoryService;
    createPaymentMethodService(): PaymentMethodService;
    createTemplateService(): TemplateService;
}
