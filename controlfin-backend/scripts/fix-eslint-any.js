const fs = require('fs');
const path = require('path');

// Files to fix
const files = [
    'src/modules/auth/auth.oauth.service.ts',
    'src/modules/auth/auth.service.ts',
    'src/modules/categories/category.routes.ts',
    'src/modules/categories/category.service.ts',
    'src/modules/payment-methods/payment-method.routes.ts',
    'src/modules/payment-methods/payment-method.service.ts',
    'src/modules/transactions/analytics.routes.ts',
    'src/modules/transactions/bulk.routes.ts',
    'src/modules/transactions/template.routes.ts',
    'src/modules/transactions/transaction.routes.ts',
    'src/modules/transactions/transaction.service.ts',
    'src/plugins/auth.plugin.ts',
    'src/utils/monitoring.ts',
];

function fixFile(filePath) {
    try {
        const fullPath = path.join(__dirname, '..', filePath);

        if (!fs.existsSync(fullPath)) {
            console.log(`File not found: ${filePath}`);
            return;
        }

        let content = fs.readFileSync(fullPath, 'utf8');

        // Fix request.body as any -> proper typing
        content = content.replace(/request\.body as any/g, 'request.body as Record<string, unknown>');
        content = content.replace(/request\.query as any/g, 'request.query as Record<string, unknown>');
        content = content.replace(/request\.params as any/g, 'request.params as Record<string, unknown>');

        // Fix specific type assertions
        content = content.replace(/\(([^)]+) as any\)/g, '($1 as Record<string, unknown>)');

        // Fix property access with proper typing
        content = content.replace(/\(([^)]+) as any\)\.([a-zA-Z_][a-zA-Z0-9_]*)/g, '($1 as Record<string, unknown>).$2');

        // Fix specific patterns
        content = content.replace(/data\.([a-zA-Z_][a-zA-Z0-9_]*)/g, '(data as Record<string, unknown>).$1');
        content = content.replace(/query\.([a-zA-Z_][a-zA-Z0-9_]*)/g, '(query as Record<string, unknown>).$1');

        // Fix monitoring specific issues
        if (filePath.includes('monitoring.ts')) {
            content = content.replace(/\(checks as any\)/g, '(checks as Record<string, unknown>)');
            content = content.replace(/\(op: any\)/g, '(op: Record<string, unknown>)');
        }

        // Fix auth plugin specific issues
        if (filePath.includes('auth.plugin.ts')) {
            content = content.replace(/\(request\.user as any\)/g, '(request.user as Record<string, unknown>)');
        }

        // Write back to file
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Fixed: ${filePath}`);

    } catch (error) {
        console.error(`Error fixing ${filePath}:`, error.message);
    }
}

// Fix all files
console.log('Starting ESLint any type fixes...');
files.forEach(fixFile);
console.log('ESLint any type fixes completed!');
