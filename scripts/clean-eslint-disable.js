#!/usr/bin/env node

/**
 * Script para limpar todos os eslint-disable desnecessários
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

// Função para limpar eslint-disable desnecessários
const cleanEslintDisable = (content) => {
    const lines = content.split('\n');
    const cleanedLines = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Pular linhas que são apenas eslint-disable
        if (line.trim().startsWith('// eslint-disable') ||
            line.trim().startsWith('/* eslint-disable') ||
            line.trim().startsWith('* eslint-disable')) {
            continue;
        }

        // Pular linhas que são apenas espaços e eslint-disable
        if (line.trim().match(/^\s*\/\/\s*eslint-disable/)) {
            continue;
        }

        cleanedLines.push(line);
    }

    return cleanedLines.join('\n');
};

// Função para processar um arquivo
const processFile = (filePath) => {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const modified = cleanEslintDisable(content);

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
    logStep('1', 'Limpando eslint-disable desnecessários...');

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

    logStep('5', 'Limpeza concluída!');
};

// Executar se chamado diretamente
if (require.main === module) {
    main();
}

module.exports = { main };
