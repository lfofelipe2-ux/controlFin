import { FastifyRequest } from 'fastify';

// Base authenticated user interface
export interface AuthenticatedUser {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    isEmailVerified: boolean;
    spaceId?: string; // Optional for now, will be added when spaces are implemented
}

// Base request interface with authentication
export interface AuthenticatedRequest extends FastifyRequest {
    user?: AuthenticatedUser;
}

// Request interfaces for different operations
export interface CreateTransactionRequest extends AuthenticatedRequest {
    body: {
        type: 'income' | 'expense' | 'transfer';
        amount: number;
        description: string;
        categoryId: string;
        paymentMethodId: string;
        date: Date;
        tags: string[];
        metadata?: {
            location?: string;
            notes?: string;
            attachments?: string[];
        };
    };
}

export interface UpdateTransactionRequest extends AuthenticatedRequest {
    body: {
        type?: 'income' | 'expense' | 'transfer';
        amount?: number;
        description?: string;
        categoryId?: string;
        paymentMethodId?: string;
        date?: Date;
        tags?: string[];
        metadata?: {
            location?: string;
            notes?: string;
            attachments?: string[];
        };
    };
    params: {
        id: string;
    };
}

export interface GetTransactionRequest extends AuthenticatedRequest {
    params: {
        id: string;
    };
}

export interface GetTransactionsRequest extends AuthenticatedRequest {
    query: {
        page?: string;
        limit?: string;
        type?: 'income' | 'expense' | 'transfer';
        categoryId?: string;
        paymentMethodId?: string;
        startDate?: string;
        endDate?: string;
        search?: string;
    };
}

// Category request interfaces
export interface CreateCategoryRequest extends AuthenticatedRequest {
    body: {
        name: string;
        type: 'income' | 'expense';
        color: string;
        icon: string;
        parentId?: string;
    };
}

export interface UpdateCategoryRequest extends AuthenticatedRequest {
    body: {
        name?: string;
        type?: 'income' | 'expense';
        color?: string;
        icon?: string;
        parentId?: string;
    };
    params: {
        id: string;
    };
}

// Payment method request interfaces
export interface CreatePaymentMethodRequest extends AuthenticatedRequest {
    body: {
        name: string;
        type: 'cash' | 'credit_card' | 'debit_card' | 'bank_transfer' | 'pix' | 'other';
        metadata?: {
            last4?: string;
            bank?: string;
            accountType?: string;
        };
    };
}

export interface UpdatePaymentMethodRequest extends AuthenticatedRequest {
    body: {
        name?: string;
        type?: 'cash' | 'credit_card' | 'debit_card' | 'bank_transfer' | 'pix' | 'other';
        metadata?: {
            last4?: string;
            bank?: string;
            accountType?: string;
        };
    };
    params: {
        id: string;
    };
}

// Analytics request interfaces
export interface GetAnalyticsRequest extends AuthenticatedRequest {
    query: {
        startDate: string;
        endDate: string;
        groupBy?: 'day' | 'week' | 'month';
    };
}

// Bulk operation request interfaces
export interface BulkCreateTransactionsRequest extends AuthenticatedRequest {
    body: {
        transactions: Array<{
            type: 'income' | 'expense' | 'transfer';
            amount: number;
            description: string;
            categoryId: string;
            paymentMethodId: string;
            date: Date;
            tags: string[];
        }>;
    };
}

export interface BulkUpdateTransactionsRequest extends AuthenticatedRequest {
    body: {
        transactionIds: string[];
        updates: {
            type?: 'income' | 'expense' | 'transfer';
            amount?: number;
            description?: string;
            categoryId?: string;
            paymentMethodId?: string;
            date?: Date;
            tags?: string[];
        };
    };
}

export interface BulkDeleteTransactionsRequest extends AuthenticatedRequest {
    body: {
        transactionIds: string[];
    };
}

export interface BulkCategorizeTransactionsRequest extends AuthenticatedRequest {
    body: {
        transactionIds: string[];
        categoryId: string;
    };
}

export interface BulkTagTransactionsRequest extends AuthenticatedRequest {
    body: {
        transactionIds: string[];
        tags: string[];
        operation: 'add' | 'remove' | 'replace';
    };
}

export interface BulkExportTransactionsRequest extends AuthenticatedRequest {
    body: {
        transactionIds: string[];
        format: 'csv' | 'json';
    };
}

// Template request interfaces
export interface CreateTemplateRequest extends AuthenticatedRequest {
    body: {
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
    };
}

export interface UpdateTemplateRequest extends AuthenticatedRequest {
    body: {
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
    };
    params: {
        id: string;
    };
}

export interface CreateTransactionFromTemplateRequest extends AuthenticatedRequest {
    body: {
        overrides?: {
            amount?: number;
            description?: string;
            date?: Date;
            tags?: string[];
        };
    };
    params: {
        id: string;
    };
}

// Type guards for request validation
export function isAuthenticatedRequest(request: FastifyRequest): request is AuthenticatedRequest {
    return 'user' in request && request.user !== undefined;
}

export function isCreateTransactionRequest(request: FastifyRequest): request is CreateTransactionRequest {
    return isAuthenticatedRequest(request) && 'body' in request;
}

export function isUpdateTransactionRequest(request: FastifyRequest): request is UpdateTransactionRequest {
    return isAuthenticatedRequest(request) && 'body' in request && 'params' in request;
}
