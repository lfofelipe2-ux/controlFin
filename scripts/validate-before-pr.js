#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    reset: '\x1b[0m',
    bold: '\x1b[1m',
};

const log = (message, color = colors.white) => {
    console.log(`${color}${message}${colors.reset}`);
};

const logSection = (title) => {
    log(`\n${'='.repeat(60)}`, colors.cyan);
    log(`  ${title}`, colors.bold);
    log(`${'='.repeat(60)}`, colors.cyan);
};

const logStep = (step, message) => {
    log(`\n[${step}] ${message}`, colors.blue);
};

const logSuccess = (message) => {
    log(`✅ ${message}`, colors.green);
};

const logError = (message) => {
    log(`❌ ${message}`, colors.red);
};

const logWarning = (message) => {
    log(`⚠️  ${message}`, colors.yellow);
};

// Validation functions
const validateBackend = () => {
    logStep('1', 'Validating Backend...');

    try {
        // Check if backend directory exists
        if (!fs.existsSync('controlfin-backend')) {
            throw new Error('Backend directory not found');
        }

        // Run backend lint
        log('Running backend ESLint...', colors.cyan);
        execSync('cd controlfin-backend && npm run lint', {
            stdio: 'pipe',
            encoding: 'utf8'
        });
        logSuccess('Backend ESLint passed');

        // Run backend tests
        log('Running backend tests...', colors.cyan);
        execSync('cd controlfin-backend && npm test', { 
            stdio: 'pipe',
            encoding: 'utf8'
        });
        logSuccess('Backend tests passed');

        // Run backend build
        log('Running backend build...', colors.cyan);
        execSync('cd controlfin-backend && npm run build', {
            stdio: 'pipe',
            encoding: 'utf8'
        });
        logSuccess('Backend build passed');

        return true;
    } catch (error) {
        logError(`Backend validation failed: ${error.message}`);
        if (error.stdout) {
            log('STDOUT:', colors.yellow);
            console.log(error.stdout);
        }
        if (error.stderr) {
            log('STDERR:', colors.red);
            console.log(error.stderr);
        }
        return false;
    }
};

const validateFrontend = () => {
    logStep('2', 'Validating Frontend...');

    try {
        // Check if frontend directory exists
        if (!fs.existsSync('controlfin-frontend')) {
            throw new Error('Frontend directory not found');
        }

        // Run frontend lint
        log('Running frontend ESLint...', colors.cyan);
        execSync('cd controlfin-frontend && npm run lint', {
            stdio: 'pipe',
            encoding: 'utf8'
        });
        logSuccess('Frontend ESLint passed');

        // Run frontend tests
        log('Running frontend tests...', colors.cyan);
        execSync('cd controlfin-frontend && npm test', {
            stdio: 'pipe',
            encoding: 'utf8'
        });
        logSuccess('Frontend tests passed');

        // Run frontend build
        log('Running frontend build...', colors.cyan);
        execSync('cd controlfin-frontend && npm run build', {
            stdio: 'pipe',
            encoding: 'utf8'
        });
        logSuccess('Frontend build passed');

        return true;
    } catch (error) {
        logError(`Frontend validation failed: ${error.message}`);
        if (error.stdout) {
            log('STDOUT:', colors.yellow);
            console.log(error.stdout);
        }
        if (error.stderr) {
            log('STDERR:', colors.red);
            console.log(error.stderr);
        }
        return false;
    }
};

const validateI18n = () => {
    logStep('3', 'Validating i18n Translation Files...');

    try {
        const translationFiles = [
            'controlfin-frontend/src/locales/en/common.json',
            'controlfin-frontend/src/locales/pt/common.json',
        ];

        const allDuplicates = [];

        for (const filePath of translationFiles) {
            if (!fs.existsSync(filePath)) {
                logWarning(`Translation file not found: ${filePath}`);
                continue;
            }

            const content = fs.readFileSync(filePath, 'utf8');
            const parsed = JSON.parse(content);
            const keys = [];
            const keyCounts = new Map();

            const extractKeys = (obj, prefix = '') => {
                for (const [key, value] of Object.entries(obj)) {
                    const fullKey = prefix ? `${prefix}.${key}` : key;
                    if (typeof value === 'object' && value !== null) {
                        extractKeys(value, fullKey);
                    } else {
                        keys.push(fullKey);
                        keyCounts.set(fullKey, (keyCounts.get(fullKey) || 0) + 1);
                    }
                }
            };

            extractKeys(parsed);

            // Check for duplicates within the same file
            const fileDuplicates = [];
            for (const [key, count] of keyCounts.entries()) {
                if (count > 1) {
                    fileDuplicates.push({ key, count, file: filePath });
                }
            }

            if (fileDuplicates.length > 0) {
                allDuplicates.push(...fileDuplicates);
            }
        }

        if (allDuplicates.length > 0) {
            logError(`Found ${allDuplicates.length} duplicate i18n keys within files:`);
            allDuplicates.forEach(({ key, count, file }) => {
                log(`  - "${key}" appears ${count} times in:`, colors.red);
                log(`    ${file}`, colors.yellow);
            });
            return false;
        }

        logSuccess('No duplicate i18n keys found within files');
        return true;
    } catch (error) {
        logError(`i18n validation failed: ${error.message}`);
        return false;
    }
};

const validateGitStatus = () => {
    logStep('4', 'Validating Git Status...');

    try {
        // Check if we're in a git repository
        execSync('git status', { stdio: 'pipe' });

        // Check if there are uncommitted changes
        const status = execSync('git status --porcelain', { encoding: 'utf8' });
        if (status.trim()) {
            logWarning('There are uncommitted changes:');
            console.log(status);
            log('Please commit or stash your changes before creating a PR', colors.yellow);
            return false;
        }

        // Check if we're on a feature branch
        const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
        if (branch === 'main' || branch === 'master') {
            logError('Cannot create PR from main/master branch');
            return false;
        }

        logSuccess(`Git status OK (on branch: ${branch})`);
        return true;
    } catch (error) {
        logError(`Git validation failed: ${error.message}`);
        return false;
    }
};

const validateDependencies = () => {
    logStep('5', 'Validating Dependencies...');

    try {
        // Check backend dependencies
        if (fs.existsSync('controlfin-backend/package.json')) {
            log('Checking backend dependencies...', colors.cyan);
            execSync('cd controlfin-backend && npm audit --audit-level=high', {
                stdio: 'pipe',
                encoding: 'utf8'
            });
            logSuccess('Backend dependencies OK');
        }

        // Check frontend dependencies
        if (fs.existsSync('controlfin-frontend/package.json')) {
            log('Checking frontend dependencies...', colors.cyan);
            execSync('cd controlfin-frontend && npm audit --audit-level=high', {
                stdio: 'pipe',
                encoding: 'utf8'
            });
            logSuccess('Frontend dependencies OK');
        }

        return true;
    } catch (error) {
        logWarning(`Dependency audit found issues: ${error.message}`);
        if (error.stdout) {
            console.log(error.stdout);
        }
        return true; // Don't fail on audit warnings
    }
};

// Main validation function
const runValidation = async () => {
    logSection('🚀 PRE-PR VALIDATION SCRIPT');
    log('This script validates the codebase before creating a Pull Request', colors.white);
    log('All validations must pass before proceeding with PR creation\n', colors.white);

    const validations = [
        { name: 'Backend', fn: validateBackend },
        { name: 'Frontend', fn: validateFrontend },
        { name: 'i18n', fn: validateI18n },
        { name: 'Git Status', fn: validateGitStatus },
        { name: 'Dependencies', fn: validateDependencies },
    ];

    const results = [];

    for (const validation of validations) {
        try {
            const result = validation.fn();
            results.push({ name: validation.name, passed: result });
        } catch (error) {
            logError(`${validation.name} validation crashed: ${error.message}`);
            results.push({ name: validation.name, passed: false });
        }
    }

    // Summary
    logSection('📊 VALIDATION SUMMARY');

    const passed = results.filter(r => r.passed).length;
    const total = results.length;

    results.forEach(({ name, passed }) => {
        if (passed) {
            logSuccess(`${name}: PASSED`);
        } else {
            logError(`${name}: FAILED`);
        }
    });

    log(`\n${passed}/${total} validations passed`, passed === total ? colors.green : colors.red);

    if (passed === total) {
        log('\n🎉 All validations passed! You can now create your PR.', colors.green);
        log('Run: git push origin <branch-name>', colors.cyan);
        process.exit(0);
    } else {
        log('\n💥 Some validations failed. Please fix the issues before creating a PR.', colors.red);
        log('Fix the errors above and run this script again.', colors.yellow);
        process.exit(1);
    }
};

// Run the validation
runValidation().catch(error => {
    logError(`Validation script crashed: ${error.message}`);
    process.exit(1);
});
