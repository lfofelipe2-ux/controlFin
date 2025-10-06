#!/bin/bash

# Pre-PR Validation Script
# This script runs all validations before creating a Pull Request

set -e

echo "🚀 Running Pre-PR Validation..."
echo "================================"

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -d "controlfin-backend" ] && [ ! -d "controlfin-frontend" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Run the validation script
node scripts/validate-before-pr.js

echo ""
echo "✅ Pre-PR validation completed successfully!"
echo "You can now create your Pull Request."
