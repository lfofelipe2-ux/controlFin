#!/usr/bin/env node

/**
 * Setup Git Hooks Script
 *
 * Sets up automatic validation before creating PRs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function setupGitHooks() {
  console.log('🔧 Setting up Git hooks for automatic validation...\n');

  const projectRoot = path.join(__dirname, '../..');
  const hooksDir = path.join(projectRoot, '.git/hooks');

  // Check if we're in a git repository
  if (!fs.existsSync(hooksDir)) {
    console.log('❌ Not in a Git repository');
    console.log('   Please run this from the project root directory');
    process.exit(1);
  }

  // Create pre-push hook
  const prePushHook = `#!/bin/sh

# Pre-push hook for i18n validation
echo "🚀 Running pre-push validation..."

# Change to frontend directory
cd controlfin-frontend

# Run pre-PR validation
npm run validate:pre-pr

# Check exit code
if [ $? -ne 0 ]; then
  echo ""
  echo "❌ PRE-PUSH VALIDATION FAILED!"
  echo "🚫 Push blocked due to validation errors"
  echo ""
  echo "💡 To fix:"
  echo "   1. Fix the issues above"
  echo "   2. Run: npm run validate:pre-pr"
  echo "   3. Try pushing again"
  echo ""
  exit 1
fi

echo "✅ Pre-push validation passed!"
`;

  const prePushPath = path.join(hooksDir, 'pre-push');
  fs.writeFileSync(prePushPath, prePushHook);
  fs.chmodSync(prePushPath, '755');

  // Create pre-commit hook (optional, lighter validation)
  const preCommitHook = `#!/bin/sh

# Pre-commit hook for quick i18n validation
echo "🔍 Running quick i18n validation..."

# Change to frontend directory
cd controlfin-frontend

# Run quick i18n validation
npm run validate:i18n

# Check exit code
if [ $? -ne 0 ]; then
  echo ""
  echo "❌ QUICK VALIDATION FAILED!"
  echo "🚫 Commit blocked due to i18n issues"
  echo ""
  echo "💡 To fix:"
  echo "   1. Fix the i18n issues above"
  echo "   2. Run: npm run validate:i18n"
  echo "   3. Try committing again"
  echo ""
  exit 1
fi

echo "✅ Quick validation passed!"
`;

  const preCommitPath = path.join(hooksDir, 'pre-commit');
  fs.writeFileSync(preCommitPath, preCommitHook);
  fs.chmodSync(preCommitPath, '755');

  console.log('✅ Git hooks installed successfully!');
  console.log('\n📋 Hooks created:');
  console.log('   • pre-commit: Quick i18n validation before each commit');
  console.log('   • pre-push: Full validation before pushing to remote');
  console.log('\n🎯 What happens now:');
  console.log('   • Every commit will validate i18n files and components');
  console.log('   • Every push will run full validation including hardcoded strings');
  console.log('   • Failed validation will block the operation');
  console.log('\n💡 To disable hooks temporarily:');
  console.log('   git push --no-verify');
  console.log('   git commit --no-verify');
  console.log('\n🚀 Ready! Your PRs will now be automatically validated!');
}

function removeGitHooks() {
  console.log('🗑️  Removing Git hooks...\n');

  const projectRoot = path.join(__dirname, '../..');
  const hooksDir = path.join(projectRoot, '.git/hooks');

  const hooksToRemove = ['pre-push', 'pre-commit'];

  for (const hook of hooksToRemove) {
    const hookPath = path.join(hooksDir, hook);
    if (fs.existsSync(hookPath)) {
      fs.unlinkSync(hookPath);
      console.log(`✅ Removed ${hook} hook`);
    } else {
      console.log(`⚠️  ${hook} hook not found`);
    }
  }

  console.log('\n🎯 Git hooks removed! Validation will no longer run automatically.');
}

function main() {
  const command = process.argv[2];

  if (command === 'remove') {
    removeGitHooks();
  } else if (command === 'install' || !command) {
    setupGitHooks();
  } else {
    console.log('Usage:');
    console.log('  npm run setup:hooks        # Install hooks');
    console.log('  npm run setup:hooks remove # Remove hooks');
    process.exit(1);
  }
}

// Run setup
main();
