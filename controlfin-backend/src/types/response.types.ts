// Standard API response types
export interface ApiResponse<T = unknown> {
    success: true;
    data: T;
    message?: string;
}

export interface ApiErrorResponse {
    success: false;
    error: {
        code: string;
        message: string;
        statusCode: number;
        details?: Record<string, unknown>;
    };
}

export type ApiResult<T = unknown> = ApiResponse<T> | ApiErrorResponse;

// Specific response types for different operations
export interface TransactionResponse {
    id: string;
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
    createdAt: Date;
    updatedAt: Date;
}

export interface TransactionListResponse {
    transactions: TransactionResponse[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface CategoryResponse {
    id: string;
    spaceId: string;
    name: string;
    type: 'income' | 'expense';
    color: string;
    icon: string;
    parentId?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface PaymentMethodResponse {
    id: string;
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
    createdAt: Date;
    updatedAt: Date;
}

export interface AnalyticsResponse {
    summary: {
        totalIncome: number;
        totalExpenses: number;
        netAmount: number;
        transactionCount: number;
    };
    categoryBreakdown: Array<{
        categoryId: string;
        categoryName: string;
        amount: number;
        percentage: number;
        transactionCount: number;
    }>;
    paymentMethodBreakdown: Array<{
        paymentMethodId: string;
        paymentMethodName: string;
        amount: number;
        percentage: number;
        transactionCount: number;
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

export interface BulkOperationResponse {
    success: number;
    failed: number;
    errors: Array<{
        index: number;
        error: string;
    }>;
    results?: unknown[];
}

export interface TemplateResponse {
    id: string;
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
    createdAt: Date;
    updatedAt: Date;
}

export interface TemplateListResponse {
    templates: TemplateResponse[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// Helper functions for creating responses
export function createSuccessResponse<T>(data: T, message?: string): ApiResponse<T> {
    return {
        success: true,
        data,
        ...(message !== undefined && { message }),
    };
}

export function createErrorResponse(
    code: string,
    message: string,
    statusCode: number,
    details?: Record<string, unknown>
): ApiErrorResponse {
    return {
        success: false,
        error: {
            code,
            message,
            statusCode,
            ...(details !== undefined && { details }),
        },
    };
}
