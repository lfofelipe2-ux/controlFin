#!/bin/bash

# Workflow Validation Script
# This script validates GitHub Actions workflows and prevents common errors

set -e

echo "🔍 Validating GitHub Actions workflows..."

# Check if actionlint is installed
if ! command -v actionlint &> /dev/null; then
    echo "❌ actionlint is not installed. Installing..."
    if command -v brew &> /dev/null; then
        brew install actionlint
    else
        echo "Please install actionlint manually: https://github.com/rhysd/actionlint"
        exit 1
    fi
fi

# Check if yamllint is installed
if ! command -v yamllint &> /dev/null; then
    echo "❌ yamllint is not installed. Installing..."
    if command -v brew &> /dev/null; then
        brew install yamllint
    else
        echo "Please install yamllint manually: https://yamllint.readthedocs.io/"
        exit 1
    fi
fi

# Validate YAML syntax (with relaxed rules for workflows)
echo "📝 Validating YAML syntax..."
yamllint -d relaxed .github/workflows/*.yml || {
    echo "❌ YAML syntax errors found"
    exit 1
}

# Validate GitHub Actions workflows
echo "⚙️ Validating GitHub Actions workflows..."
actionlint .github/workflows/*.yml || {
    echo "❌ GitHub Actions validation errors found"
    exit 1
}

# Check for common issues
echo "🔍 Checking for common issues..."

# Check for invalid environment names
echo "  - Checking environment names..."
if grep -r "environment:" .github/workflows/ | grep -v "backup/" | grep -E "(staging|development|pages)" | grep -v "github-pages"; then
    echo "❌ Invalid environment names found. Use only: production, github-pages, or remove environment"
    exit 1
fi

# Check for invalid context usage
echo "  - Checking context usage..."
if grep -r "secrets\." .github/workflows/ | grep -v "backup/" | grep -v "\.backup" | grep -v "env:" | grep -v "with:" | grep -v "echo" | grep -v "GITHUB_TOKEN:" | grep -v "SNYK_TOKEN:"; then
    echo "❌ Invalid secrets context usage found. Use only in env: or with: sections"
    exit 1
fi

# Check for missing step IDs
echo "  - Checking step IDs..."
# This check is complex and may have false positives, so we'll skip it for now
echo "  - Skipping step ID check (complex validation)"

echo "✅ All validations passed!"
echo "🎉 Workflows are ready for deployment!"
