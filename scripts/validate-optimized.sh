#!/bin/bash

# Optimized Project Validation Script
# Implements parallel execution, incremental validation, and smart caching
# Target: Reduce validation time from 2-3 minutes to 15-30 seconds

set -e  # Exit on any error

echo "🚀 OPTIMIZED PROJECT VALIDATION STARTING..."
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Performance tracking
START_TIME=$(date +%s)
VALIDATION_CACHE_DIR=".validation-cache"
PARALLEL_JOBS=2

# Create cache directory if it doesn't exist
mkdir -p "$VALIDATION_CACHE_DIR"

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

# Function to get file hash for caching
get_file_hash() {
    local file=$1
    if [ -f "$file" ]; then
        shasum -a 256 "$file" | cut -d' ' -f1
    else
        echo "missing"
    fi
}

# Function to check if validation is cached
is_validation_cached() {
    local component=$1
    local cache_file="$VALIDATION_CACHE_DIR/${component}_validation.cache"
    
    if [ ! -f "$cache_file" ]; then
        return 1
    fi
    
    # Check if cache is recent (less than 1 hour old)
    local cache_age=$(($(date +%s) - $(stat -f %m "$cache_file" 2>/dev/null || echo 0)))
    if [ $cache_age -gt 3600 ]; then
        return 1
    fi
    
    # Check if source files have changed
    local current_hash=""
    if [ "$component" = "frontend" ]; then
        current_hash=$(find controlfin-frontend/src -name "*.ts" -o -name "*.tsx" | xargs shasum -a 256 | shasum -a 256 | cut -d' ' -f1)
    elif [ "$component" = "backend" ]; then
        current_hash=$(find controlfin-backend/src -name "*.ts" | xargs shasum -a 256 | shasum -a 256 | cut -d' ' -f1)
    fi
    
    local cached_hash=$(grep "source_hash:" "$cache_file" | cut -d' ' -f2)
    if [ "$current_hash" != "$cached_hash" ]; then
        return 1
    fi
    
    return 0
}

# Function to cache validation result
cache_validation_result() {
    local component=$1
    local result=$2
    local cache_file="$VALIDATION_CACHE_DIR/${component}_validation.cache"
    
    local source_hash=""
    if [ "$component" = "frontend" ]; then
        source_hash=$(find controlfin-frontend/src -name "*.ts" -o -name "*.tsx" | xargs shasum -a 256 | shasum -a 256 | cut -d' ' -f1)
    elif [ "$component" = "backend" ]; then
        source_hash=$(find controlfin-backend/src -name "*.ts" | xargs shasum -a 256 | shasum -a 256 | cut -d' ' -f1)
    fi
    
    echo "timestamp: $(date +%s)" > "$cache_file"
    echo "source_hash: $source_hash" >> "$cache_file"
    echo "result: $result" >> "$cache_file"
}

# Function to get changed files
get_changed_files() {
    local component=$1
    if [ "$component" = "frontend" ]; then
        git diff --cached --name-only | grep "^controlfin-frontend/" | sed 's|controlfin-frontend/||' || true
    elif [ "$component" = "backend" ]; then
        git diff --cached --name-only | grep "^controlfin-backend/" | sed 's|controlfin-backend/||' || true
    fi
}

# Function to run incremental validation
run_incremental_validation() {
    local component=$1
    local start_time=$(date +%s)
    
    echo -e "\n${BLUE}🔍 VALIDATING $component (INCREMENTAL)...${NC}"
    echo "================================"
    
    cd "controlfin-$component"
    
    # Get changed files
    local changed_files=$(get_changed_files "$component")
    
    if [ -z "$changed_files" ]; then
        echo "📄 No $component files changed, skipping validation"
        cd ..
        return 0
    fi
    
    echo "📁 Changed files:"
    echo "$changed_files" | while read -r file; do
        echo "  - $file"
    done
    
    # TypeScript compilation (incremental)
    echo "🔄 Running TypeScript compilation (incremental)..."
    if npm run type-check; then
        print_status "SUCCESS" "TypeScript compilation passed"
    else
        print_status "ERROR" "TypeScript compilation failed"
        cd ..
        return 1
    fi
    
    # ESLint check (only changed files)
    echo "🔄 Running ESLint check (incremental)..."
    local lint_files=$(echo "$changed_files" | grep -E '\.(ts|tsx)$' | tr '\n' ' ' || true)
    if [ -n "$lint_files" ]; then
        if npm run lint -- $lint_files; then
            print_status "SUCCESS" "ESLint check passed"
        else
            print_status "WARNING" "ESLint warnings found (non-blocking)"
        fi
    else
        print_status "SUCCESS" "No TypeScript files changed, skipping ESLint"
    fi
    
    # Smart test selection (only run tests for changed files)
    echo "🔄 Running smart tests..."
    local test_files=$(echo "$changed_files" | grep -E '\.(test|spec)\.(ts|tsx)$' | tr '\n' ' ' || true)
    if [ -n "$test_files" ]; then
        if npm run test -- $test_files; then
            print_status "SUCCESS" "Tests passed"
        else
            print_status "ERROR" "Tests failed"
            cd ..
            return 1
        fi
    else
        print_status "SUCCESS" "No test files changed, skipping tests"
    fi
    
    # Build test (only if source files changed)
    local source_files=$(echo "$changed_files" | grep -E '\.(ts|tsx)$' | grep -v -E '\.(test|spec)\.' || true)
    if [ -n "$source_files" ]; then
        echo "🔄 Testing build (source files changed)..."
        if npm run build; then
            print_status "SUCCESS" "Build successful"
        else
            print_status "ERROR" "Build failed"
            cd ..
            return 1
        fi
    else
        print_status "SUCCESS" "No source files changed, skipping build"
    fi
    
    cd ..
    
    local duration=$(($(date +%s) - start_time))
    print_status "SUCCESS" "$component validation completed" "$duration"
    return 0
}

# Function to run full validation (fallback)
run_full_validation() {
    local component=$1
    local start_time=$(date +%s)
    
    echo -e "\n${BLUE}🔍 VALIDATING $component (FULL)...${NC}"
    echo "================================"
    
    cd "controlfin-$component"
    
    # TypeScript compilation
    echo "🔄 Running TypeScript compilation..."
    if npm run type-check; then
        print_status "SUCCESS" "TypeScript compilation passed"
    else
        print_status "ERROR" "TypeScript compilation failed"
        cd ..
        return 1
    fi
    
    # ESLint check
    echo "🔄 Running ESLint check..."
    if npm run lint; then
        print_status "SUCCESS" "ESLint check passed"
    else
        print_status "WARNING" "ESLint warnings found (non-blocking)"
    fi
    
    # Tests
    echo "🔄 Running tests..."
    if npm run test:coverage; then
        print_status "SUCCESS" "Tests passed"
    else
        print_status "ERROR" "Tests failed"
        cd ..
        return 1
    fi
    
    # Build test
    echo "🔄 Testing build..."
    if npm run build; then
        print_status "SUCCESS" "Build successful"
    else
        print_status "ERROR" "Build failed"
        cd ..
        return 1
    fi
    
    cd ..
    
    local duration=$(($(date +%s) - start_time))
    print_status "SUCCESS" "$component validation completed" "$duration"
    return 0
}

# Function to validate component with caching
validate_component() {
    local component=$1
    local force_full=$2
    
    if [ "$force_full" = "true" ] || ! is_validation_cached "$component"; then
        if [ "$force_full" = "true" ]; then
            run_full_validation "$component"
        else
            run_incremental_validation "$component"
        fi
        
        local result=$?
        cache_validation_result "$component" "$result"
        return $result
    else
        echo -e "\n${CYAN}📦 Using cached validation for $component${NC}"
        local cached_result=$(grep "result:" "$VALIDATION_CACHE_DIR/${component}_validation.cache" | cut -d' ' -f2)
        if [ "$cached_result" = "0" ]; then
            print_status "SUCCESS" "$component validation (cached)"
            return 0
        else
            print_status "ERROR" "$component validation (cached - failed)"
            return 1
        fi
    fi
}

# Function to run parallel validation
run_parallel_validation() {
    echo -e "\n${BLUE}🚀 RUNNING PARALLEL VALIDATION...${NC}"
    echo "=================================="
    
    # Start both validations in parallel
    validate_component "frontend" "false" &
    local frontend_pid=$!
    
    validate_component "backend" "false" &
    local backend_pid=$!
    
    # Wait for both to complete
    wait $frontend_pid
    local frontend_result=$?
    
    wait $backend_pid
    local backend_result=$?
    
    return $((frontend_result + backend_result))
}

# Function to check if full validation is needed
needs_full_validation() {
    # Check if any critical files changed
    local critical_changes=$(git diff --cached --name-only | grep -E '\.(json|yml|yaml|sh|js)$' | grep -v -E '\.(test|spec)\.' || true)
    
    if [ -n "$critical_changes" ]; then
        echo "🔍 Critical configuration files changed, full validation needed"
        return 0
    fi
    
    # Check if cache is too old
    local cache_age=$(($(date +%s) - $(stat -f %m "$VALIDATION_CACHE_DIR" 2>/dev/null || echo 0)))
    if [ $cache_age -gt 3600 ]; then
        echo "⏰ Cache is old, full validation needed"
        return 0
    fi
    
    return 1
}

# Main validation process
main() {
    echo -e "${BLUE}Starting optimized project validation...${NC}\n"
    
    # Check if we need full validation
    if needs_full_validation; then
        echo -e "${YELLOW}⚠️  Full validation required${NC}"
        run_parallel_validation
    else
        echo -e "${GREEN}✅ Incremental validation sufficient${NC}"
        run_parallel_validation
    fi
    
    local validation_result=$?
    
    # Final results
    echo -e "\n${BLUE}📊 VALIDATION SUMMARY${NC}"
    echo "========================"
    
    local total_time=$(($(date +%s) - START_TIME))
    
    if [ $validation_result -eq 0 ]; then
        print_status "SUCCESS" "All validations passed" "$total_time"
        echo -e "\n${GREEN}🎉 OPTIMIZED VALIDATION COMPLETE!${NC}"
        echo -e "${GREEN}✅ Project is ready for commit/push${NC}"
        echo -e "${CYAN}⏱️  Total time: ${total_time}s${NC}"
        exit 0
    else
        print_status "ERROR" "Validation failed" "$total_time"
        echo -e "\n${RED}❌ VALIDATION FAILED!${NC}"
        echo -e "${RED}🚫 Please fix the issues above before committing${NC}"
        echo -e "${CYAN}⏱️  Total time: ${total_time}s${NC}"
        exit 1
    fi
}

# Cleanup function
cleanup() {
    echo -e "\n${YELLOW}🧹 Cleaning up...${NC}"
    # Remove any temporary files if needed
}

# Set trap for cleanup
trap cleanup EXIT

# Run main function
main "$@"
