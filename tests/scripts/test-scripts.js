/**
 * TESTING SCRIPTS - ControlFin Project
 * 
 * This file provides standardized testing scripts and commands
 * for the ControlFin project testing infrastructure.
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

// Test execution scripts
export const testScripts = {
    // Unit tests
    unit: () => {
        console.log('🧪 Running unit tests...');
        execSync('npm run test:unit', { stdio: 'inherit' });
    },

    // Integration tests
    integration: () => {
        console.log('🔗 Running integration tests...');
        execSync('npm run test:integration', { stdio: 'inherit' });
    },

    // E2E tests
    e2e: () => {
        console.log('🌐 Running E2E tests...');
        execSync('npm run test:e2e', { stdio: 'inherit' });
    },

    // All tests
    all: () => {
        console.log('🚀 Running all tests...');
        execSync('npm run test:all', { stdio: 'inherit' });
    },

    // Coverage tests
    coverage: () => {
        console.log('📊 Running tests with coverage...');
        execSync('npm run test:coverage', { stdio: 'inherit' });
    },

    // Watch mode
    watch: () => {
        console.log('👀 Running tests in watch mode...');
        execSync('npm run test:watch', { stdio: 'inherit' });
    },
};

// Test validation scripts
export const validationScripts = {
    // Validate test structure
    structure: () => {
        console.log('📁 Validating test structure...');

        const requiredDirs = [
            'tests/templates',
            'tests/utils',
            'tests/config',
            'tests/guidelines',
            'tests/unit',
            'tests/integration',
            'tests/e2e',
        ];

        const missingDirs = requiredDirs.filter(dir => !existsSync(dir));

        if (missingDirs.length > 0) {
            console.error('❌ Missing required test directories:', missingDirs);
            process.exit(1);
        }

        console.log('✅ Test structure is valid');
    },

    // Validate test configuration
    config: () => {
        console.log('⚙️ Validating test configuration...');

        const requiredFiles = [
            'tests/setup.ts',
            'tests/config/test-config.ts',
            'tests/utils/test-utils.tsx',
            'tests/guidelines/testing-guidelines.md',
            'vitest.config.ts',
            'playwright.config.ts',
        ];

        const missingFiles = requiredFiles.filter(file => !existsSync(file));

        if (missingFiles.length > 0) {
            console.error('❌ Missing required test files:', missingFiles);
            process.exit(1);
        }

        console.log('✅ Test configuration is valid');
    },

    // Validate test templates
    templates: () => {
        console.log('📋 Validating test templates...');

        const requiredTemplates = [
            'tests/templates/component-test-template.tsx',
            'tests/templates/service-test-template.ts',
            'tests/templates/e2e-test-template.spec.ts',
        ];

        const missingTemplates = requiredTemplates.filter(template => !existsSync(template));

        if (missingTemplates.length > 0) {
            console.error('❌ Missing required test templates:', missingTemplates);
            process.exit(1);
        }

        console.log('✅ Test templates are valid');
    },
};

// Test generation scripts
export const generationScripts = {
    // Generate component test
    component: (componentName: string, componentPath: string) => {
        console.log(`🔧 Generating test for component: ${componentName}`);

        const templatePath = 'tests/templates/component-test-template.tsx';
        const testPath = join(componentPath, '__tests__', `${componentName}.test.tsx`);

        if (!existsSync(templatePath)) {
            console.error('❌ Component test template not found');
            process.exit(1);
        }

        // Read template and replace placeholders
        const fs = require('fs');
        let template = fs.readFileSync(templatePath, 'utf8');
        template = template.replace(/\[ComponentName\]/g, componentName);
        template = template.replace(/\[component-name\]/g, componentName.toLowerCase());

        // Write test file
        fs.writeFileSync(testPath, template);
        console.log(`✅ Generated test file: ${testPath}`);
    },

    // Generate service test
    service: (serviceName: string, servicePath: string) => {
        console.log(`🔧 Generating test for service: ${serviceName}`);

        const templatePath = 'tests/templates/service-test-template.ts';
        const testPath = join(servicePath, '__tests__', `${serviceName}.test.ts`);

        if (!existsSync(templatePath)) {
            console.error('❌ Service test template not found');
            process.exit(1);
        }

        // Read template and replace placeholders
        const fs = require('fs');
        let template = fs.readFileSync(templatePath, 'utf8');
        template = template.replace(/\[ServiceName\]/g, serviceName);
        template = template.replace(/\[endpoint\]/g, serviceName.toLowerCase());

        // Write test file
        fs.writeFileSync(testPath, template);
        console.log(`✅ Generated test file: ${testPath}`);
    },

    // Generate E2E test
    e2e: (featureName: string) => {
        console.log(`🔧 Generating E2E test for feature: ${featureName}`);

        const templatePath = 'tests/templates/e2e-test-template.spec.ts';
        const testPath = join('tests/e2e', `${featureName}.spec.ts`);

        if (!existsSync(templatePath)) {
            console.error('❌ E2E test template not found');
            process.exit(1);
        }

        // Read template and replace placeholders
        const fs = require('fs');
        let template = fs.readFileSync(templatePath, 'utf8');
        template = template.replace(/\[FeatureName\]/g, featureName);

        // Write test file
        fs.writeFileSync(testPath, template);
        console.log(`✅ Generated test file: ${testPath}`);
    },
};

// Test maintenance scripts
export const maintenanceScripts = {
    // Clean test artifacts
    clean: () => {
        console.log('🧹 Cleaning test artifacts...');

        const artifacts = [
            'coverage/',
            'test-results/',
            'playwright-report/',
            'tests/screenshots/',
        ];

        artifacts.forEach(artifact => {
            if (existsSync(artifact)) {
                execSync(`rm -rf ${artifact}`, { stdio: 'inherit' });
                console.log(`✅ Cleaned ${artifact}`);
            }
        });
    },

    // Update test dependencies
    update: () => {
        console.log('📦 Updating test dependencies...');
        execSync('npm update @testing-library/react @testing-library/jest-dom vitest playwright', { stdio: 'inherit' });
        console.log('✅ Test dependencies updated');
    },

    // Install test dependencies
    install: () => {
        console.log('📦 Installing test dependencies...');
        execSync('npm install --save-dev @testing-library/react @testing-library/jest-dom vitest playwright @vitest/ui', { stdio: 'inherit' });
        console.log('✅ Test dependencies installed');
    },
};

// Test reporting scripts
export const reportingScripts = {
    // Generate test report
    report: () => {
        console.log('📊 Generating test report...');

        // Run tests with coverage
        execSync('npm run test:coverage', { stdio: 'inherit' });

        // Generate HTML report
        execSync('npm run test:report:html', { stdio: 'inherit' });

        console.log('✅ Test report generated');
    },

    // Open coverage report
    coverage: () => {
        console.log('📊 Opening coverage report...');
        execSync('open coverage/index.html', { stdio: 'inherit' });
    },

    // Open Playwright report
    playwright: () => {
        console.log('🌐 Opening Playwright report...');
        execSync('npx playwright show-report', { stdio: 'inherit' });
    },
};

// Test debugging scripts
export const debuggingScripts = {
    // Debug unit tests
    debug: () => {
        console.log('🐛 Debugging unit tests...');
        execSync('npm run test:debug', { stdio: 'inherit' });
    },

    // Debug E2E tests
    debugE2E: () => {
        console.log('🐛 Debugging E2E tests...');
        execSync('npx playwright test --debug', { stdio: 'inherit' });
    },

    // Run tests in headed mode
    headed: () => {
        console.log('👀 Running E2E tests in headed mode...');
        execSync('npx playwright test --headed', { stdio: 'inherit' });
    },
};

// Export all scripts
export default {
    testScripts,
    validationScripts,
    generationScripts,
    maintenanceScripts,
    reportingScripts,
    debuggingScripts,
};
