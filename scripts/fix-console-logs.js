#!/usr/bin/env node

/**
 * Script para corrigir console.log e limpar eslint-disable desnecessários
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Cores para output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
};

const log = (message, color = colors.reset) => {
    console.log(`${color}${message}${colors.reset}`);
};

const logStep = (step, message) => {
    log(`\n[${step}] ${message}`, colors.cyan);
};

const logSuccess = (message) => {
    log(`✅ ${message}`, colors.green);
};

const logWarning = (message) => {
    log(`⚠️  ${message}`, colors.yellow);
};

const logError = (message) => {
    log(`❌ ${message}`, colors.red);
};

// Função para corrigir console.log
const fixConsoleLogs = (content) => {
    let modified = content;

    // Substituir console.log por logger
    modified = modified.replace(/console\.log\(/g, 'logger.info(');
    modified = modified.replace(/console\.error\(/g, 'logger.error(');
    modified = modified.replace(/console\.warn\(/g, 'logger.warn(');
    modified = modified.replace(/console\.info\(/g, 'logger.info(');
    modified = modified.replace(/console\.debug\(/g, 'logger.debug(');

    // Adicionar import do logger se necessário
    if (modified.includes('logger.') && !modified.includes("import { logger }")) {
        const lines = modified.split('\n');
        const firstImportIndex = lines.findIndex(line => line.startsWith('import'));
        if (firstImportIndex !== -1) {
            lines.splice(firstImportIndex, 0, "import { logger } from '../utils/logger';");
            modified = lines.join('\n');
        }
    }

    return modified;
};

// Função para limpar eslint-disable desnecessários
const cleanEslintDisable = (content) => {
    let modified = content;
    const lines = modified.split('\n');
    const cleanedLines = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const nextLine = lines[i + 1];

        // Se é uma linha eslint-disable e a próxima linha não tem erro
        if (line.includes('eslint-disable') && nextLine) {
            // Verificar se a próxima linha realmente precisa do disable
            if (!nextLine.includes('console.') && !nextLine.includes("'") && !nextLine.includes('any')) {
                // Pular esta linha (não adicionar)
                continue;
            }
        }

        cleanedLines.push(line);
    }

    return cleanedLines.join('\n');
};

// Função para processar um arquivo
const processFile = (filePath) => {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        let modified = content;

        // Aplicar correções
        modified = fixConsoleLogs(modified);
        modified = cleanEslintDisable(modified);

        // Salvar arquivo se houve mudanças
        if (modified !== content) {
            fs.writeFileSync(filePath, modified, 'utf8');
            return true;
        }

        return false;
    } catch (error) {
        logError(`Erro ao processar ${filePath}: ${error.message}`);
        return false;
    }
};

// Função principal
const main = () => {
    logStep('1', 'Corrigindo console.log e limpando eslint-disable...');

    const backendDir = path.join(__dirname, '..', 'controlfin-backend', 'src');

    if (!fs.existsSync(backendDir)) {
        logError('Diretório do backend não encontrado');
        process.exit(1);
    }

    // Encontrar todos os arquivos TypeScript
    const findTsFiles = (dir) => {
        const files = [];
        const items = fs.readdirSync(dir);

        items.forEach(item => {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory() && !item.includes('node_modules') && !item.includes('dist')) {
                files.push(...findTsFiles(fullPath));
            } else if (item.endsWith('.ts')) {
                files.push(fullPath);
            }
        });

        return files;
    };

    const tsFiles = findTsFiles(backendDir);
    logStep('2', `Encontrados ${tsFiles.length} arquivos TypeScript`);

    let processedCount = 0;
    let modifiedCount = 0;

    tsFiles.forEach(file => {
        processedCount++;
        const wasModified = processFile(file);
        if (wasModified) {
            modifiedCount++;
            logSuccess(`Modificado: ${path.relative(backendDir, file)}`);
        }
    });

    logStep('3', `Processamento concluído`);
    logSuccess(`Arquivos processados: ${processedCount}`);
    logSuccess(`Arquivos modificados: ${modifiedCount}`);

    logStep('4', 'Executando ESLint para verificar correções...');

    try {
        execSync('cd controlfin-backend && npm run lint', {
            stdio: 'pipe',
            encoding: 'utf8'
        });
        logSuccess('ESLint passou sem erros!');
    } catch (error) {
        logWarning('Ainda há erros ESLint. Execute manualmente para ver detalhes.');
        logWarning('Comando: cd controlfin-backend && npm run lint');
    }

    logStep('5', 'Correção concluída!');
};

// Executar se chamado diretamente
if (require.main === module) {
    main();
}

module.exports = { main };
