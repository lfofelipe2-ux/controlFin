#!/usr/bin/env node

/**
 * Optimized script for detecting change types
 * Implements fast file analysis and smart caching
 * Target: < 1 second execution time
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Cache configuration
const CACHE_DIR = '.validation-cache';
const CACHE_FILE = path.join(CACHE_DIR, 'change-type.cache');
const CACHE_TTL = 300; // 5 minutes

// Pastas que são consideradas apenas documentação/configuração
const DOCS_ONLY_PATHS = [
    'docs/',
    'memory-bank/',
    '.cursor/',
    '.cursorrules',
    '.clinerules',
    'README.md',
    'CHANGELOG.md',
    'LICENSE',
    '.gitignore',
    '.gitattributes'
];

// Extensões de arquivo que são consideradas apenas documentação
const DOCS_ONLY_EXTENSIONS = [
    '.md',
    '.txt',
    '.yml',
    '.yaml',
    '.json',
    '.gitignore',
    '.gitattributes',
    '.cursorrules',
    '.clinerules'
];

/**
 * Create cache directory if it doesn't exist
 */
function ensureCacheDir() {
    if (!fs.existsSync(CACHE_DIR)) {
        fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
}

/**
 * Get file hash for change detection
 */
function getFileHash(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            return crypto.createHash('sha256').update(content).digest('hex');
        }
        return 'missing';
    } catch (error) {
        return 'error';
    }
}

/**
 * Get cache key based on git status
 */
function getCacheKey() {
    try {
        const stagedFiles = execSync('git diff --cached --name-only', { encoding: 'utf8' })
            .trim()
            .split('\n')
            .filter(file => file.length > 0);

        const unstagedFiles = execSync('git diff --name-only', { encoding: 'utf8' })
            .trim()
            .split('\n')
            .filter(file => file.length > 0);

        const allFiles = [...stagedFiles, ...unstagedFiles];
        const filesHash = crypto.createHash('sha256')
            .update(allFiles.sort().join('\n'))
            .digest('hex');

        return `change-type-${filesHash}`;
    } catch (error) {
        return `change-type-${Date.now()}`;
    }
}

/**
 * Load cache
 */
function loadCache() {
    try {
        if (!fs.existsSync(CACHE_FILE)) {
            return null;
        }

        const cacheData = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
        const now = Date.now();

        // Check if cache is still valid
        if (now - cacheData.timestamp > CACHE_TTL * 1000) {
            return null;
        }

        return cacheData;
    } catch (error) {
        return null;
    }
}

/**
 * Save cache
 */
function saveCache(data) {
    try {
        ensureCacheDir();
        const cacheData = {
            ...data,
            timestamp: Date.now()
        };
        fs.writeFileSync(CACHE_FILE, JSON.stringify(cacheData, null, 2));
    } catch (error) {
        // Ignore cache save errors
    }
}

/**
 * Fast check if a file is documentation only
 */
function isDocsOnlyFile(filePath) {
    // Quick extension check first
    const ext = path.extname(filePath);
    if (DOCS_ONLY_EXTENSIONS.includes(ext)) {
        return true;
    }

    // Check if in docs-only paths
    return DOCS_ONLY_PATHS.some(docsPath => filePath.startsWith(docsPath));
}

/**
 * Get modified files with caching
 */
function getModifiedFiles() {
    try {
        // Check cache first
        const cacheKey = getCacheKey();
        const cache = loadCache();

        if (cache && cache.key === cacheKey) {
            console.log('📦 Using cached file list');
            return cache.files;
        }

        // Get fresh file list
        const stagedFiles = execSync('git diff --cached --name-only', { encoding: 'utf8' })
            .trim()
            .split('\n')
            .filter(file => file.length > 0);

        const unstagedFiles = execSync('git diff --name-only', { encoding: 'utf8' })
            .trim()
            .split('\n')
            .filter(file => file.length > 0);

        const files = [...stagedFiles, ...unstagedFiles];

        // Cache the result
        saveCache({
            key: cacheKey,
            files: files
        });

        return files;
    } catch (error) {
        console.error('❌ Error getting modified files:', error.message);
        return [];
    }
}

/**
 * Fast check if all changes are documentation only
 */
function checkIfDocsOnly() {
    const modifiedFiles = getModifiedFiles();

    if (modifiedFiles.length === 0) {
        console.log('✅ No changes detected');
        return true;
    }

    console.log('📁 Modified files:');
    let allDocsOnly = true;

    modifiedFiles.forEach(file => {
        const isDocs = isDocsOnlyFile(file);
        const status = isDocs ? '📄' : '💻';
        console.log(`  ${status} ${file}`);

        if (!isDocs) {
            allDocsOnly = false;
        }
    });

    if (allDocsOnly) {
        console.log('\n✅ All changes are documentation/configuration only');
        console.log('🚀 Ultra-fast validation will be used');
        return true;
    } else {
        console.log('\n💻 Changes include source code');
        console.log('🔍 Optimized validation will be used');
        return false;
    }
}

/**
 * Run essential checks with caching
 */
function runEssentialChecks() {
    console.log('\n🔍 Running essential checks...');

    try {
        // 1. Check if there's something to commit
        const status = execSync('git status --porcelain', { encoding: 'utf8' });
        if (status.trim().length === 0) {
            console.log('⚠️  No changes to commit');
            return false;
        }

        // 2. Check branch
        const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
        if (branch === 'main' || branch === 'master') {
            console.log('❌ Cannot commit to main/master branch');
            return false;
        }

        // 3. Quick file size check (only for changed files)
        const modifiedFiles = getModifiedFiles();
        let hasLargeFiles = false;

        modifiedFiles.forEach(file => {
            if (fs.existsSync(file)) {
                const stats = fs.statSync(file);
                if (stats.size > 10 * 1024 * 1024) { // 10MB
                    console.log(`⚠️  Large file detected: ${file} (${Math.round(stats.size / 1024 / 1024)}MB)`);
                    hasLargeFiles = true;
                }
            }
        });

        if (hasLargeFiles) {
            console.log('⚠️  Large files detected, but continuing...');
        }

        console.log('✅ Essential checks completed');
        return true;

    } catch (error) {
        console.error('❌ Error in essential checks:', error.message);
        return false;
    }
}

/**
 * Main function with performance optimization
 */
function main() {
    const startTime = Date.now();

    console.log('⚡ Optimized change type detection...\n');

    const isDocsOnly = checkIfDocsOnly();

    if (isDocsOnly) {
        console.log('\n📄 Mode: Documentation only');
        const essentialChecksPassed = runEssentialChecks();

        if (essentialChecksPassed) {
            const duration = Date.now() - startTime;
            console.log(`\n✅ Ready for ultra-fast docs commit (${duration}ms)`);
            process.exit(0);
        } else {
            console.log('\n❌ Essential checks failed');
            process.exit(1);
        }
    } else {
        console.log('\n💻 Mode: Code changes detected');
        const duration = Date.now() - startTime;
        console.log(`\n✅ Optimized validation required (${duration}ms)`);
        process.exit(2); // Code for optimized validation
    }
}

// Performance monitoring
if (process.env.NODE_ENV === 'development') {
    const startTime = Date.now();
    process.on('exit', () => {
        const duration = Date.now() - startTime;
        console.log(`\n⏱️  Change detection completed in ${duration}ms`);
    });
}

// Execute if called directly
if (require.main === module) {
    main();
}

module.exports = {
    checkIfDocsOnly,
    runEssentialChecks,
    isDocsOnlyFile,
    getModifiedFiles
};
