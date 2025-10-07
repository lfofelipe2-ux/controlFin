import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

/**
 * Converte um schema Zod para JSON Schema compatível com Fastify
 * @param schema - Schema Zod para converter
 * @returns JSON Schema para uso no Fastify
 */
export function zodToFastifySchema<T extends z.ZodType>(schema: T) {
    return zodToJsonSchema(schema, {
        target: 'openApi3',
        $refStrategy: 'none',
    });
}

/**
 * Helper para criar schemas de resposta do Fastify
 * @param schema - Schema Zod para converter
 * @returns JSON Schema de resposta
 */
export function createResponseSchema<T extends z.ZodType>(schema: T) {
    return {
        type: 'object',
        properties: zodToFastifySchema(schema).properties,
        required: zodToFastifySchema(schema).required || [],
    };
}
