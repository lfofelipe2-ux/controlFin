#!/usr/bin/env node

/**
 * Pre-PR Validation Script
 *
 * Comprehensive validation that runs before creating PRs
 * Includes i18n validation and hardcoded strings detection
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { scanForHardcodedStrings } from './hardcoded-strings-detector.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function runCommand(command, description) {
  console.log(`🔄 ${description}...`);
  try {
    const output = execSync(command, {
      cwd: path.join(__dirname, '..'),
      encoding: 'utf8',
      stdio: 'pipe',
    });
    console.log(`✅ ${description} - SUCCESS`);
    return { success: true, output };
  } catch (error) {
    console.log(`❌ ${description} - FAILED`);
    console.log(`   Error: ${error.message}`);
    return { success: false, error };
  }
}

function validateTranslations() {
  console.log('🔍 Validating translation files...');

  const localesDir = path.join(__dirname, '../src/locales');
  const requiredFiles = [
    { path: path.join(localesDir, 'en/auth.json'), name: 'English Auth' },
    { path: path.join(localesDir, 'pt/auth.json'), name: 'Portuguese Auth' },
    { path: path.join(localesDir, 'en/common.json'), name: 'English Common' },
    { path: path.join(localesDir, 'pt/common.json'), name: 'Portuguese Common' },
  ];

  let allValid = true;

  for (const file of requiredFiles) {
    if (!fs.existsSync(file.path)) {
      console.log(`❌ ${file.name} - FILE MISSING`);
      allValid = false;
      continue;
    }

    try {
      const content = fs.readFileSync(file.path, 'utf8');
      const parsed = JSON.parse(content);
      const keyCount = countKeys(parsed);
      console.log(`✅ ${file.name} - ${keyCount} keys, valid JSON`);
    } catch (error) {
      console.log(`❌ ${file.name} - INVALID JSON: ${error.message}`);
      allValid = false;
    }
  }

  return allValid;
}

function countKeys(obj, prefix = '') {
  let count = 0;
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null) {
      count += countKeys(value, prefix + key + '.');
    } else {
      count++;
    }
  }
  return count;
}

function checkComponentsForTranslations() {
  console.log('🔍 Checking components for translation usage...');

  const componentsDir = path.join(__dirname, '../src/components');
  const componentFiles = findFiles(componentsDir, '.tsx');

  let hasTranslations = false;
  let translationCount = 0;

  for (const file of componentFiles) {
    const content = fs.readFileSync(file, 'utf8');

    if (content.includes("t('") || content.includes('t("')) {
      hasTranslations = true;
      // Count translation calls
      const tCalls = (content.match(/t\(['"`]/g) || []).length;
      translationCount += tCalls;
    }
  }

  if (hasTranslations) {
    console.log(`✅ Components use translation functions (${translationCount} calls)`);
  } else {
    console.log('⚠️  No translation usage found in components');
  }

  return hasTranslations;
}

function findFiles(dir, extension) {
  const files = [];
  if (!fs.existsSync(dir)) return files;

  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...findFiles(fullPath, extension));
    } else if (item.endsWith(extension)) {
      files.push(fullPath);
    }
  }

  return files;
}

function checkGitStatus() {
  console.log('🔍 Checking Git status...');

  try {
    // Check if we're in a git repository
    execSync('git status', { stdio: 'pipe' });

    // Check if there are uncommitted changes
    const status = execSync('git status --porcelain', { encoding: 'utf8' });

    if (status.trim()) {
      console.log('⚠️  Uncommitted changes detected');
      console.log('   Please commit your changes before creating PR');
      return false;
    } else {
      console.log('✅ Working directory is clean');
      return true;
    }
  } catch (error) {
    console.log('❌ Not in a Git repository');
    return false;
  }
}

function main() {
  console.log('🚀 PRE-PR VALIDATION STARTING...\n');

  const checks = [
    {
      name: 'Git Status',
      fn: checkGitStatus,
      required: true,
    },
    {
      name: 'TypeScript Compilation',
      fn: () => runCommand('npm run build', 'TypeScript compilation'),
      required: true,
    },
    {
      name: 'Translation Files',
      fn: validateTranslations,
      required: true,
    },
    {
      name: 'Component Translations',
      fn: checkComponentsForTranslations,
      required: true,
    },
    {
      name: 'Hardcoded Strings Detection',
      fn: scanForHardcodedStrings,
      required: true,
    },
  ];

  let allPassed = true;
  let criticalFailures = 0;

  for (const check of checks) {
    console.log(`\n📋 ${check.name}:`);
    const result = check.fn();

    if (result.success === false) {
      allPassed = false;
      if (check.required) {
        criticalFailures++;
      }
    }
  }

  console.log('\n📊 PRE-PR VALIDATION SUMMARY:');

  if (allPassed && criticalFailures === 0) {
    console.log('✅ ALL CHECKS PASSED!');
    console.log('🚀 Ready to create PR!');
    console.log('\n💡 Next steps:');
    console.log('   1. Create your PR');
    console.log('   2. Run manual testing: npm run dev');
    console.log('   3. Test language switching in browser');
    console.log('   4. Verify all auth forms work correctly');
    process.exit(0);
  } else {
    console.log('❌ VALIDATION FAILED!');
    console.log(`🔧 ${criticalFailures} critical issue(s) found`);
    console.log('\n🚫 DO NOT CREATE PR until issues are fixed:');

    if (criticalFailures > 0) {
      console.log('   • Fix all critical issues above');
      console.log('   • Run validation again: npm run validate:pre-pr');
      console.log('   • Ensure all hardcoded strings are replaced with i18n');
    }

    process.exit(1);
  }
}

// Run validation
main();
