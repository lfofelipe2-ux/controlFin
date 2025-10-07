import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

// Tipos para JSON Schema
interface JsonSchema {
    type?: string;
    properties?: Record<string, unknown>;
    required?: string[];
    [key: string]: unknown;
}

/**
 * Converte um schema Zod para JSON Schema compatível com Fastify
 * @param schema - Schema Zod para converter
 * @returns JSON Schema para uso no Fastify
 */
export function zodToFastifySchema(schema: z.ZodTypeAny): JsonSchema {
    return zodToJsonSchema(schema, {
        target: 'openApi3',
        $refStrategy: 'none',
    }) as JsonSchema;
}

/**
 * Helper para criar schemas de resposta do Fastify
 * @param schema - Schema Zod para converter
 * @returns JSON Schema de resposta
 */
export function createResponseSchema(schema: z.ZodTypeAny): JsonSchema {
    const jsonSchema = zodToFastifySchema(schema);
    return {
        type: 'object',
        properties: jsonSchema.properties || {},
        required: jsonSchema.required || [],
    };
}
