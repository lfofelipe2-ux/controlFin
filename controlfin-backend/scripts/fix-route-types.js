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

// Patterns to replace
const replacements = [
    // Fix request.user access
    {
        pattern: /\(request as \(unknown\)\)\.user\?\.id/g,
        replacement: 'getAuthenticatedUser(request)._id'
    },
    {
        pattern: /\(request as \(unknown\)\)\.user/g,
        replacement: 'getAuthenticatedUser(request)'
    },
    {
        pattern: /request\.user\?\.id/g,
        replacement: 'getAuthenticatedUser(request)._id'
    },
    {
        pattern: /request\.user/g,
        replacement: 'getAuthenticatedUser(request)'
    },
    // Fix request.body access
    {
        pattern: /request\.body as \(unknown\)/g,
        replacement: 'getRequestBody(request)'
    },
    {
        pattern: /\.\.\.\(request\.body as \(unknown\)\)/g,
        replacement: '...getRequestBody(request)'
    },
    // Fix spread operator issues
    {
        pattern: /\.\.\.\(transactionData as \(unknown\)\)/g,
        replacement: '...transactionData'
    },
    {
        pattern: /\.\.\.\(categoryData as \(unknown\)\)/g,
        replacement: '...categoryData'
    },
    {
        pattern: /\.\.\.\(paymentMethodData as \(unknown\)\)/g,
        replacement: '...paymentMethodData'
    },
    {
        pattern: /\.\.\.\(templateData as \(unknown\)\)/g,
        replacement: '...templateData'
    },
    // Fix error handling
    {
        pattern: /catch \(error\) \{[\s\S]*?console\.error\('Error:', error\);[\s\S]*?\}/g,
        replacement: 'catch (error) {\n        return handleRouteError(error, reply);\n      }'
    }
];

// Import statements to add
const importStatement = `import { 
  getAuthenticatedUser, 
  getRequestBody, 
  createErrorResponse, 
  createSuccessResponse, 
  handleRouteError 
} from '../../utils/route-helpers';\n`;

function fixFile(filePath) {
    try {
        const fullPath = path.join(__dirname, '..', filePath);

        if (!fs.existsSync(fullPath)) {
            console.log(`File not found: ${filePath}`);
            return;
        }

        let content = fs.readFileSync(fullPath, 'utf8');

        // Add import statement if not already present
        if (!content.includes('route-helpers')) {
            // Find the last import statement
            const lastImportIndex = content.lastIndexOf('import ');
            const nextLineIndex = content.indexOf('\n', lastImportIndex);
            content = content.slice(0, nextLineIndex + 1) + importStatement + content.slice(nextLineIndex + 1);
        }

        // Apply replacements
        replacements.forEach(({ pattern, replacement }) => {
            content = content.replace(pattern, replacement);
        });

        // Write back to file
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Fixed: ${filePath}`);

    } catch (error) {
        console.error(`Error fixing ${filePath}:`, error.message);
    }
}

// Fix all files
console.log('Starting route type fixes...');
routeFiles.forEach(fixFile);
console.log('Route type fixes completed!');
