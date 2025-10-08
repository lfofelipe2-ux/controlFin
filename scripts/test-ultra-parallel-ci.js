#!/usr/bin/env node

/**
 * Ultra-Parallel CI Test Script
 * Tests the change detection and CI workflow with different scenarios
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Test scenarios
const scenarios = [
    {
        name: 'Frontend Only Changes',
        description: 'Test with changes only in frontend code',
        changes: () => {
            // Add a comment to a frontend file
            const frontendFile = 'controlfin-frontend/src/App.tsx';
            const content = fs.readFileSync(frontendFile, 'utf8');
            fs.writeFileSync(frontendFile, content + '\n// Test comment for frontend changes\n');
        },
        expectedJobs: ['frontend', 'config', 'quality_gates', 'code_quality', 'build_matrix']
    },
    {
        name: 'Backend Only Changes',
        description: 'Test with changes only in backend code',
        changes: () => {
            // Add a comment to a backend file
            const backendFile = 'controlfin-backend/src/server.ts';
            const content = fs.readFileSync(backendFile, 'utf8');
            fs.writeFileSync(backendFile, content + '\n// Test comment for backend changes\n');
        },
        expectedJobs: ['backend', 'config', 'quality_gates', 'code_quality', 'build_matrix']
    },
    {
        name: 'Documentation Only Changes',
        description: 'Test with changes only in documentation',
        changes: () => {
            // Add a comment to README
            const readmeFile = 'README.md';
            const content = fs.readFileSync(readmeFile, 'utf8');
            fs.writeFileSync(readmeFile, content + '\n<!-- Test comment for docs changes -->\n');
        },
        expectedJobs: ['docs']
    },
    {
        name: 'Full-Stack Changes',
        description: 'Test with changes in both frontend and backend',
        changes: () => {
            // Add comments to both frontend and backend files
            const frontendFile = 'controlfin-frontend/src/App.tsx';
            const backendFile = 'controlfin-backend/src/server.ts';
            
            const frontendContent = fs.readFileSync(frontendFile, 'utf8');
            const backendContent = fs.readFileSync(backendFile, 'utf8');
            
            fs.writeFileSync(frontendFile, frontendContent + '\n// Test comment for full-stack changes\n');
            fs.writeFileSync(backendFile, backendContent + '\n// Test comment for full-stack changes\n');
        },
        expectedJobs: ['frontend', 'backend', 'config', 'quality_gates', 'code_quality', 'build_matrix']
    }
];

// Test results storage
const testResults = [];

/**
 * Run a single test scenario
 */
async function runScenario(scenario, index) {
    console.log(`\n🧪 Running Scenario ${index + 1}: ${scenario.name}`);
    console.log(`📝 ${scenario.description}`);
    
    const startTime = Date.now();
    
    try {
        // Reset to clean state
        console.log('🔄 Resetting to clean state...');
        execSync('git reset --hard HEAD', { stdio: 'pipe' });
        
        // Apply changes
        console.log('📝 Applying changes...');
        scenario.changes();
        
        // Stage and commit changes
        execSync('git add .', { stdio: 'pipe' });
        execSync(`git commit -m "test: ${scenario.name.toLowerCase().replace(/\s+/g, '-')}"`, { stdio: 'pipe' });
        
        // Test change detector
        console.log('🔍 Testing change detector...');
        const output = execSync('node scripts/ci-change-detector.js', { 
            encoding: 'utf8',
            env: {
                ...process.env,
                GITHUB_EVENT_NAME: 'push',
                GITHUB_REF_NAME: 'test/ultra-parallel-ci',
                GITHUB_OUTPUT: '/tmp/github_output_test.txt'
            }
        });
        
        // Read outputs
        let outputs = {};
        if (fs.existsSync('/tmp/github_output_test.txt')) {
            const outputContent = fs.readFileSync('/tmp/github_output_test.txt', 'utf8');
            outputContent.split('\n').forEach(line => {
                if (line.includes('=')) {
                    const [key, value] = line.split('=');
                    outputs[key] = value;
                }
            });
        }
        
        // Parse job matrix
        const jobsToRun = outputs.jobs ? JSON.parse(outputs.jobs) : [];
        
        // Validate results
        const success = scenario.expectedJobs.every(job => jobsToRun.includes(job));
        const unexpectedJobs = jobsToRun.filter(job => !scenario.expectedJobs.includes(job));
        const missingJobs = scenario.expectedJobs.filter(job => !jobsToRun.includes(job));
        
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        const result = {
            scenario: scenario.name,
            success,
            duration,
            expectedJobs: scenario.expectedJobs,
            actualJobs: jobsToRun,
            missingJobs,
            unexpectedJobs,
            outputs: {
                frontend: outputs.frontend === 'true',
                backend: outputs.backend === 'true',
                docs: outputs.docs === 'true',
                config: outputs.config === 'true',
                quality_gates: outputs.quality_gates === 'true',
                code_quality: outputs.code_quality === 'true',
                build_matrix: outputs.build_matrix === 'true'
            },
            changeType: outputs.change_type,
            estimatedTime: outputs.estimated_time
        };
        
        testResults.push(result);
        
        // Display results
        console.log(`✅ Change detector output:`);
        console.log(`   Jobs to run: ${jobsToRun.join(', ')}`);
        console.log(`   Frontend: ${outputs.frontend}`);
        console.log(`   Backend: ${outputs.backend}`);
        console.log(`   Docs: ${outputs.docs}`);
        console.log(`   Change type: ${outputs.change_type}`);
        console.log(`   Estimated time: ${outputs.estimated_time} minutes`);
        
        if (success) {
            console.log(`✅ Scenario ${index + 1} PASSED (${duration}ms)`);
        } else {
            console.log(`❌ Scenario ${index + 1} FAILED (${duration}ms)`);
            if (missingJobs.length > 0) {
                console.log(`   Missing jobs: ${missingJobs.join(', ')}`);
            }
            if (unexpectedJobs.length > 0) {
                console.log(`   Unexpected jobs: ${unexpectedJobs.join(', ')}`);
            }
        }
        
    } catch (error) {
        console.error(`❌ Scenario ${index + 1} ERROR:`, error.message);
        testResults.push({
            scenario: scenario.name,
            success: false,
            error: error.message,
            duration: Date.now() - startTime
        });
    }
}

/**
 * Generate test report
 */
function generateReport() {
    console.log('\n📊 TEST REPORT');
    console.log('================');
    
    const totalTests = testResults.length;
    const passedTests = testResults.filter(r => r.success).length;
    const failedTests = totalTests - passedTests;
    
    console.log(`Total scenarios: ${totalTests}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${failedTests}`);
    console.log(`Success rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
    
    console.log('\n📋 Detailed Results:');
    testResults.forEach((result, index) => {
        console.log(`\n${index + 1}. ${result.scenario}`);
        console.log(`   Status: ${result.success ? '✅ PASSED' : '❌ FAILED'}`);
        console.log(`   Duration: ${result.duration}ms`);
        
        if (result.success) {
            console.log(`   Jobs detected: ${result.actualJobs.join(', ')}`);
            console.log(`   Change type: ${result.changeType}`);
            console.log(`   Estimated time: ${result.estimatedTime} minutes`);
        } else if (result.error) {
            console.log(`   Error: ${result.error}`);
        } else {
            console.log(`   Expected: ${result.expectedJobs.join(', ')}`);
            console.log(`   Actual: ${result.actualJobs.join(', ')}`);
            if (result.missingJobs.length > 0) {
                console.log(`   Missing: ${result.missingJobs.join(', ')}`);
            }
            if (result.unexpectedJobs.length > 0) {
                console.log(`   Unexpected: ${result.unexpectedJobs.join(', ')}`);
            }
        }
    });
    
    // Save report to file
    const reportPath = 'ULTRA_PARALLEL_CI_TEST_REPORT.md';
    const reportContent = `# Ultra-Parallel CI Test Report

Generated: ${new Date().toISOString()}

## Summary
- Total scenarios: ${totalTests}
- Passed: ${passedTests}
- Failed: ${failedTests}
- Success rate: ${((passedTests / totalTests) * 100).toFixed(1)}%

## Detailed Results

${testResults.map((result, index) => `
### ${index + 1}. ${result.scenario}
- **Status**: ${result.success ? '✅ PASSED' : '❌ FAILED'}
- **Duration**: ${result.duration}ms
- **Expected Jobs**: ${result.expectedJobs?.join(', ') || 'N/A'}
- **Actual Jobs**: ${result.actualJobs?.join(', ') || 'N/A'}
- **Change Type**: ${result.changeType || 'N/A'}
- **Estimated Time**: ${result.estimatedTime || 'N/A'} minutes
${result.missingJobs?.length > 0 ? `- **Missing Jobs**: ${result.missingJobs.join(', ')}` : ''}
${result.unexpectedJobs?.length > 0 ? `- **Unexpected Jobs**: ${result.unexpectedJobs.join(', ')}` : ''}
${result.error ? `- **Error**: ${result.error}` : ''}
`).join('')}

## Conclusion
${passedTests === totalTests ? 
    '🎉 All tests passed! The ultra-parallel CI workflow is working correctly.' : 
    `⚠️ ${failedTests} test(s) failed. Please review the issues above.`}
`;
    
    fs.writeFileSync(reportPath, reportContent);
    console.log(`\n📄 Report saved to: ${reportPath}`);
}

/**
 * Main execution
 */
async function main() {
    console.log('🚀 Starting Ultra-Parallel CI Test Suite');
    console.log('==========================================');
    
    // Clean up any previous test outputs
    if (fs.existsSync('/tmp/github_output_test.txt')) {
        fs.unlinkSync('/tmp/github_output_test.txt');
    }
    
    // Run all scenarios
    for (let i = 0; i < scenarios.length; i++) {
        await runScenario(scenarios[i], i);
    }
    
    // Generate report
    generateReport();
    
    // Clean up
    if (fs.existsSync('/tmp/github_output_test.txt')) {
        fs.unlinkSync('/tmp/github_output_test.txt');
    }
    
    console.log('\n🏁 Test suite completed!');
}

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { runScenario, generateReport };
