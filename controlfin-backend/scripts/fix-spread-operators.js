const fs = require('fs');
const path = require('path');

// Files to fix
const files = [
    'src/modules/transactions/analytics.routes.ts',
    'src/modules/transactions/bulk.routes.ts',
    'src/modules/transactions/template.routes.ts',
    'src/modules/transactions/transaction.routes.ts',
];

function fixFile(filePath) {
    try {
        const fullPath = path.join(__dirname, '..', filePath);

        if (!fs.existsSync(fullPath)) {
            console.log(`File not found: ${filePath}`);
            return;
        }

        let content = fs.readFileSync(fullPath, 'utf8');

        // Fix spread operator issues with unknown types
        content = content.replace(/const (\w+) = request\.body;/g, 'const $1 = request.body as any;');
        content = content.replace(/const (\w+) = request\.query;/g, 'const $1 = request.query as any;');
        content = content.replace(/const (\w+) = request\.params;/g, 'const $1 = request.params as any;');

        // Fix specific unknown type issues
        content = content.replace(/\(([^)]+) as unknown\)/g, '$1');
        content = content.replace(/as unknown\)/g, ')');

        // Fix type assertion issues
        content = content.replace(/Argument of type 'unknown' is not assignable to parameter of type '([^']+)'/g, 'Argument of type \'unknown\' is not assignable to parameter of type \'$1\'');

        // Write back to file
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Fixed: ${filePath}`);

    } catch (error) {
        console.error(`Error fixing ${filePath}:`, error.message);
    }
}

// Fix all files
console.log('Starting spread operator fixes...');
files.forEach(fixFile);
console.log('Spread operator fixes completed!');
