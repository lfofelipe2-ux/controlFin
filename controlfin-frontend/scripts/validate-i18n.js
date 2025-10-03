#!/usr/bin/env node

/**
 * i18n Validation Script
 *
 * Validates that all translation keys used in components exist in translation files
 * and checks for missing keys or unused keys.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const LOCALES_DIR = path.join(__dirname, '../src/locales');
const COMPONENTS_DIR = path.join(__dirname, '../src/components');
const SUPPORTED_LANGUAGES = ['en', 'pt'];

// Helper function to find all files recursively
function findFiles(dir, extension) {
  const files = [];
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

// Extract translation keys from files
function extractTranslationKeys(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const keys = new Set();

  // Match t('key') or t("key") patterns
  const tPattern = /t\(['"`]([^'"`]+)['"`]\)/g;
  let match;

  while ((match = tPattern.exec(content)) !== null) {
    const key = match[1];
    // If key doesn't start with namespace, assume it's from auth namespace
    if (!key.includes('.') || !['auth', 'common', 'messages'].includes(key.split('.')[0])) {
      keys.add(`auth.${key}`);
    } else {
      keys.add(key);
    }
  }

  return keys;
}

// Load translation files
function loadTranslations(language) {
  const translations = {};
  const langDir = path.join(LOCALES_DIR, language);

  if (!fs.existsSync(langDir)) {
    console.log(`❌ Language directory not found: ${langDir}`);
    return translations;
  }

  const files = fs.readdirSync(langDir);

  for (const file of files) {
    if (file.endsWith('.json')) {
      const namespace = file.replace('.json', '');
      const filePath = path.join(langDir, file);

      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const parsed = JSON.parse(content);

        // Flatten the structure for easier key lookup
        if (namespace === 'auth') {
          // For auth.json, flatten the nested structure
          for (const [section, sectionData] of Object.entries(parsed)) {
            translations[`auth.${section}`] = sectionData;
          }
        } else {
          translations[namespace] = parsed;
        }
      } catch (error) {
        console.log(`❌ Error parsing ${filePath}: ${error.message}`);
      }
    }
  }

  return translations;
}

// Check if key exists in translations
function keyExists(translations, key) {
  const parts = key.split('.');

  // Handle auth namespace specially
  if (parts[0] === 'auth' && parts.length >= 2) {
    const section = `auth.${parts[1]}`;
    if (!translations[section]) {
      return false;
    }

    // Check nested key in the section
    const nestedKey = parts.slice(2).join('.');
    if (!nestedKey) {
      return true; // The section itself exists
    }

    return keyExistsInObject(translations[section], nestedKey);
  }

  // Handle other namespaces
  const namespace = parts[0];
  if (!translations[namespace]) {
    return false;
  }

  const nestedKey = parts.slice(1).join('.');
  if (!nestedKey) {
    return true; // The namespace itself exists
  }

  return keyExistsInObject(translations[namespace], nestedKey);
}

// Helper function to check nested keys in an object
function keyExistsInObject(obj, key) {
  const parts = key.split('.');
  let current = obj;

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return false;
    }
  }

  return typeof current === 'string';
}

// Main validation function
function validateTranslations() {
  console.log('🔍 Validating i18n implementation...\n');

  // Find all component files
  const componentFiles = findFiles(COMPONENTS_DIR, '.tsx');
  console.log(`📁 Found ${componentFiles.length} component files`);

  // Extract all translation keys from components
  const usedKeys = new Set();
  for (const file of componentFiles) {
    const keys = extractTranslationKeys(file);
    keys.forEach((key) => usedKeys.add(key));
  }

  console.log(`🔑 Found ${usedKeys.size} unique translation keys in components\n`);

  // Validate each language
  let hasErrors = false;

  for (const lang of SUPPORTED_LANGUAGES) {
    console.log(`🌐 Validating ${lang.toUpperCase()} translations:`);

    const translations = loadTranslations(lang);
    const missingKeys = [];
    const unusedKeys = new Set();

    // Check used keys
    for (const key of usedKeys) {
      const namespace = key.split('.')[0];

      if (!translations[namespace]) {
        missingKeys.push(`${key} (namespace '${namespace}' not found)`);
        continue;
      }

      if (!keyExists(translations[namespace], key)) {
        missingKeys.push(key);
      }
    }

    // Check for unused keys (optional)
    for (const [namespace, content] of Object.entries(translations)) {
      const namespaceKeys = getAllKeys(content, namespace);
      for (const key of namespaceKeys) {
        if (!usedKeys.has(key)) {
          unusedKeys.add(key);
        }
      }
    }

    // Report results
    if (missingKeys.length === 0) {
      console.log(`  ✅ All ${usedKeys.size} keys found`);
    } else {
      console.log(`  ❌ ${missingKeys.length} missing keys:`);
      missingKeys.forEach((key) => console.log(`    - ${key}`));
      hasErrors = true;
    }

    if (unusedKeys.size > 0) {
      console.log(`  ⚠️  ${unusedKeys.size} potentially unused keys:`);
      Array.from(unusedKeys)
        .slice(0, 5)
        .forEach((key) => console.log(`    - ${key}`));
      if (unusedKeys.size > 5) {
        console.log(`    ... and ${unusedKeys.size - 5} more`);
      }
    }

    console.log('');
  }

  // Summary
  if (hasErrors) {
    console.log('❌ Validation failed! Please fix missing translation keys.');
    process.exit(1);
  } else {
    console.log('✅ All translations validated successfully!');
    process.exit(0);
  }
}

// Helper to get all keys from nested object
function getAllKeys(obj, prefix = '') {
  const keys = [];

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'object' && value !== null) {
      keys.push(...getAllKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }

  return keys;
}

// Run validation
if (import.meta.url === `file://${process.argv[1]}`) {
  validateTranslations();
}

export { validateTranslations };
