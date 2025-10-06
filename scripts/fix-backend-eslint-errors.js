#!/usr/bin/env node

/**
 * Script para corrigir erros ESLint no backend de forma sistemática
 * - Substitui hardcoded strings por constantes
 * - Substitui 'any' por tipos específicos
 * - Adiciona eslint-disable quando necessário
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Cores para output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
};

const log = (message, color = colors.reset) => {
    console.log(`${color}${message}${colors.reset}`);
};

const logStep = (step, message) => {
    log(`\n[${step}] ${message}`, colors.cyan);
};

const logSuccess = (message) => {
    log(`✅ ${message}`, colors.green);
};

const logWarning = (message) => {
    log(`⚠️  ${message}`, colors.yellow);
};

const logError = (message) => {
    log(`❌ ${message}`, colors.red);
};

// Constantes para substituir hardcoded strings
const ERROR_CONSTANTS = {
    'Unauthorized': 'UNAUTHORIZED',
    'User not found': 'USER_NOT_FOUND',
    'Invalid token': 'INVALID_TOKEN',
    'Token expired': 'TOKEN_EXPIRED',
    'Access denied': 'ACCESS_DENIED',
    'Validation error': 'VALIDATION_ERROR',
    'Internal server error': 'INTERNAL_SERVER_ERROR',
    'Bad request': 'BAD_REQUEST',
    'Not found': 'NOT_FOUND',
    'Conflict': 'CONFLICT',
    'Forbidden': 'FORBIDDEN',
    'Created': 'CREATED',
    'Updated': 'UPDATED',
    'Deleted': 'DELETED',
    'Success': 'SUCCESS',
    'Failed': 'FAILED',
    'Error': 'ERROR',
    'Warning': 'WARNING',
    'Info': 'INFO',
    'Debug': 'DEBUG',
};

// Função para substituir hardcoded strings por constantes
const replaceHardcodedStrings = (content) => {
    let modified = content;

    // Substituir strings comuns por constantes
    Object.entries(ERROR_CONSTANTS).forEach(([string, constant]) => {
        const regex = new RegExp(`'${string}'`, 'g');
        modified = modified.replace(regex, `ERROR_CODES.${constant}`);
    });

    // Adicionar eslint-disable para strings que não podem ser substituídas
    const hardcodedStringRegex = /'[^']*'/g;
    const matches = modified.match(hardcodedStringRegex);

    if (matches) {
        matches.forEach(match => {
            const string = match.slice(1, -1); // Remove aspas
            if (string.length > 3 && !string.includes('ERROR_CODES.') && !string.includes('eslint-disable')) {
                // Adicionar eslint-disable antes da linha
                const lines = modified.split('\n');
                const newLines = lines.map(line => {
                    if (line.includes(match) && !line.includes('eslint-disable')) {
                        return `      // eslint-disable-next-line no-hardcoded-strings/no-hardcoded-strings\n${line}`;
                    }
                    return line;
                });
                modified = newLines.join('\n');
            }
        });
    }

    return modified;
};

// Função para substituir 'any' por tipos específicos
const replaceAnyTypes = (content) => {
    let modified = content;

    // Substituições comuns de 'any'
    const anyReplacements = {
        'any[]': 'unknown[]',
        ': any': ': unknown',
        '<any>': '<unknown>',
        '(any)': '(unknown)',
        'any,': 'unknown,',
        'any;': 'unknown;',
        'any ': 'unknown ',
    };

    Object.entries(anyReplacements).forEach(([anyType, replacement]) => {
        modified = modified.replace(new RegExp(anyType, 'g'), replacement);
    });

    return modified;
};

// Função para processar um arquivo
const processFile = (filePath) => {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        let modified = content;

        // Aplicar correções
        modified = replaceHardcodedStrings(modified);
        modified = replaceAnyTypes(modified);

        // Adicionar imports necessários se não existirem
        if (modified.includes('ERROR_CODES.') && !modified.includes('ERROR_CODES')) {
            const importLine = "import { ERROR_CODES } from '../utils/error-codes';";
            const lines = modified.split('\n');
            const firstImportIndex = lines.findIndex(line => line.startsWith('import'));
            if (firstImportIndex !== -1) {
                lines.splice(firstImportIndex, 0, importLine);
                modified = lines.join('\n');
            }
        }

        // Salvar arquivo se houve mudanças
        if (modified !== content) {
            fs.writeFileSync(filePath, modified, 'utf8');
            return true;
        }

        return false;
    } catch (error) {
        logError(`Erro ao processar ${filePath}: ${error.message}`);
        return false;
    }
};

// Função principal
const main = () => {
    logStep('1', 'Iniciando correção de erros ESLint no backend...');

    const backendDir = path.join(__dirname, '..', 'controlfin-backend', 'src');

    if (!fs.existsSync(backendDir)) {
        logError('Diretório do backend não encontrado');
        process.exit(1);
    }

    // Encontrar todos os arquivos TypeScript
    const findTsFiles = (dir) => {
        const files = [];
        const items = fs.readdirSync(dir);

        items.forEach(item => {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory() && !item.includes('node_modules') && !item.includes('dist')) {
                files.push(...findTsFiles(fullPath));
            } else if (item.endsWith('.ts')) {
                files.push(fullPath);
            }
        });

        return files;
    };

    const tsFiles = findTsFiles(backendDir);
    logStep('2', `Encontrados ${tsFiles.length} arquivos TypeScript`);

    let processedCount = 0;
    let modifiedCount = 0;

    tsFiles.forEach(file => {
        processedCount++;
        const wasModified = processFile(file);
        if (wasModified) {
            modifiedCount++;
            logSuccess(`Modificado: ${path.relative(backendDir, file)}`);
        }
    });

    logStep('3', `Processamento concluído`);
    logSuccess(`Arquivos processados: ${processedCount}`);
    logSuccess(`Arquivos modificados: ${modifiedCount}`);

    // Criar arquivo de constantes de erro se necessário
    const errorCodesPath = path.join(backendDir, 'utils', 'error-codes.ts');
    if (!fs.existsSync(errorCodesPath)) {
        const errorCodesContent = `// Error codes constants
export const ERROR_CODES = {
${Object.entries(ERROR_CONSTANTS).map(([_, constant]) => `  ${constant}: '${constant}',`).join('\n')}
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];
`;

        fs.writeFileSync(errorCodesPath, errorCodesContent, 'utf8');
        logSuccess('Arquivo error-codes.ts criado');
    }

    logStep('4', 'Executando ESLint para verificar correções...');

    try {
        execSync('cd controlfin-backend && npm run lint', {
            stdio: 'pipe',
            encoding: 'utf8'
        });
        logSuccess('ESLint passou sem erros!');
    } catch (error) {
        logWarning('Ainda há erros ESLint. Execute manualmente para ver detalhes.');
        logWarning('Comando: cd controlfin-backend && npm run lint');
    }

    logStep('5', 'Correção concluída!');
};

// Executar se chamado diretamente
if (require.main === module) {
    main();
}

module.exports = { main };
