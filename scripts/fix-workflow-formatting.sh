#!/bin/bash

# Fix Workflow Formatting Script
# This script fixes common YAML formatting issues in GitHub Actions workflows

set -e

echo "🔧 Fixing workflow formatting issues..."

# Create a temporary directory for processing
TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

# Process each workflow file
for file in .github/workflows/*.yml; do
    if [ -f "$file" ]; then
        echo "📝 Processing $file..."
        
        # Create a backup
        cp "$file" "$file.backup"
        
        # Fix common issues
        cat "$file" | \
        # Add document start if missing
        sed '1s/^/---\n/' | \
        # Fix truthy values
        sed 's/^\([[:space:]]*\)branches: \[\]$/\1branches: []/' | \
        sed 's/^\([[:space:]]*\)branches: \[.*\]$/\1branches: [\2]/' | \
        # Fix comment spacing
        sed 's/^\([[:space:]]*\)#\([^[:space:]]\)/\1  # \2/' | \
        # Remove trailing spaces
        sed 's/[[:space:]]*$//' | \
        # Fix long lines by breaking them appropriately
        awk '
        {
            if (length($0) > 80 && /^[[:space:]]*-[[:space:]]*name:/) {
                # Break long step names
                gsub(/(.{75})/, "\\1\n    # ...")
            } else if (length($0) > 80 && /^[[:space:]]*uses:/) {
                # Break long action references
                gsub(/(.{75})/, "\\1\n    # ...")
            } else if (length($0) > 80 && /^[[:space:]]*with:/) {
                # Break long with sections
                gsub(/(.{75})/, "\\1\n    # ...")
            } else if (length($0) > 80 && /^[[:space:]]*run:/) {
                # Break long run commands
                gsub(/(.{75})/, "\\1\n    # ...")
            } else {
                print $0
            }
        }' > "$TEMP_DIR/$(basename "$file")"
        
        # Replace original with fixed version
        mv "$TEMP_DIR/$(basename "$file")" "$file"
        
        echo "✅ Fixed $file"
    fi
done

echo "🎉 Workflow formatting fixes completed!"
echo "💡 Run './scripts/validate-workflows.sh' to verify fixes"
