#!/bin/bash

# Update Action Versions Script
# This script updates GitHub Actions to their latest versions

set -e

echo "🔄 Updating GitHub Actions versions..."

# Function to update action versions
update_actions() {
    local file="$1"
    echo "📝 Updating $file..."
    
    # Create backup
    cp "$file" "$file.backup"
    
    # Update specific actions to latest versions
    sed -i '' \
        -e 's/actions\/github-script@v6/actions\/github-script@v7/g' \
        -e 's/actions\/upload-artifact@v3/actions\/upload-artifact@v4/g' \
        -e 's/actions\/download-artifact@v3/actions\/download-artifact@v4/g' \
        -e 's/actions\/configure-pages@v3/actions\/configure-pages@v4/g' \
        -e 's/actions\/deploy-pages@v2/actions\/deploy-pages@v3/g' \
        -e 's/codecov\/codecov-action@v3/codecov\/codecov-action@v4/g' \
        -e 's/github\/codeql-action\/init@v2/github\/codeql-action\/init@v3/g' \
        -e 's/github\/codeql-action\/analyze@v2/github\/codeql-action\/analyze@v3/g' \
        -e 's/actions\/dependency-review-action@v3/actions\/dependency-review-action@v4/g' \
        "$file"
    
    echo "✅ Updated $file"
}

# Update all workflow files
for file in .github/workflows/*.yml; do
    if [ -f "$file" ]; then
        update_actions "$file"
    fi
done

echo "🎉 Action versions updated!"
echo "💡 Run './scripts/validate-workflows.sh' to verify updates"
