#!/usr/bin/env node

/**
 * CI Change Detection Script
 * Determines which components need validation in CI based on changes
 * Target: Reduce CI execution time by 60-70%
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Set GitHub Actions output with fallback for local testing
 * @param {string} name - Output name
 * @param {string} value - Output value
 */
function setGitHubOutput(name, value) {
    try {
        // Check if running in GitHub Actions environment
        if (process.env.GITHUB_OUTPUT) {
            // Modern GitHub Actions syntax
            fs.appendFileSync(process.env.GITHUB_OUTPUT, `${name}=${value}\n`);
            console.log(`✅ Set output: ${name}=${value}`);
        } else {
            // Fallback for local testing
            console.log(`🔧 [LOCAL] Would set output: ${name}=${value}`);
            // Also write to a local file for testing
            const localOutputFile = '.github-output-test.txt';
            fs.appendFileSync(localOutputFile, `${name}=${value}\n`);
        }
    } catch (error) {
        console.error(`❌ Error setting output ${name}:`, error.message);
        // Don't fail the script for output errors
    }
}

// Configuration
const COMPONENTS = {
    frontend: {
        paths: ['controlfin-frontend/', 'docs/', 'memory-bank/'],
        files: ['.github/workflows/', '.github/actions/', 'package.json', 'package-lock.json']
    },
    backend: {
        paths: ['controlfin-backend/', 'docs/', 'memory-bank/'],
        files: ['.github/workflows/', '.github/actions/', 'package.json', 'package-lock.json']
    },
    docs: {
        paths: ['docs/', 'memory-bank/', 'README.md', 'CHANGELOG.md'],
        files: ['.github/workflows/', '.github/actions/']
    },
    config: {
        paths: ['.github/', 'scripts/', 'package.json', 'package-lock.json'],
        files: []
    }
};

// Colors for output
const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m'
};

/**
 * Get changed files from git
 */
function getChangedFiles() {
    try {
        // For PR events, compare with base branch
        const baseRef = process.env.GITHUB_BASE_REF || 'main';
        const headRef = process.env.GITHUB_HEAD_REF || process.env.GITHUB_REF_NAME || 'main';
        
        let changedFiles = [];
        
        if (process.env.GITHUB_EVENT_NAME === 'pull_request') {
            // PR event - compare with base branch
            changedFiles = execSync(`git diff --name-only origin/${baseRef}...HEAD`, { encoding: 'utf8' })
                .trim()
                .split('\n')
                .filter(file => file.length > 0);
        } else {
            // Push event - compare with previous commit
            changedFiles = execSync('git diff --name-only HEAD~1 HEAD', { encoding: 'utf8' })
                .trim()
                .split('\n')
                .filter(file => file.length > 0);
        }
        
        return changedFiles;
    } catch (error) {
        console.error('Error getting changed files:', error.message);
        return [];
    }
}

/**
 * Check if component needs validation based on changes
 */
function needsValidation(component, changedFiles) {
    const config = COMPONENTS[component];
    if (!config) return false;
    
    // Check if any changed files match component paths
    for (const file of changedFiles) {
        // Check paths
        for (const path of config.paths) {
            if (file.startsWith(path)) {
                return true;
            }
        }
        
        // Check specific files
        for (const specificFile of config.files) {
            if (file.includes(specificFile)) {
                return true;
            }
        }
    }
    
    return false;
}

/**
 * Determine change type
 */
function getChangeType(changedFiles) {
    const docsOnlyPaths = ['docs/', 'memory-bank/', 'README.md', 'CHANGELOG.md'];
    const configPaths = ['.github/', 'scripts/', 'package.json', 'package-lock.json'];
    
    let hasCodeChanges = false;
    let hasConfigChanges = false;
    let hasDocsChanges = false;
    
    for (const file of changedFiles) {
        // Check for code changes
        if (file.startsWith('controlfin-frontend/') || file.startsWith('controlfin-backend/')) {
            hasCodeChanges = true;
        }
        
        // Check for config changes
        if (configPaths.some(path => file.startsWith(path))) {
            hasConfigChanges = true;
        }
        
        // Check for docs changes
        if (docsOnlyPaths.some(path => file.startsWith(path))) {
            hasDocsChanges = true;
        }
    }
    
    if (hasCodeChanges) {
        return 'code';
    } else if (hasConfigChanges) {
        return 'config';
    } else if (hasDocsChanges) {
        return 'docs';
    } else {
        return 'none';
    }
}

/**
 * Generate CI job matrix
 */
function generateJobMatrix(changedFiles) {
    const matrix = {
        frontend: needsValidation('frontend', changedFiles),
        backend: needsValidation('backend', changedFiles),
        docs: needsValidation('docs', changedFiles),
        config: needsValidation('config', changedFiles),
        quality_gates: needsValidation('frontend', changedFiles) || needsValidation('backend', changedFiles),
        code_quality: needsValidation('frontend', changedFiles) || needsValidation('backend', changedFiles),
        build_matrix: needsValidation('frontend', changedFiles) || needsValidation('backend', changedFiles)
    };
    
    return matrix;
}

/**
 * Generate optimized Node.js matrix
 */
function generateNodeMatrix(changeType) {
    if (changeType === 'docs' || changeType === 'config') {
        // For docs/config changes, only test with primary Node version
        return ['22'];
    } else {
        // For code changes, test with multiple versions
        return ['20', '22'];
    }
}

/**
 * Generate caching strategy
 */
function generateCachingStrategy(changedFiles) {
    const needsFrontend = needsValidation('frontend', changedFiles);
    const needsBackend = needsValidation('backend', changedFiles);
    
    return {
        frontend_cache: needsFrontend,
        backend_cache: needsBackend,
        node_modules_cache: needsFrontend || needsBackend,
        build_cache: needsFrontend || needsBackend
    };
}

/**
 * Main function
 */
function main() {
    console.log('🔍 CI Change Detection Starting...\n');
    
    const changedFiles = getChangedFiles();
    console.log(`📁 Changed files (${changedFiles.length}):`);
    changedFiles.forEach(file => {
        console.log(`  - ${file}`);
    });
    
    if (changedFiles.length === 0) {
        console.log('\n✅ No changes detected, skipping CI');
        process.exit(0);
    }
    
    const changeType = getChangeType(changedFiles);
    console.log(`\n📊 Change type: ${changeType}`);
    
    const jobMatrix = generateJobMatrix(changedFiles);
    console.log('\n🎯 Job execution matrix:');
    Object.entries(jobMatrix).forEach(([job, shouldRun]) => {
        const status = shouldRun ? '✅ RUN' : '⏭️  SKIP';
        console.log(`  ${status} ${job}`);
    });
    
    const nodeMatrix = generateNodeMatrix(changeType);
    console.log(`\n🟢 Node.js versions: ${nodeMatrix.join(', ')}`);
    
    const cachingStrategy = generateCachingStrategy(changedFiles);
    console.log('\n💾 Caching strategy:');
    Object.entries(cachingStrategy).forEach(([cache, enabled]) => {
        const status = enabled ? '✅ ENABLE' : '⏭️  SKIP';
        console.log(`  ${status} ${cache}`);
    });
    
    // Set GitHub Actions outputs
    console.log('\n📤 Setting GitHub Actions outputs...');
    
    // Job matrix
    const jobsToRun = Object.entries(jobMatrix)
        .filter(([, shouldRun]) => shouldRun)
        .map(([job]) => job);
    
    // Performance estimation
    const estimatedTime = estimateExecutionTime(jobMatrix, changeType);
    
    // Set outputs using modern GitHub Actions syntax
    setGitHubOutput('jobs', JSON.stringify(jobsToRun));
    setGitHubOutput('frontend', jobMatrix.frontend);
    setGitHubOutput('backend', jobMatrix.backend);
    setGitHubOutput('docs', jobMatrix.docs);
    setGitHubOutput('config', jobMatrix.config);
    setGitHubOutput('quality_gates', jobMatrix.quality_gates);
    setGitHubOutput('code_quality', jobMatrix.code_quality);
    setGitHubOutput('build_matrix', jobMatrix.build_matrix);
    setGitHubOutput('node_versions', JSON.stringify(nodeMatrix));
    setGitHubOutput('frontend_cache', cachingStrategy.frontend_cache);
    setGitHubOutput('backend_cache', cachingStrategy.backend_cache);
    setGitHubOutput('node_modules_cache', cachingStrategy.node_modules_cache);
    setGitHubOutput('build_cache', cachingStrategy.build_cache);
    setGitHubOutput('change_type', changeType);
    setGitHubOutput('estimated_time', estimatedTime);
    
    console.log(`\n⏱️  Estimated execution time: ${estimatedTime} minutes`);
    console.log('✅ CI Change Detection Complete');
}

/**
 * Estimate execution time based on jobs to run
 */
function estimateExecutionTime(jobMatrix, changeType) {
    const baseTime = 2; // Base setup time
    const jobTimes = {
        frontend: 8,
        backend: 8,
        docs: 2,
        config: 3,
        quality_gates: 4,
        code_quality: 3,
        build_matrix: 6
    };
    
    let totalTime = baseTime;
    
    Object.entries(jobMatrix).forEach(([job, shouldRun]) => {
        if (shouldRun) {
            totalTime += jobTimes[job] || 0;
        }
    });
    
    // Apply parallel execution benefits
    if (jobMatrix.frontend && jobMatrix.backend) {
        totalTime -= 4; // Parallel execution saves time
    }
    
    // Apply change type optimizations
    if (changeType === 'docs') {
        totalTime *= 0.3; // Docs changes are much faster
    } else if (changeType === 'config') {
        totalTime *= 0.5; // Config changes are faster
    }
    
    return Math.round(totalTime);
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = {
    getChangedFiles,
    needsValidation,
    getChangeType,
    generateJobMatrix,
    generateNodeMatrix,
    generateCachingStrategy
};
