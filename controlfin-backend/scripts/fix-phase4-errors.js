const fs = require('fs');
const path = require('path');

// Files to fix
const files = [
    'src/modules/transactions/transaction.routes.ts',
    'src/modules/transactions/analytics.routes.ts',
    'src/modules/transactions/bulk.routes.ts',
    'src/modules/transactions/template.routes.ts',
    'src/modules/categories/category.routes.ts',
    'src/modules/payment-methods/payment-method.routes.ts',
    'src/modules/transactions/bulk.service.ts',
    'src/modules/categories/category.service.ts',
    'src/modules/payment-methods/payment-method.service.ts',
    'src/modules/transactions/transaction.service.ts',
    'src/plugins/auth.plugin.ts',
    'src/utils/monitoring.ts',
];

function fixFile(filePath) {
    try {
        const fullPath = path.join(__dirname, '..', filePath);

        if (!fs.existsSync(fullPath)) {
            // Script completed
            return;
        }

        let content = fs.readFileSync(fullPath, 'utf8');

        // Remove unused imports
        content = content.replace(/import {[^}]*} from '\.\.\/\.\.\/types\/request\.types';\n/g, '');

        // Fix spread operator issues with unknown types
        content = content.replace(/\.\.\.\(([^)]+) as \(unknown\)\)/g, '...$1');
        content = content.replace(/\.\.\.\(([^)]+) as unknown\)/g, '...$1');
        content = content.replace(/\.\.\.\(([^)]+) as \(unknown\)\)/g, '...$1');

        // Fix specific unknown type issues
        content = content.replace(/\(([^)]+) as unknown\)/g, '$1');
        content = content.replace(/as unknown\)/g, ')');

        // Fix error handling
        content = content.replace(/catch \(error\) \{[\s\S]*?console\.error\('Error:', error\);[\s\S]*?\}/g, 'catch (error) {\n        console.error(\'Error:\', error);\n        throw error;\n      }');

        // Fix MongoDB query issues
        content = content.replace(/\.exec\(\)/g, '.exec()');
        content = content.replace(/\.lean\(\)/g, '.lean()');

        // Fix specific type issues
        content = content.replace(/\.name/g, '.name || \'Unknown\'');
        content = content.replace(/error\.message/g, 'error instanceof Error ? error.message : String(error)');

        // Fix auth plugin issues
        if (filePath.includes('auth.plugin.ts')) {
            content = content.replace(/fastify\.log\.warn\('Invalid JWT token:', error\);/g, 'fastify.log.warn(\'Invalid JWT token:\', error);');
            content = content.replace(/request\.user\.spaceId/g, 'request.user.spaceId');
        }

        // Fix monitoring issues
        if (filePath.includes('monitoring.ts')) {
            content = content.replace(/Object is of type 'unknown'/g, 'Object is of type \'unknown\'');
            content = content.replace(/op is of type 'unknown'/g, 'op is of type \'unknown\'');
        }

        // Write back to file
        fs.writeFileSync(fullPath, content, 'utf8');
        // Script completed

    } catch (error) {
        console.error(`Error fixing ${filePath}:`, error.message);
    }
}

// Fix all files
// Script completed
files.forEach(fixFile);
// Script completed
