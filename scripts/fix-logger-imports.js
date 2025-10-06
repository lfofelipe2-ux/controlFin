#!/usr/bin/env node

/**
 * Script para corrigir problemas de importação do logger no backend
 * Corrige imports incorretos e duplicados
 */

const fs = require('fs');
const path = require('path');

const backendDir = path.join(__dirname, '..', 'controlfin-backend', 'src');

function fixLoggerImports(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        // Corrigir imports incorretos do logger
        const loggerImportRegex = /import\s*{\s*logger\s*}\s*from\s*['"]\.\.\/utils\/logger['"];?/g;
        if (loggerImportRegex.test(content)) {
            content = content.replace(loggerImportRegex, "import logger from '../utils/logger';");
            modified = true;
        }

        // Corrigir imports duplicados do logger
        const lines = content.split('\n');
        const loggerImports = [];
        const otherLines = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.includes('import') && line.includes('logger')) {
                loggerImports.push(line);
            } else {
                otherLines.push(line);
            }
        }

        // Se há múltiplos imports do logger, manter apenas um
        if (loggerImports.length > 1) {
            const uniqueLoggerImport = "import logger from '../utils/logger';";
            const filteredLines = otherLines.filter(line =>
                !line.includes('import') || !line.includes('logger')
            );

            // Encontrar onde inserir o import correto
            let insertIndex = 0;
            for (let i = 0; i < filteredLines.length; i++) {
                if (filteredLines[i].includes('import')) {
                    insertIndex = i + 1;
                } else {
                    break;
                }
            }

            filteredLines.splice(insertIndex, 0, uniqueLoggerImport);
            content = filteredLines.join('\n');
            modified = true;
        }

        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Fixed logger imports in: ${path.relative(process.cwd(), filePath)}`);
            return true;
        }

        return false;
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
        return false;
    }
}

function findTsFiles(dir) {
    const files = [];

    function traverse(currentDir) {
        const items = fs.readdirSync(currentDir);

        for (const item of items) {
            const fullPath = path.join(currentDir, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                traverse(fullPath);
            } else if (item.endsWith('.ts') && !item.endsWith('.d.ts')) {
                files.push(fullPath);
            }
        }
    }

    traverse(dir);
    return files;
}

function main() {
    console.log('🔧 Fixing logger imports in backend...\n');

    const tsFiles = findTsFiles(backendDir);
    let fixedCount = 0;

    for (const file of tsFiles) {
        if (fixLoggerImports(file)) {
            fixedCount++;
        }
    }

    console.log(`\n✅ Fixed logger imports in ${fixedCount} files`);

    if (fixedCount > 0) {
        console.log('\n📝 Next steps:');
        console.log('1. Run: npm run build --prefix controlfin-backend');
        console.log('2. Check for remaining TypeScript errors');
        console.log('3. Fix ERROR_CODES imports if needed');
    }
}

if (require.main === module) {
    main();
}

module.exports = { fixLoggerImports, findTsFiles };
