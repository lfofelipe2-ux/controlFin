#!/bin/bash

# Fix Long Lines Script
# This script fixes long lines in YAML files by breaking them appropriately

set -e

echo "🔧 Fixing long lines in workflow files..."

# Function to break long lines
break_long_line() {
    local line="$1"
    local max_length=80
    
    if [ ${#line} -le $max_length ]; then
        echo "$line"
        return
    fi
    
    # Check if it's a YAML key-value pair
    if [[ "$line" =~ ^[[:space:]]*[a-zA-Z_-]+:[[:space:]]*.*$ ]]; then
        # Extract indentation
        local indent=$(echo "$line" | sed 's/^\([[:space:]]*\).*/\1/')
        local key=$(echo "$line" | sed 's/^[[:space:]]*\([a-zA-Z_-]*\):.*/\1/')
        local value=$(echo "$line" | sed 's/^[[:space:]]*[a-zA-Z_-]*:[[:space:]]*//')
        
        # If value is too long, break it
        if [ ${#value} -gt $((max_length - ${#indent} - ${#key} - 2)) ]; then
            echo "${indent}${key}: >"
            echo "${indent}  ${value}"
        else
            echo "$line"
        fi
    else
        # For other lines, just break at word boundaries
        local words=($line)
        local current_line=""
        
        for word in "${words[@]}"; do
            if [ $((${#current_line} + ${#word} + 1)) -le $max_length ]; then
                if [ -z "$current_line" ]; then
                    current_line="$word"
                else
                    current_line="$current_line $word"
                fi
            else
                echo "$current_line"
                current_line="$word"
            fi
        done
        
        if [ -n "$current_line" ]; then
            echo "$current_line"
        fi
    fi
}

# Process each workflow file
for file in .github/workflows/*.yml; do
    if [ -f "$file" ]; then
        echo "📝 Processing $file..."
        
        # Create a backup
        cp "$file" "$file.backup"
        
        # Process the file line by line
        {
            while IFS= read -r line; do
                break_long_line "$line"
            done < "$file"
        } > "$file.tmp"
        
        # Replace original with fixed version
        mv "$file.tmp" "$file"
        
        echo "✅ Fixed $file"
    fi
done

echo "🎉 Long lines fixes completed!"
