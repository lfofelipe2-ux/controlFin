import { FastifyRequest } from 'fastify';

// Translation interface
interface Translations {
    [key: string]: string;
}

// i18n service class
export class I18nService {
    private currentLanguage: string = 'en';
    private translations: Record<string, Translations> = {};

    constructor() {
        this.loadTranslations();
    }

    // Load translations from files
    private loadTranslations(): void {
        // English translations (default)
        this.translations['en'] = {
            // Error messages
            'errors.validation.required': 'Field {field} is required',
            'errors.validation.invalid': 'Field {field} has invalid value',
            'errors.validation.min': 'Field {field} must be at least {min}',
            'errors.validation.max': 'Field {field} must be at most {max}',
            'errors.validation.email': 'Field {field} must be a valid email',
            'errors.validation.uuid': 'Field {field} must be a valid UUID',

            'errors.database.not_found': 'Resource not found',
            'errors.database.duplicate': 'Resource already exists',
            'errors.database.connection': 'Database connection failed',
            'errors.database.query': 'Database query failed',

            'errors.auth.unauthorized': 'Authentication required',
            'errors.auth.invalid_token': 'Invalid authentication token',
            'errors.auth.token_expired': 'Authentication token has expired',
            'errors.auth.access_denied': 'Access denied to this resource',

            'errors.transaction.not_found': 'Transaction not found',
            'errors.transaction.invalid_data': 'Invalid transaction data',
            'errors.transaction.creation_failed': 'Failed to create transaction',
            'errors.transaction.update_failed': 'Failed to update transaction',
            'errors.transaction.delete_failed': 'Failed to delete transaction',

            'errors.category.not_found': 'Category not found',
            'errors.category.invalid_data': 'Invalid category data',
            'errors.category.creation_failed': 'Failed to create category',

            'errors.payment_method.not_found': 'Payment method not found',
            'errors.payment_method.invalid_data': 'Invalid payment method data',
            'errors.payment_method.creation_failed': 'Failed to create payment method',

            'errors.template.not_found': 'Template not found',
            'errors.template.invalid_data': 'Invalid template data',
            'errors.template.creation_failed': 'Failed to create template',

            'errors.bulk.operation_failed': 'Bulk operation failed',
            'errors.bulk.partial_success': 'Bulk operation completed with some failures',

            // Success messages
            'success.transaction.created': 'Transaction created successfully',
            'success.transaction.updated': 'Transaction updated successfully',
            'success.transaction.deleted': 'Transaction deleted successfully',
            'success.transaction.duplicated': 'Transaction duplicated successfully',

            'success.category.created': 'Category created successfully',
            'success.category.updated': 'Category updated successfully',
            'success.category.deleted': 'Category deleted successfully',

            'success.payment_method.created': 'Payment method created successfully',
            'success.payment_method.updated': 'Payment method updated successfully',
            'success.payment_method.deleted': 'Payment method deleted successfully',

            'success.template.created': 'Template created successfully',
            'success.template.updated': 'Template updated successfully',
            'success.template.deleted': 'Template deleted successfully',
            'success.template.duplicated': 'Template duplicated successfully',

            'success.bulk.operation_completed': 'Bulk operation completed successfully',

            // General messages
            'general.server_error': 'Internal server error',
            'general.validation_error': 'Validation error',
            'general.not_found': 'Resource not found',
            'general.unauthorized': 'Unauthorized access',
            'general.forbidden': 'Access forbidden',
        };

        // Portuguese translations
        this.translations['pt'] = {
            // Error messages
            'errors.validation.required': 'Campo {field} é obrigatório',
            'errors.validation.invalid': 'Campo {field} tem valor inválido',
            'errors.validation.min': 'Campo {field} deve ser pelo menos {min}',
            'errors.validation.max': 'Campo {field} deve ser no máximo {max}',
            'errors.validation.email': 'Campo {field} deve ser um email válido',
            'errors.validation.uuid': 'Campo {field} deve ser um UUID válido',

            'errors.database.not_found': 'Recurso não encontrado',
            'errors.database.duplicate': 'Recurso já existe',
            'errors.database.connection': 'Falha na conexão com o banco de dados',
            'errors.database.query': 'Falha na consulta ao banco de dados',

            'errors.auth.unauthorized': 'Autenticação necessária',
            'errors.auth.invalid_token': 'Token de autenticação inválido',
            'errors.auth.token_expired': 'Token de autenticação expirado',
            'errors.auth.access_denied': 'Acesso negado a este recurso',

            'errors.transaction.not_found': 'Transação não encontrada',
            'errors.transaction.invalid_data': 'Dados de transação inválidos',
            'errors.transaction.creation_failed': 'Falha ao criar transação',
            'errors.transaction.update_failed': 'Falha ao atualizar transação',
            'errors.transaction.delete_failed': 'Falha ao excluir transação',

            'errors.category.not_found': 'Categoria não encontrada',
            'errors.category.invalid_data': 'Dados de categoria inválidos',
            'errors.category.creation_failed': 'Falha ao criar categoria',

            'errors.payment_method.not_found': 'Método de pagamento não encontrado',
            'errors.payment_method.invalid_data': 'Dados de método de pagamento inválidos',
            'errors.payment_method.creation_failed': 'Falha ao criar método de pagamento',

            'errors.template.not_found': 'Modelo não encontrado',
            'errors.template.invalid_data': 'Dados de modelo inválidos',
            'errors.template.creation_failed': 'Falha ao criar modelo',

            'errors.bulk.operation_failed': 'Operação em lote falhou',
            'errors.bulk.partial_success': 'Operação em lote concluída com algumas falhas',

            // Success messages
            'success.transaction.created': 'Transação criada com sucesso',
            'success.transaction.updated': 'Transação atualizada com sucesso',
            'success.transaction.deleted': 'Transação excluída com sucesso',
            'success.transaction.duplicated': 'Transação duplicada com sucesso',

            'success.category.created': 'Categoria criada com sucesso',
            'success.category.updated': 'Categoria atualizada com sucesso',
            'success.category.deleted': 'Categoria excluída com sucesso',

            'success.payment_method.created': 'Método de pagamento criado com sucesso',
            'success.payment_method.updated': 'Método de pagamento atualizado com sucesso',
            'success.payment_method.deleted': 'Método de pagamento excluído com sucesso',

            'success.template.created': 'Modelo criado com sucesso',
            'success.template.updated': 'Modelo atualizado com sucesso',
            'success.template.deleted': 'Modelo excluído com sucesso',
            'success.template.duplicated': 'Modelo duplicado com sucesso',

            'success.bulk.operation_completed': 'Operação em lote concluída com sucesso',

            // General messages
            'general.server_error': 'Erro interno do servidor',
            'general.validation_error': 'Erro de validação',
            'general.not_found': 'Recurso não encontrado',
            'general.unauthorized': 'Acesso não autorizado',
            'general.forbidden': 'Acesso proibido',
        };
    }

    // Get message with interpolation
    getMessage(key: string, params?: Record<string, unknown>): string {
        const translation = this.translations[this.currentLanguage]?.[key] ||
            this.translations['en']?.[key] ||
            key;
        return this.interpolate(translation, params);
    }

    // Get language from request
    getLanguage(request: FastifyRequest): string {
        const acceptLanguage = request.headers['accept-language'];
        // Note: user.language will be added when user preferences are implemented

        if (acceptLanguage) return this.parseAcceptLanguage(acceptLanguage);
        return 'en'; // Default fallback
    }

    // Set current language
    setLanguage(language: string): void {
        this.currentLanguage = language;
    }

    // Parse Accept-Language header
    private parseAcceptLanguage(acceptLanguage: string): string {
        const languages = acceptLanguage
            .split(',')
            .map(lang => {
                const [code, qValue] = lang.trim().split(';q=');
                return {
                    code: code?.split('-')[0] ?? 'en', // Get primary language code
                    quality: qValue ? parseFloat(qValue) : 1.0,
                };
            })
            .sort((a, b) => b.quality - a.quality);

        // Return first supported language or default to English
        for (const lang of languages) {
            if (lang.code && this.translations[lang.code]) {
                return lang.code;
            }
        }
        return 'en';
    }

    // Interpolate parameters in message
    private interpolate(message: string, params?: Record<string, unknown>): string {
        if (!params) return message;

        return message.replace(/\{(\w+)\}/g, (match, key) => {
            return String(params[key] || match);
        });
    }
}

// Create singleton instance
export const i18nService = new I18nService();
