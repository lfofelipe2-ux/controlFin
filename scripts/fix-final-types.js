#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Final TypeScript fix for backend...');

// Function to fix remaining unknown type issues
function fixRemainingUnknownTypes(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        // Fix all remaining unknown type patterns
        const patterns = [
            // Fix property access on unknown types
            {
                pattern: /\(([^)]+) as unknown\)\.([a-zA-Z_][a-zA-Z0-9_]*)/g,
                replacement: '($1 as any).$2'
            },
            // Fix direct property access on unknown
            {
                pattern: /([a-zA-Z_][a-zA-Z0-9_]*)\s*as unknown/g,
                replacement: '$1 as any'
            },
            // Fix aggregation pipeline arrays
            {
                pattern: /unknown\[\]/g,
                replacement: 'any[]'
            },
            // Fix MongoDB operation methods
            {
                pattern: /\.insertM\(/g,
                replacement: '.insertMany('
            },
            {
                pattern: /\.updateM\(/g,
                replacement: '.updateMany('
            },
            {
                pattern: /\.deleteM\(/g,
                replacement: '.deleteMany('
            },
            // Fix PerformanceMonitor class name
            {
                pattern: /class any/g,
                replacement: 'class PerformanceMonitor'
            },
            // Fix any as value usage
            {
                pattern: /new any\(/g,
                replacement: 'new PerformanceMonitor('
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
    if (fixRemainingUnknownTypes(file)) {
        fixedCount++;
    }
});

console.log(`\n🎉 Fixed ${fixedCount} files with final TypeScript fixes`);
console.log('✅ Final TypeScript fix completed!');
