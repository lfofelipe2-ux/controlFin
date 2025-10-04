#!/bin/bash

# Fix YAML Issues Script
# This script fixes specific YAML formatting issues

set -e

echo "🔧 Fixing YAML issues..."

# Fix each workflow file
for file in .github/workflows/*.yml; do
    if [ -f "$file" ]; then
        echo "📝 Processing $file..."
        
        # Create a backup
        cp "$file" "$file.backup"
        
        # Fix the file
        cat "$file" | \
        # Add document start if missing (but not if it already has one)
        awk 'NR==1 && !/^---/ { print "---" } { print }' | \
        # Fix truthy values - convert empty arrays to proper format
        sed 's/^\([[:space:]]*\)branches: \[\]$/\1branches: []/' | \
        # Fix comment spacing - add proper spacing before comments
        sed 's/^\([[:space:]]*\)#\([^[:space:]]\)/\1  # \2/' | \
        # Remove trailing spaces
        sed 's/[[:space:]]*$//' > "$file.tmp"
        
        # Replace original with fixed version
        mv "$file.tmp" "$file"
        
        echo "✅ Fixed $file"
    fi
done

echo "🎉 YAML fixes completed!"
