#!/bin/bash

# Ultra-fast validation for documentation-only changes
# Target: < 5 seconds execution time
# Only runs essential checks, skips all code validation

echo "⚡ ULTRA-FAST DOCS VALIDATION STARTING..."
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Performance tracking
START_TIME=$(date +%s)

# Function to print status with timing
print_status() {
    local status=$1
    local message=$2
    local duration=$3
    if [ "$status" = "SUCCESS" ]; then
        echo -e "${GREEN}✅ $message${NC}${duration:+ (${duration}s)}"
    elif [ "$status" = "WARNING" ]; then
        echo -e "${YELLOW}⚠️  $message${NC}${duration:+ (${duration}s)}"
    else
        echo -e "${RED}❌ $message${NC}${duration:+ (${duration}s)}"
    fi
}

# Function to check git status
check_git_status() {
    local start_time=$(date +%s)
    
    echo "🔍 Checking git status..."
    
    # Check if there are changes to commit
    if [ -z "$(git status --porcelain)" ]; then
        print_status "WARNING" "No changes to commit"
        return 1
    fi
    
    # Check if we're on a valid branch
    local branch=$(git branch --show-current)
    if [ "$branch" = "main" ] || [ "$branch" = "master" ]; then
        print_status "ERROR" "Cannot commit to main/master branch"
        return 1
    fi
    
    local duration=$(($(date +%s) - start_time))
    print_status "SUCCESS" "Git status OK (branch: $branch)" "$duration"
    return 0
}

# Function to check file sizes
check_file_sizes() {
    local start_time=$(date +%s)
    
    echo "📏 Checking file sizes..."
    
    # Check for large files (>10MB)
    local large_files=$(find . -type f -size +10M -not -path "./node_modules/*" -not -path "./.git/*" -not -path "./dist/*" 2>/dev/null || true)
    if [ -n "$large_files" ]; then
        print_status "WARNING" "Large files detected:"
        echo "$large_files" | while read -r file; do
            echo "  - $file"
        done
    fi
    
    local duration=$(($(date +%s) - start_time))
    print_status "SUCCESS" "File size check completed" "$duration"
    return 0
}

# Function to check YAML syntax (only for changed files)
check_yaml_syntax() {
    local start_time=$(date +%s)
    
    echo "🔍 Checking YAML syntax for changed files..."
    
    # Get changed YAML files
    local yaml_files=$(git diff --cached --name-only | grep -E '\.(yml|yaml)$' || true)
    
    if [ -z "$yaml_files" ]; then
        local duration=$(($(date +%s) - start_time))
        print_status "SUCCESS" "No YAML files changed" "$duration"
        return 0
    fi
    
    # Check each YAML file
    local yaml_errors=0
    echo "$yaml_files" | while read -r file; do
        if [ -f "$file" ]; then
            # Basic YAML syntax check using Python
            if python3 -c "import yaml; yaml.safe_load(open('$file'))" 2>/dev/null; then
                echo "  ✅ $file"
            else
                echo "  ❌ $file (YAML syntax error)"
                yaml_errors=$((yaml_errors + 1))
            fi
        fi
    done
    
    local duration=$(($(date +%s) - start_time))
    if [ $yaml_errors -eq 0 ]; then
        print_status "SUCCESS" "YAML syntax check passed" "$duration"
    else
        print_status "ERROR" "YAML syntax errors found" "$duration"
        return 1
    fi
    
    return 0
}

# Function to check JSON syntax (only for changed files)
check_json_syntax() {
    local start_time=$(date +%s)
    
    echo "🔍 Checking JSON syntax for changed files..."
    
    # Get changed JSON files
    local json_files=$(git diff --cached --name-only | grep -E '\.json$' || true)
    
    if [ -z "$json_files" ]; then
        local duration=$(($(date +%s) - start_time))
        print_status "SUCCESS" "No JSON files changed" "$duration"
        return 0
    fi
    
    # Check each JSON file
    local json_errors=0
    echo "$json_files" | while read -r file; do
        if [ -f "$file" ]; then
            # Basic JSON syntax check using Python
            if python3 -c "import json; json.load(open('$file'))" 2>/dev/null; then
                echo "  ✅ $file"
            else
                echo "  ❌ $file (JSON syntax error)"
                json_errors=$((json_errors + 1))
            fi
        fi
    done
    
    local duration=$(($(date +%s) - start_time))
    if [ $json_errors -eq 0 ]; then
        print_status "SUCCESS" "JSON syntax check passed" "$duration"
    else
        print_status "ERROR" "JSON syntax errors found" "$duration"
        return 1
    fi
    
    return 0
}

# Function to check markdown syntax (only for changed files)
check_markdown_syntax() {
    local start_time=$(date +%s)
    
    echo "🔍 Checking Markdown syntax for changed files..."
    
    # Get changed Markdown files
    local md_files=$(git diff --cached --name-only | grep -E '\.md$' || true)
    
    if [ -z "$md_files" ]; then
        local duration=$(($(date +%s) - start_time))
        print_status "SUCCESS" "No Markdown files changed" "$duration"
        return 0
    fi
    
    # Basic markdown check (just verify it's readable)
    local md_errors=0
    echo "$md_files" | while read -r file; do
        if [ -f "$file" ]; then
            # Check if file is readable and not empty
            if [ -s "$file" ] && [ -r "$file" ]; then
                echo "  ✅ $file"
            else
                echo "  ❌ $file (empty or unreadable)"
                md_errors=$((md_errors + 1))
            fi
        fi
    done
    
    local duration=$(($(date +%s) - start_time))
    if [ $md_errors -eq 0 ]; then
        print_status "SUCCESS" "Markdown syntax check passed" "$duration"
    else
        print_status "ERROR" "Markdown syntax errors found" "$duration"
        return 1
    fi
    
    return 0
}

# Function to check for sensitive information
check_sensitive_info() {
    local start_time=$(date +%s)
    
    echo "🔍 Checking for sensitive information..."
    
    # Get all changed files
    local changed_files=$(git diff --cached --name-only || true)
    
    if [ -z "$changed_files" ]; then
        local duration=$(($(date +%s) - start_time))
        print_status "SUCCESS" "No files changed" "$duration"
        return 0
    fi
    
    # Check for common sensitive patterns
    local sensitive_patterns=(
        "password"
        "secret"
        "api_key"
        "private_key"
        "token"
        "credential"
    )
    
    local sensitive_found=0
    echo "$changed_files" | while read -r file; do
        if [ -f "$file" ]; then
            for pattern in "${sensitive_patterns[@]}"; do
                if grep -qi "$pattern" "$file" 2>/dev/null; then
                    echo "  ⚠️  Potential sensitive info in $file (pattern: $pattern)"
                    sensitive_found=$((sensitive_found + 1))
                fi
            done
        fi
    done
    
    local duration=$(($(date +%s) - start_time))
    if [ $sensitive_found -eq 0 ]; then
        print_status "SUCCESS" "No sensitive information detected" "$duration"
    else
        print_status "WARNING" "Potential sensitive information detected" "$duration"
    fi
    
    return 0
}

# Main validation process
main() {
    echo -e "${BLUE}Starting ultra-fast docs validation...${NC}\n"
    
    local total_errors=0
    
    # Run all checks
    check_git_status || total_errors=$((total_errors + 1))
    check_file_sizes || total_errors=$((total_errors + 1))
    check_yaml_syntax || total_errors=$((total_errors + 1))
    check_json_syntax || total_errors=$((total_errors + 1))
    check_markdown_syntax || total_errors=$((total_errors + 1))
    check_sensitive_info || total_errors=$((total_errors + 1))
    
    # Final results
    echo -e "\n${BLUE}📊 VALIDATION SUMMARY${NC}"
    echo "========================"
    
    local total_time=$(($(date +%s) - START_TIME))
    
    if [ $total_errors -eq 0 ]; then
        print_status "SUCCESS" "All docs validations passed" "$total_time"
        echo -e "\n${GREEN}🎉 ULTRA-FAST DOCS VALIDATION COMPLETE!${NC}"
        echo -e "${GREEN}✅ Documentation changes are ready for commit${NC}"
        echo -e "${CYAN}⏱️  Total time: ${total_time}s${NC}"
        echo -e "${CYAN}🚀 Performance: Ultra-fast mode (< 5s target)${NC}"
        exit 0
    else
        print_status "ERROR" "Docs validation failed" "$total_time"
        echo -e "\n${RED}❌ DOCS VALIDATION FAILED!${NC}"
        echo -e "${RED}🚫 Please fix the issues above before committing${NC}"
        echo -e "${CYAN}⏱️  Total time: ${total_time}s${NC}"
        exit 1
    fi
}

# Run main function
main "$@"
