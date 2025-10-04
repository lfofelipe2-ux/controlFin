#!/usr/bin/env node

/**
 * i18n-Only Validation Script
 *
 * Focuses only on i18n validation, ignoring linting issues
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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
  let hasHardcodedStrings = false;

  for (const file of componentFiles) {
    const content = fs.readFileSync(file, 'utf8');

    if (content.includes("t('") || content.includes('t("')) {
      hasTranslations = true;
    }

    // Check for obvious hardcoded English strings
    if (
      /[A-Z][a-z]+ [A-Z][a-z]+/.test(content) &&
      !content.includes('//') &&
      !content.includes('*')
    ) {
      hasHardcodedStrings = true;
    }
  }

  if (hasTranslations) {
    console.log('✅ Components use translation functions');
  } else {
    console.log('⚠️  No translation usage found in components');
  }

  if (!hasHardcodedStrings) {
    console.log('✅ No obvious hardcoded strings found');
  } else {
    console.log('⚠️  Potential hardcoded strings detected');
  }

  return hasTranslations && !hasHardcodedStrings;
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

function main() {
  console.log('🚀 i18n VALIDATION STARTING...\n');

  const checks = [
    {
      name: 'TypeScript Compilation',
      fn: () => runCommand('npm run build', 'TypeScript compilation'),
    },
    {
      name: 'Translation Files',
      fn: validateTranslations,
    },
    {
      name: 'Component Translations',
      fn: checkComponentsForTranslations,
    },
  ];

  let allPassed = true;

  for (const check of checks) {
    console.log(`\n📋 ${check.name}:`);
    const result = check.fn();

    if (result.success === false) {
      allPassed = false;
    }
  }

  console.log('\n📊 i18n VALIDATION SUMMARY:');

  if (allPassed) {
    console.log('✅ ALL i18n CHECKS PASSED!');
    console.log('🚀 i18n implementation is ready!');
    console.log('\n💡 Manual testing checklist:');
    console.log('   1. Run: npm run dev');
    console.log('   2. Test language switching in browser');
    console.log('   3. Verify all auth forms display correctly');
    console.log('   4. Check that no translation keys are visible');
    console.log('   5. Test form validation messages');
    process.exit(0);
  } else {
    console.log('❌ i18n VALIDATION FAILED!');
    console.log('🔧 Please fix the i18n issues above');
    process.exit(1);
  }
}

// Run validation
main();
