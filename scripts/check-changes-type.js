#!/usr/bin/env node

/**
 * Script para verificar o tipo de mudanças commitadas
 * Determina se são apenas mudanças de documentação/configuração
 * ou se incluem mudanças de código que requerem validação completa
 */

const { execSync } = require('child_process');
const path = require('path');

// Pastas que são consideradas apenas documentação/configuração
const DOCS_ONLY_PATHS = [
    'docs/',
    'memory-bank/',
    '.cursor/',
    '.cursorrules',
    '.clinerules'
];

/**
 * Verifica se um arquivo é apenas documentação/configuração
 */
function isDocsOnlyFile(filePath) {
    // Verifica se está em uma pasta de documentação
    const isInDocsPath = DOCS_ONLY_PATHS.some(docsPath =>
        filePath.startsWith(docsPath)
    );

    return isInDocsPath;
}

/**
 * Obtém lista de arquivos modificados no commit
 */
function getModifiedFiles() {
    try {
        // Verifica se há mudanças staged
        const stagedFiles = execSync('git diff --cached --name-only', { encoding: 'utf8' })
            .trim()
            .split('\n')
            .filter(file => file.length > 0);

        // Verifica se há mudanças não staged
        const unstagedFiles = execSync('git diff --name-only', { encoding: 'utf8' })
            .trim()
            .split('\n')
            .filter(file => file.length > 0);

        return [...stagedFiles, ...unstagedFiles];
    } catch (error) {
        console.error('Erro ao obter arquivos modificados:', error.message);
        return [];
    }
}

/**
 * Verifica se todas as mudanças são apenas documentação
 */
function checkIfDocsOnly() {
    const modifiedFiles = getModifiedFiles();

    if (modifiedFiles.length === 0) {
        console.log('✅ Nenhuma mudança detectada');
        return true;
    }

    console.log('📁 Arquivos modificados:');
    modifiedFiles.forEach(file => {
        const isDocs = isDocsOnlyFile(file);
        const status = isDocs ? '📄' : '💻';
        console.log(`  ${status} ${file}`);
    });

    // Verifica se todos os arquivos são apenas documentação
    const allDocsOnly = modifiedFiles.every(file => isDocsOnlyFile(file));

    if (allDocsOnly) {
        console.log('\n✅ Todas as mudanças são apenas documentação/configuração');
        console.log('🚀 Validações completas serão puladas');
        return true;
    } else {
        console.log('\n💻 Mudanças incluem código fonte');
        console.log('🔍 Validações completas serão executadas');
        return false;
    }
}

/**
 * Executa verificações essenciais mesmo para docs-only
 */
function runEssentialChecks() {
    console.log('\n🔍 Executando verificações essenciais...');

    try {
        // 1. Verificar se há algo para commitar
        const status = execSync('git status --porcelain', { encoding: 'utf8' });
        if (status.trim().length === 0) {
            console.log('⚠️  Nenhuma mudança para commitar');
            return false;
        }

        // 2. Verificar regras de commit (se houver commit)
        if (process.argv.includes('--check-commit')) {
            console.log('📝 Verificando regras de commit...');
            // Aqui você pode adicionar verificações específicas de commit
        }

        // 3. Verificar se não há arquivos grandes
        console.log('📏 Verificando tamanho dos arquivos...');
        const largeFiles = execSync('find . -type f -size +10M -not -path "./node_modules/*" -not -path "./.git/*"', { encoding: 'utf8' });
        if (largeFiles.trim().length > 0) {
            console.log('⚠️  Arquivos grandes detectados:', largeFiles.trim());
        }

        console.log('✅ Verificações essenciais concluídas');
        return true;

    } catch (error) {
        console.error('❌ Erro nas verificações essenciais:', error.message);
        return false;
    }
}

/**
 * Função principal
 */
function main() {
    console.log('🔍 Verificando tipo de mudanças...\n');

    const isDocsOnly = checkIfDocsOnly();

    if (isDocsOnly) {
        console.log('\n📄 Modo: Documentação apenas');
        const essentialChecksPassed = runEssentialChecks();

        if (essentialChecksPassed) {
            console.log('\n✅ Pronto para commit de documentação');
            process.exit(0);
        } else {
            console.log('\n❌ Verificações essenciais falharam');
            process.exit(1);
        }
    } else {
        console.log('\n💻 Modo: Validação completa necessária');
        process.exit(2); // Código especial para indicar que validação completa é necessária
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    main();
}

module.exports = {
    checkIfDocsOnly,
    runEssentialChecks,
    isDocsOnlyFile
};
