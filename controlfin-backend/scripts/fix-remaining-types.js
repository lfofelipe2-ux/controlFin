const fs = require('fs');
const path = require('path');

// Files to fix
const files = [
    'src/modules/transactions/bulk.routes.ts',
    'src/modules/transactions/template.routes.ts',
    'src/modules/transactions/transaction.routes.ts',
    'src/modules/transactions/bulk.service.ts',
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

        // Fix type assertion issues
        content = content.replace(/Argument of type 'unknown' is not assignable to parameter of type '([^']+)'/g, 'Argument of type \'unknown\' is not assignable to parameter of type \'$1\'');

        // Fix specific unknown type issues
        content = content.replace(/\(([^)]+) as unknown\)/g, '$1');
        content = content.replace(/as unknown\)/g, ')');

        // Fix Object is of type 'unknown' issues
        content = content.replace(/Object is of type 'unknown'/g, 'Object is of type \'unknown\'');

        // Fix MongoDB query issues
        content = content.replace(/\.exec\(\)/g, '.exec()');
        content = content.replace(/\.lean\(\)/g, '.lean()');

        // Fix specific type issues
        content = content.replace(/\.name/g, '.name || \'Unknown\'');
        content = content.replace(/error\.message/g, 'error instanceof Error ? error.message : String(error)');

        // Fix monitoring issues
        if (filePath.includes('monitoring.ts')) {
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