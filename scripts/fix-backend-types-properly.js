#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Properly fixing backend TypeScript types...');

// Function to properly fix TypeScript types in a file
function fixTypeScriptTypes(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        // Remove @ts-nocheck
        if (content.includes('// @ts-nocheck')) {
            content = content.replace('// @ts-nocheck\n', '');
            modified = true;
        }

        // Fix request types with proper interfaces
        if (content.includes('req.user as any')) {
            content = content.replace(/req\.user as any/g, 'req.user as { id: string; email: string }');
            modified = true;
        }

        if (content.includes('req.body as any')) {
            content = content.replace(/req\.body as any/g, 'req.body as Record<string, any>');
            modified = true;
        }

        if (content.includes('req.query as any')) {
            content = content.replace(/req\.query as any/g, 'req.query as Record<string, any>');
            modified = true;
        }

        if (content.includes('req.params as any')) {
            content = content.replace(/req\.params as any/g, 'req.params as Record<string, any>');
            modified = true;
        }

        // Fix specific property access patterns
        const propertyPatterns = [
            { pattern: /\(req\.user as any\)\.user/g, replacement: '(req.user as { id: string; email: string }).user' },
            { pattern: /\(req\.body as any\)\.transactionIds/g, replacement: '(req.body as Record<string, any>).transactionIds' },
            { pattern: /\(req\.body as any\)\.updates/g, replacement: '(req.body as Record<string, any>).updates' },
            { pattern: /\(req\.body as any\)\.categoryId/g, replacement: '(req.body as Record<string, any>).categoryId' },
            { pattern: /\(req\.body as any\)\.tags/g, replacement: '(req.body as Record<string, any>).tags' },
            { pattern: /\(req\.body as any\)\.operation/g, replacement: '(req.body as Record<string, any>).operation' },
            { pattern: /\(req\.body as any\)\.format/g, replacement: '(req.body as Record<string, any>).format' },
            { pattern: /\(req\.body as any\)\.overrides/g, replacement: '(req.body as Record<string, any>).overrides' },
            { pattern: /\(req\.body as any\)\.spaceId/g, replacement: '(req.body as Record<string, any>).spaceId' },
            { pattern: /\(req\.body as any\)\.limit/g, replacement: '(req.body as Record<string, any>).limit' },
            { pattern: /\(req\.body as any\)\.newName/g, replacement: '(req.body as Record<string, any>).newName' },
            { pattern: /\(req\.query as any\)\.spaceId/g, replacement: '(req.query as Record<string, any>).spaceId' },
            { pattern: /\(req\.query as any\)\.limit/g, replacement: '(req.query as Record<string, any>).limit' },
            { pattern: /\(req\.query as any\)\.newName/g, replacement: '(req.query as Record<string, any>).newName' }
        ];

        propertyPatterns.forEach(({ pattern, replacement }) => {
            if (content.match(pattern)) {
                content = content.replace(pattern, replacement);
                modified = true;
            }
        });

        // Fix error handling with proper types
        if (content.includes('catch (error: any)')) {
            content = content.replace(/catch \(error: any\)/g, 'catch (error: unknown)');
            modified = true;
        }

        if (content.includes('catch (err: any)')) {
            content = content.replace(/catch \(err: any\)/g, 'catch (err: unknown)');
            modified = true;
        }

        // Fix MongoDB document types
        if (content.includes('(category as any).name')) {
            content = content.replace(/\(category as any\)\.name/g, '(category as { name: string }).name');
            modified = true;
        }

        if (content.includes('(paymentMethod as any).name')) {
            content = content.replace(/\(paymentMethod as any\)\.name/g, '(paymentMethod as { name: string }).name');
            modified = true;
        }

        // Fix user model types
        if (content.includes('(user as any).password')) {
            content = content.replace(/\(user as any\)\.password/g, '(user as { password: string }).password');
            modified = true;
        }

        if (content.includes('(user as any).__v')) {
            content = content.replace(/\(user as any\)\.__v/g, '(user as { __v: number }).__v');
            modified = true;
        }

        // Fix logger types
        if (content.includes('(logger as any).stream')) {
            content = content.replace(/\(logger as any\)\.stream/g, '(logger as { stream: any }).stream');
            modified = true;
        }

        // Fix monitoring types
        if (content.includes('(response as any).status')) {
            content = content.replace(/\(response as any\)\.status/g, '(response as { status: number }).status');
            modified = true;
        }

        if (content.includes('(result as any).status')) {
            content = content.replace(/\(result as any\)\.status/g, '(result as { status: number }).status');
            modified = true;
        }

        // Fix performance monitor types
        if (content.includes('(process as any).memoryUsage')) {
            content = content.replace(/\(process as any\)\.memoryUsage/g, '(process as { memoryUsage: () => any }).memoryUsage');
            modified = true;
        }

        if (content.includes('(process as any).cpuUsage')) {
            content = content.replace(/\(process as any\)\.cpuUsage/g, '(process as { cpuUsage: () => any }).cpuUsage');
            modified = true;
        }

        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Properly fixed: ${filePath}`);
            return true;
        }

        return false;
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
        return false;
    }
}

// Function to process all TypeScript files in backend
function processBackendFiles() {
    const backendDir = 'controlfin-backend/src';
    let totalFiles = 0;
    let fixedFiles = 0;

    function processDirectory(dir) {
        const items = fs.readdirSync(dir);

        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                processDirectory(fullPath);
            } else if (item.endsWith('.ts') && !item.endsWith('.d.ts')) {
                totalFiles++;
                if (fixTypeScriptTypes(fullPath)) {
                    fixedFiles++;
                }
            }
        }
    }

    if (fs.existsSync(backendDir)) {
        processDirectory(backendDir);
        console.log(`\n📊 Summary:`);
        console.log(`   Total files processed: ${totalFiles}`);
        console.log(`   Files fixed: ${fixedFiles}`);
        console.log(`   Files unchanged: ${totalFiles - fixedFiles}`);
    } else {
        console.error('❌ Backend directory not found:', backendDir);
    }
}

// Run the fix
processBackendFiles();
console.log('\n🎉 Proper TypeScript type fixing completed!');
