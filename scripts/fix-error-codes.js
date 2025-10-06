#!/usr/bin/env node

/**
 * Script para corrigir problemas de ERROR_CODES no backend
 * Adiciona imports faltantes e corrige referências
 */

const fs = require('fs');
const path = require('path');

const backendDir = path.join(__dirname, '..', 'controlfin-backend', 'src');

function fixErrorCodesImports(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        // Verificar se o arquivo usa ERROR_CODES mas não importa
        const usesErrorCodes = /ERROR_CODES\./g.test(content);
        const hasErrorCodesImport = /import.*ERROR_CODES/g.test(content);

        if (usesErrorCodes && !hasErrorCodesImport) {
            // Encontrar onde inserir o import
            const lines = content.split('\n');
            let insertIndex = 0;

            // Encontrar a última linha de import
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].trim().startsWith('import ')) {
                    insertIndex = i + 1;
                } else if (lines[i].trim() === '' && insertIndex > 0) {
                    break;
                }
            }

            // Inserir o import do ERROR_CODES
            const errorCodesImport = "import { ERROR_CODES } from '../utils/errorCodes';";
            lines.splice(insertIndex, 0, errorCodesImport);
            content = lines.join('\n');
            modified = true;
        }

        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Fixed ERROR_CODES import in: ${path.relative(process.cwd(), filePath)}`);
            return true;
        }

        return false;
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
        return false;
    }
}

function createErrorCodesFile() {
    const errorCodesPath = path.join(backendDir, 'utils', 'errorCodes.ts');

    if (!fs.existsSync(errorCodesPath)) {
        const errorCodesContent = `export const ERROR_CODES = {
  // Authentication errors
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  UNAUTHORIZED: 'UNAUTHORIZED',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  
  // User errors
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
  INVALID_USER_DATA: 'INVALID_USER_DATA',
  
  // Transaction errors
  TRANSACTION_NOT_FOUND: 'TRANSACTION_NOT_FOUND',
  INVALID_TRANSACTION_DATA: 'INVALID_TRANSACTION_DATA',
  TRANSACTION_CREATION_FAILED: 'TRANSACTION_CREATION_FAILED',
  
  // Category errors
  CATEGORY_NOT_FOUND: 'CATEGORY_NOT_FOUND',
  INVALID_CATEGORY_DATA: 'INVALID_CATEGORY_DATA',
  
  // Payment method errors
  PAYMENT_METHOD_NOT_FOUND: 'PAYMENT_METHOD_NOT_FOUND',
  INVALID_PAYMENT_METHOD_DATA: 'INVALID_PAYMENT_METHOD_DATA',
  
  // General errors
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];
`;

        fs.writeFileSync(errorCodesPath, errorCodesContent, 'utf8');
        console.log(`✅ Created ERROR_CODES file: ${path.relative(process.cwd(), errorCodesPath)}`);
        return true;
    }

    return false;
}

function findTsFiles(dir) {
    const files = [];

    function traverse(currentDir) {
        const items = fs.readdirSync(currentDir);

        for (const item of items) {
            const fullPath = path.join(currentDir, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                traverse(fullPath);
            } else if (item.endsWith('.ts') && !item.endsWith('.d.ts')) {
                files.push(fullPath);
            }
        }
    }

    traverse(dir);
    return files;
}

function main() {
    console.log('🔧 Fixing ERROR_CODES imports in backend...\n');

    // Criar arquivo ERROR_CODES se não existir
    const createdErrorCodes = createErrorCodesFile();

    const tsFiles = findTsFiles(backendDir);
    let fixedCount = 0;

    for (const file of tsFiles) {
        if (fixErrorCodesImports(file)) {
            fixedCount++;
        }
    }

    console.log(`\n✅ Fixed ERROR_CODES imports in ${fixedCount} files`);

    if (createdErrorCodes || fixedCount > 0) {
        console.log('\n📝 Next steps:');
        console.log('1. Run: npm run build --prefix controlfin-backend');
        console.log('2. Check for remaining TypeScript errors');
        console.log('3. Fix property access on unknown types');
    }
}

if (require.main === module) {
    main();
}

module.exports = { fixErrorCodesImports, createErrorCodesFile, findTsFiles };
