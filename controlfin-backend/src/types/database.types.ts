import { Document, ObjectId } from 'mongoose';

// Base document interface
export interface BaseDocument extends Document {
    _id: ObjectId;
    __v: number;
    createdAt: Date;
    updatedAt: Date;
}

// Transaction document interface
export interface TransactionDocument extends BaseDocument {
    spaceId: string;
    userId: string;
    type: 'income' | 'expense' | 'transfer';
    amount: number;
    description: string;
    categoryId: string;
    paymentMethodId: string;
    date: Date;
    tags: string[];
    isRecurring: boolean;
    recurringId?: string;
    metadata: {
        location?: string;
        notes?: string;
        attachments?: string[];
    };
}

// Category document interface
export interface CategoryDocument extends BaseDocument {
    spaceId: string;
    name: string;
    type: 'income' | 'expense';
    color: string;
    icon: string;
    parentId?: string;
    isActive: boolean;
}

// Payment method document interface
export interface PaymentMethodDocument extends BaseDocument {
    spaceId: string;
    userId: string;
    name: string;
    type: 'cash' | 'credit_card' | 'debit_card' | 'bank_transfer' | 'pix' | 'other';
    isActive: boolean;
    metadata: {
        last4?: string;
        bank?: string;
        accountType?: string;
    };
}

// Recurring transaction document interface
export interface RecurringTransactionDocument extends BaseDocument {
    spaceId: string;
    userId: string;
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
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    startDate: Date;
    endDate?: Date;
    isActive: boolean;
    lastExecuted?: Date;
    nextExecution?: Date;
}

// Template document interface
export interface TemplateDocument extends BaseDocument {
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
    usageCount: number;
}

// Query result types
export type TransactionQueryResult = TransactionDocument | null;
export type TransactionQueryResults = TransactionDocument[];
export type TransactionCreateResult = TransactionDocument;
export type TransactionUpdateResult = TransactionDocument | null;

export type CategoryQueryResult = CategoryDocument | null;
export type CategoryQueryResults = CategoryDocument[];

export type PaymentMethodQueryResult = PaymentMethodDocument | null;
export type PaymentMethodQueryResults = PaymentMethodDocument[];

export type TemplateQueryResult = TemplateDocument | null;
export type TemplateQueryResults = TemplateDocument[];

// Query filter types
export interface TransactionQueryFilter {
    spaceId?: string;
    userId?: string;
    type?: 'income' | 'expense' | 'transfer';
    categoryId?: string;
    paymentMethodId?: string;
    dateRange?: {
        start: Date;
        end: Date;
    };
    tags?: string[];
    isRecurring?: boolean;
    recurringId?: string;
}

export interface CategoryQueryFilter {
    spaceId?: string;
    type?: 'income' | 'expense';
    parentId?: string;
    isActive?: boolean;
}

export interface PaymentMethodQueryFilter {
    spaceId?: string;
    userId?: string;
    type?: 'cash' | 'credit_card' | 'debit_card' | 'bank_transfer' | 'pix' | 'other';
    isActive?: boolean;
}

export interface TemplateQueryFilter {
    spaceId?: string;
    userId?: string;
    name?: string;
    templateType?: 'income' | 'expense' | 'transfer';
}

// Aggregation pipeline types
export interface AnalyticsPipeline {
    $match: TransactionQueryFilter;
    $group: {
        _id: string;
        totalAmount: { $sum: number };
        count: { $sum: 1 };
    };
    $sort: { totalAmount: -1 };
}

export interface AnalyticsResult {
    categoryBreakdown: Array<{
        categoryId: string;
        categoryName: string;
        totalAmount: number;
        count: number;
        percentage: number;
    }>;
    paymentMethodBreakdown: Array<{
        paymentMethodId: string;
        paymentMethodName: string;
        totalAmount: number;
        count: number;
        percentage: number;
    }>;
    monthlyTrends: Array<{
        month: string;
        income: number;
        expenses: number;
        netAmount: number;
    }>;
    financialHealth: {
        score: number;
        recommendations: string[];
    };
}

// Type guards for document validation
export function isTransactionDocument(doc: unknown): doc is TransactionDocument {
    return (
        doc !== null &&
        typeof doc === 'object' &&
        '_id' in doc &&
        'type' in doc &&
        'amount' in doc &&
        'description' in doc
    );
}

export function isCategoryDocument(doc: unknown): doc is CategoryDocument {
    return (
        doc !== null &&
        typeof doc === 'object' &&
        '_id' in doc &&
        'name' in doc &&
        'type' in doc
    );
}

export function isPaymentMethodDocument(doc: unknown): doc is PaymentMethodDocument {
    return (
        doc !== null &&
        typeof doc === 'object' &&
        '_id' in doc &&
        'name' in doc &&
        'type' in doc
    );
}

export function isTemplateDocument(doc: unknown): doc is TemplateDocument {
    return (
        doc !== null &&
        typeof doc === 'object' &&
        '_id' in doc &&
        'name' in doc &&
        'template' in doc
    );
}
