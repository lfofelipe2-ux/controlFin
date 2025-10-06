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

function addImports(filePath) {
    try {
        const fullPath = path.join(__dirname, '..', filePath);

        if (!fs.existsSync(fullPath)) {
            console.log(`File not found: ${filePath}`);
            return;
        }

        let content = fs.readFileSync(fullPath, 'utf8');

        // Add missing imports
        const routeHelpersImport = `import { getAuthenticatedUser } from '../../utils/route-helpers';\n`;

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

        // Write back to file
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Added imports to: ${filePath}`);

    } catch (error) {
        console.error(`Error fixing ${filePath}:`, error.message);
    }
}

// Fix all files
console.log('Adding missing imports...');
routeFiles.forEach(addImports);
console.log('Missing imports added!');
