#!/usr/bin/env node

/**
 * Simple i18n Check Script
 *
 * Quick validation to check if translation keys exist in files
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple check function
function checkTranslations() {
  console.log('🔍 Quick i18n validation...\n');

  // Check if translation files exist
  const localesDir = path.join(__dirname, '../src/locales');
  const enAuth = path.join(localesDir, 'en/auth.json');
  const ptAuth = path.join(localesDir, 'pt/auth.json');
  const enCommon = path.join(localesDir, 'en/common.json');
  const ptCommon = path.join(localesDir, 'pt/common.json');

  const files = [
    { name: 'EN Auth', path: enAuth },
    { name: 'PT Auth', path: ptAuth },
    { name: 'EN Common', path: enCommon },
    { name: 'PT Common', path: ptCommon },
  ];

  let allGood = true;

  for (const file of files) {
    if (fs.existsSync(file.path)) {
      try {
        const content = fs.readFileSync(file.path, 'utf8');
        const parsed = JSON.parse(content);
        const keyCount = countKeys(parsed);
        console.log(`✅ ${file.name}: ${keyCount} keys`);
      } catch (error) {
        console.log(`❌ ${file.name}: Invalid JSON - ${error.message}`);
        allGood = false;
      }
    } else {
      console.log(`❌ ${file.name}: File not found`);
      allGood = false;
    }
  }

  // Check for common issues
  console.log('\n🔍 Checking for common issues...');

  // Check if components use t() function
  const componentsDir = path.join(__dirname, '../src/components');
  const componentFiles = findFiles(componentsDir, '.tsx');

  let hasTranslationUsage = false;
  for (const file of componentFiles) {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes("t('") || content.includes('t("')) {
      hasTranslationUsage = true;
      break;
    }
  }

  if (hasTranslationUsage) {
    console.log('✅ Components use translation functions');
  } else {
    console.log('⚠️  No translation usage found in components');
  }

  // Check for hardcoded strings
  const hardcodedStrings = [];
  for (const file of componentFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Look for hardcoded English strings in JSX
      if (line.includes('>') && line.includes('<') && /[A-Z][a-z]+ [A-Z][a-z]+/.test(line)) {
        hardcodedStrings.push(`${path.basename(file)}:${i + 1} - ${line.trim()}`);
      }
    }
  }

  if (hardcodedStrings.length === 0) {
    console.log('✅ No obvious hardcoded strings found');
  } else {
    console.log(`⚠️  Found ${hardcodedStrings.length} potential hardcoded strings:`);
    hardcodedStrings.slice(0, 3).forEach((str) => console.log(`   ${str}`));
    if (hardcodedStrings.length > 3) {
      console.log(`   ... and ${hardcodedStrings.length - 3} more`);
    }
  }

  console.log('\n📊 Summary:');
  if (allGood && hasTranslationUsage) {
    console.log('✅ i18n setup looks good!');
    console.log('💡 Run the app manually to test language switching');
    process.exit(0);
  } else {
    console.log('❌ Issues found - please review above');
    process.exit(1);
  }
}

// Helper functions
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

// Run check
checkTranslations();
