const fs = require('fs');
const path = require('path');

// Files to fix
const routeFiles = [
    'src/modules/transactions/transaction.routes.ts',
    'src/modules/transactions/analytics.routes.ts',
    'src/modules/transactions/bulk.routes.ts',
    'src/modules/transactions/template.routes.ts',
    'src/modules/categories/category.routes.ts',
    'src/modules/payment-methods/payment-method.routes.ts',
];

const serviceFiles = [
    'src/modules/transactions/bulk.service.ts',
    'src/modules/categories/category.service.ts',
    'src/modules/payment-methods/payment-method.service.ts',
    'src/modules/transactions/transaction.service.ts',
];

function fixRouteFile(filePath) {
    try {
        const fullPath = path.join(__dirname, '..', filePath);

        if (!fs.existsSync(fullPath)) {
            // Script completed
            return;
        }

        let content = fs.readFileSync(fullPath, 'utf8');

        // Remove unused imports
        content = content.replace(/import {[^}]*} from '\.\.\/\.\.\/utils\/route-helpers';\n/g, '');

        // Add only the imports we actually need
        const routeHelpersImport = `import { 
  getAuthenticatedUser, 
  getRequestBody, 
  createErrorResponse, 
  createSuccessResponse, 
  handleRouteError 
} from '../../utils/route-helpers';\n`;

        // Add type imports for transaction routes
        if (filePath.includes('transaction')) {
            const typeImport = `import { 
  CreateTransactionRequest, 
  UpdateTransactionRequest, 
  GetTransactionRequest, 
  GetTransactionsRequest,
  isAuthenticatedRequest,
  isCreateTransactionRequest,
  isUpdateTransactionRequest
} from '../../types/request.types';\n`;

            // Find the last import statement and add our imports
            const lastImportIndex = content.lastIndexOf('import ');
            const nextLineIndex = content.indexOf('\n', lastImportIndex);
            content = content.slice(0, nextLineIndex + 1) + typeImport + routeHelpersImport + content.slice(nextLineIndex + 1);
        } else {
            // Find the last import statement and add our imports
            const lastImportIndex = content.lastIndexOf('import ');
            const nextLineIndex = content.indexOf('\n', lastImportIndex);
            content = content.slice(0, nextLineIndex + 1) + routeHelpersImport + content.slice(nextLineIndex + 1);
        }

        // Fix spread operator issues
        content = content.replace(/\.\.\.\(([^)]+) as \(unknown\)\)/g, '...$1');
        content = content.replace(/\.\.\.\(([^)]+) as unknown\)/g, '...$1');
        content = content.replace(/\.\.\.\(([^)]+) as \(unknown\)\)/g, '...$1');

        // Fix specific type issues
        content = content.replace(/getRequestBody\(request\) as ([A-Za-z]+)\['body'\]/g, 'getRequestBody<$1["body"]>(request)');

        // Fix error handling patterns
        content = content.replace(/catch \(error\) \{[\s\S]*?console\.error\('Error:', error\);[\s\S]*?\}/g, 'catch (error) {\n        return handleRouteError(error, reply);\n      }');

        // Fix specific unknown type issues
        content = content.replace(/\(([^)]+) as unknown\)/g, '$1');
        content = content.replace(/as unknown\)/g, ')');

        // Write back to file
        fs.writeFileSync(fullPath, content, 'utf8');
        // Script completed

    } catch (error) {
        console.error(`Error fixing ${filePath}:`, error.message);
    }
}

function fixServiceFile(filePath) {
    try {
        const fullPath = path.join(__dirname, '..', filePath);

        if (!fs.existsSync(fullPath)) {
            // Script completed
            return;
        }

        let content = fs.readFileSync(fullPath, 'utf8');

        // Fix MongoDB query issues
        content = content.replace(/\.exec\(\)/g, '.exec()');
        content = content.replace(/\.lean\(\)/g, '.lean()');

        // Fix error handling
        content = content.replace(/catch \(error\) \{[\s\S]*?console\.error\('Error:', error\);[\s\S]*?\}/g, 'catch (error) {\n        console.error(\'Error:\', error);\n        throw error;\n      }');

        // Fix specific type issues
        content = content.replace(/\.name/g, '.name || \'Unknown\'');
        content = content.replace(/error\.message/g, 'error instanceof Error ? error.message : String(error)');

        // Fix unknown type issues
        content = content.replace(/\(([^)]+) as unknown\)/g, '$1');
        content = content.replace(/as unknown\)/g, ')');

        // Write back to file
        fs.writeFileSync(fullPath, content, 'utf8');
        // Script completed

    } catch (error) {
        console.error(`Error fixing ${filePath}:`, error.message);
    }
}

// Fix all files
// Script completed
routeFiles.forEach(fixRouteFile);
serviceFiles.forEach(fixServiceFile);
// Script completed
