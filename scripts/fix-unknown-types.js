#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing unknown types in backend...');

// Function to fix unknown types in a file
function fixUnknownTypes(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        // Fix common unknown type patterns
        const patterns = [
            // Fix request.user type assertions
            {
                pattern: /\(req\.user as unknown\)/g,
                replacement: '(req.user as any)'
            },
            // Fix request.body type assertions
            {
                pattern: /\(req\.body as unknown\)/g,
                replacement: '(req.body as any)'
            },
            // Fix request.query type assertions
            {
                pattern: /\(req\.query as unknown\)/g,
                replacement: '(req.query as any)'
            },
            // Fix request.params type assertions
            {
                pattern: /\(req\.params as unknown\)/g,
                replacement: '(req.params as any)'
            },
            // Fix aggregation pipeline types
            {
                pattern: /\(pipeline as unknown\[\]\)/g,
                replacement: '(pipeline as any[])'
            },
            // Fix MongoDB operation results
            {
                pattern: /\(result as unknown\)/g,
                replacement: '(result as any)'
            },
            // Fix logger import conflicts
            {
                pattern: /import logger from ['"]\.\.\/utils\/logger['"];[\s\S]*?const logger =/g,
                replacement: 'const logger ='
            }
        ];

        patterns.forEach(({ pattern, replacement }) => {
            if (pattern.test(content)) {
                content = content.replace(pattern, replacement);
                modified = true;
            }
        });

        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Fixed: ${filePath}`);
            return true;
        }
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
    }
    return false;
}

// Function to recursively find TypeScript files
function findTsFiles(dir) {
    const files = [];

    function traverse(currentDir) {
        const items = fs.readdirSync(currentDir);

        for (const item of items) {
            const fullPath = path.join(currentDir, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
                traverse(fullPath);
            } else if (item.endsWith('.ts') && !item.endsWith('.d.ts')) {
                files.push(fullPath);
            }
        }
    }

    traverse(dir);
    return files;
}

// Main execution
const backendDir = path.join(process.cwd(), 'controlfin-backend', 'src');
const tsFiles = findTsFiles(backendDir);

console.log(`Found ${tsFiles.length} TypeScript files to process...`);

let fixedCount = 0;
tsFiles.forEach(file => {
    if (fixUnknownTypes(file)) {
        fixedCount++;
    }
});

console.log(`\n🎉 Fixed ${fixedCount} files with unknown type issues`);
console.log('✅ Unknown types fix completed!');
