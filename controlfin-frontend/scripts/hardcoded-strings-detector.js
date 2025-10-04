#!/usr/bin/env node

/**
 * Hardcoded Strings Detector
 *
 * Detects hardcoded strings that should be using i18n
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Patterns to detect hardcoded strings
const HARDCODED_PATTERNS = [
  // English text patterns
  /['"`]([A-Z][a-z]+ [A-Z][a-z]+[^'"`]*)['"`]/g,
  /['"`]([A-Z][a-z]+ [a-z]+ [A-Z][a-z]+[^'"`]*)['"`]/g,
  /['"`](Please [a-z]+ [a-z]+[^'"`]*)['"`]/g,
  /['"`](Enter your [a-z]+[^'"`]*)['"`]/g,
  /['"`](Create [a-z]+ [a-z]+[^'"`]*)['"`]/g,
  /['"`](Sign [a-z]+ [a-z]+[^'"`]*)['"`]/g,
  /['"`](Forgot [a-z]+[^'"`]*)['"`]/g,
  /['"`](Reset [a-z]+[^'"`]*)['"`]/g,
  /['"`](Continue with [A-Z][a-z]+[^'"`]*)['"`]/g,
  /['"`](Don't have [a-z]+ [a-z]+[^'"`]*)['"`]/g,
  /['"`](Already have [a-z]+ [a-z]+[^'"`]*)['"`]/g,
  /['"`](I agree to [a-z]+ [a-z]+[^'"`]*)['"`]/g,
  /['"`](Terms of [A-Z][a-z]+[^'"`]*)['"`]/g,
  /['"`](Privacy [A-Z][a-z]+[^'"`]*)['"`]/g,
  /['"`](Password must [a-z]+ [a-z]+[^'"`]*)['"`]/g,
  /['"`](Password [a-z]+ [a-z]+ [a-z]+[^'"`]*)['"`]/g,
  /['"`](Passwords must [a-z]+[^'"`]*)['"`]/g,
  /['"`](Please enter [a-z]+ [a-z]+[^'"`]*)['"`]/g,
  /['"`](Please [a-z]+ [a-z]+ [a-z]+[^'"`]*)['"`]/g,
  /['"`](You must [a-z]+ [a-z]+[^'"`]*)['"`]/g,
  /['"`](Loading\.\.\.)['"`]/g,
  /['"`](Saving\.\.\.)['"`]/g,
  /['"`](Sending\.\.\.)['"`]/g,
  /['"`](Resetting\.\.\.)['"`]/g,
  /['"`](Creating [a-z]+\.\.\.)['"`]/g,
  /['"`](Check your [a-z]+[^'"`]*)['"`]/g,
  /['"`](We've sent [a-z]+ [a-z]+[^'"`]*)['"`]/g,
  /['"`](Your [a-z]+ has been [a-z]+[^'"`]*)['"`]/g,
  /['"`](Failed to [a-z]+ [a-z]+[^'"`]*)['"`]/g,
  /['"`](Invalid or [a-z]+ [a-z]+[^'"`]*)['"`]/g,
];

// Exclude patterns (strings that are OK to be hardcoded)
const EXCLUDE_PATTERNS = [
  /^[a-z]+$/i, // Single words
  /^[A-Z]+$/i, // Single uppercase words
  /^[0-9]+$/, // Numbers
  /^[^a-zA-Z]*$/, // Non-alphabetic
  /^[a-z]+@[a-z]+\.[a-z]+$/i, // Email patterns
  /^https?:\/\//, // URLs
  /^[a-z]+-[a-z]+$/i, // Kebab-case
  /^[a-z]+_[a-z]+$/i, // Snake-case
  /^[A-Z][a-z]+[A-Z][a-z]+$/, // CamelCase
  /^[a-z]+\(\)$/, // Function calls
  /^[a-z]+\.[a-z]+$/, // Object properties
  /^[a-z]+:[a-z]+$/, // CSS properties
  /^#[0-9a-fA-F]{3,6}$/, // Hex colors
  /^[0-9]+px$/, // CSS values
  /^[0-9]+%$/, // CSS percentages
  /^[0-9]+rem$/, // CSS rem values
  /^[0-9]+em$/, // CSS em values
  /^[0-9]+vh$/, // CSS viewport height
  /^[0-9]+vw$/, // CSS viewport width
];

// Context patterns to exclude (inside specific contexts)
const CONTEXT_EXCLUDE_PATTERNS = [
  /console\.log\(/, // Console logs
  /console\.error\(/, // Console errors
  /console\.warn\(/, // Console warnings
  /\/\/.*/, // Comments
  /\/\*[\s\S]*?\*\//, // Block comments
  /import.*from/, // Import statements
  /export.*from/, // Export statements
  /require\(/, // Require statements
  /\.test\./, // Test files
  /\.spec\./, // Spec files
  /\.stories\./, // Storybook files
  /\.config\./, // Config files
  /\.d\.ts$/, // TypeScript declaration files
  /Internal error reporting/, // Internal error reporting strings
  /mailto:/, // Email links
  /Error Code:/, // Error reporting labels
  /Error Message:/, // Error reporting labels
  /kept in English for support team/, // Support team strings
  /const errorCodeLabel/, // Error code label variable
  /const errorMessageLabel/, // Error message label variable
  /handleContactSupport/, // Contact support method
];

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

function isExcludedString(str) {
  return EXCLUDE_PATTERNS.some((pattern) => pattern.test(str));
}

function isInExcludedContext(line, index, content) {
  const beforeContext = content.substring(Math.max(0, index - 200), index);
  const afterContext = content.substring(index, Math.min(content.length, index + 200));
  const fullContext = beforeContext + afterContext;

  return CONTEXT_EXCLUDE_PATTERNS.some((pattern) => pattern.test(fullContext));
}

function detectHardcodedStrings(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const issues = [];

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];
    const lineNumber = lineIndex + 1;

    // Skip empty lines and comments
    if (line.trim() === '' || line.trim().startsWith('//')) {
      continue;
    }

    // Check each pattern
    for (const pattern of HARDCODED_PATTERNS) {
      let match;
      while ((match = pattern.exec(line)) !== null) {
        const str = match[1] || match[0].slice(1, -1); // Remove quotes

        // Skip if it's an excluded string
        if (isExcludedString(str)) {
          continue;
        }

        // Skip if it's in excluded context
        if (isInExcludedContext(line, match.index, content)) {
          continue;
        }

        // Skip if it's already using t() function
        if (line.includes('t(') && line.includes(str)) {
          continue;
        }

        // Skip if it's a CSS class name or ID
        if (str.includes('-') && str.length < 20) {
          continue;
        }

        // Skip if it's a variable name
        if (/^[a-z]+[A-Z]/.test(str)) {
          continue;
        }

        issues.push({
          file: path.basename(filePath),
          line: lineNumber,
          column: match.index + 1,
          text: str,
          fullLine: line.trim(),
          severity: str.length > 20 ? 'high' : 'medium',
        });
      }
    }
  }

  return issues;
}

function scanForHardcodedStrings() {
  console.log('🔍 Scanning for hardcoded strings...\n');

  const componentsDir = path.join(__dirname, '../src/components');
  const componentFiles = findFiles(componentsDir, '.tsx');

  let totalIssues = 0;
  const issuesByFile = {};

  for (const file of componentFiles) {
    const issues = detectHardcodedStrings(file);
    if (issues.length > 0) {
      issuesByFile[file] = issues;
      totalIssues += issues.length;
    }
  }

  if (totalIssues === 0) {
    console.log('✅ No hardcoded strings detected!');
    return { success: true, issues: 0 };
  }

  console.log(`❌ Found ${totalIssues} potential hardcoded strings:\n`);

  // Group by severity
  const highSeverity = [];
  const mediumSeverity = [];

  for (const [file, issues] of Object.entries(issuesByFile)) {
    for (const issue of issues) {
      if (issue.severity === 'high') {
        highSeverity.push({ ...issue, file });
      } else {
        mediumSeverity.push({ ...issue, file });
      }
    }
  }

  // Show high severity issues first
  if (highSeverity.length > 0) {
    console.log('🔴 HIGH SEVERITY ISSUES:');
    highSeverity.slice(0, 10).forEach((issue) => {
      console.log(`   ${issue.file}:${issue.line}:${issue.column}`);
      console.log(`   "${issue.text}"`);
      console.log(`   ${issue.fullLine}\n`);
    });

    if (highSeverity.length > 10) {
      console.log(`   ... and ${highSeverity.length - 10} more high severity issues\n`);
    }
  }

  // Show medium severity issues
  if (mediumSeverity.length > 0) {
    console.log('🟡 MEDIUM SEVERITY ISSUES:');
    mediumSeverity.slice(0, 5).forEach((issue) => {
      console.log(`   ${issue.file}:${issue.line}:${issue.column}`);
      console.log(`   "${issue.text}"`);
    });

    if (mediumSeverity.length > 5) {
      console.log(`   ... and ${mediumSeverity.length - 5} more medium severity issues\n`);
    }
  }

  console.log('💡 RECOMMENDATIONS:');
  console.log('   • Replace hardcoded strings with t("key") calls');
  console.log('   • Add corresponding keys to translation files');
  console.log('   • Use descriptive key names (e.g., "auth.login.title")');
  console.log('   • Consider context for better translations\n');

  return {
    success: highSeverity.length === 0,
    issues: totalIssues,
    highSeverity: highSeverity.length,
    mediumSeverity: mediumSeverity.length,
  };
}

// Run detection
if (import.meta.url === `file://${process.argv[1]}`) {
  const result = scanForHardcodedStrings();
  process.exit(result.success ? 0 : 1);
}

export { scanForHardcodedStrings };
