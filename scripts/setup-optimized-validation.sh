#!/bin/bash

# Setup script for optimized validation system
# Migrates from legacy validation to optimized validation

echo "🚀 SETTING UP OPTIMIZED VALIDATION SYSTEM"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    local status=$1
    local message=$2
    if [ "$status" = "SUCCESS" ]; then
        echo -e "${GREEN}✅ $message${NC}"
    elif [ "$status" = "WARNING" ]; then
        echo -e "${YELLOW}⚠️  $message${NC}"
    else
        echo -e "${RED}❌ $message${NC}"
    fi
}

# Function to backup existing files
backup_file() {
    local file=$1
    if [ -f "$file" ]; then
        local backup="${file}.backup.$(date +%Y%m%d_%H%M%S)"
        cp "$file" "$backup"
        print_status "SUCCESS" "Backed up $file to $backup"
    fi
}

# Function to check if script exists and is executable
check_script() {
    local script=$1
    if [ -f "$script" ] && [ -x "$script" ]; then
        print_status "SUCCESS" "Script exists and is executable: $script"
        return 0
    else
        print_status "ERROR" "Script missing or not executable: $script"
        return 1
    fi
}

# Function to install dependencies
install_dependencies() {
    echo -e "\n${BLUE}📦 Installing dependencies...${NC}"
    
    # Check if Node.js is available
    if ! command -v node >/dev/null 2>&1; then
        print_status "ERROR" "Node.js not found. Please install Node.js first."
        return 1
    fi
    
    # Check if Python is available (for YAML/JSON validation)
    if ! command -v python3 >/dev/null 2>&1; then
        print_status "WARNING" "Python3 not found. YAML/JSON validation will be skipped."
    fi
    
    # Check if bc is available (for timing calculations)
    if ! command -v bc >/dev/null 2>&1; then
        print_status "WARNING" "bc not found. Install with: brew install bc (macOS) or sudo apt-get install bc (Linux)"
    fi
    
    print_status "SUCCESS" "Dependencies checked"
    return 0
}

# Function to setup cache directory
setup_cache() {
    echo -e "\n${BLUE}📁 Setting up cache directory...${NC}"
    
    local cache_dir=".validation-cache"
    mkdir -p "$cache_dir"
    
    # Add cache directory to .gitignore if not already present
    if [ -f ".gitignore" ]; then
        if ! grep -q "^$cache_dir" .gitignore; then
            echo "" >> .gitignore
            echo "# Validation cache" >> .gitignore
            echo "$cache_dir/" >> .gitignore
            print_status "SUCCESS" "Added cache directory to .gitignore"
        else
            print_status "SUCCESS" "Cache directory already in .gitignore"
        fi
    else
        echo "$cache_dir/" > .gitignore
        print_status "SUCCESS" "Created .gitignore with cache directory"
    fi
    
    print_status "SUCCESS" "Cache directory setup complete"
}

# Function to setup git hooks
setup_git_hooks() {
    echo -e "\n${BLUE}🔗 Setting up git hooks...${NC}"
    
    # Backup existing hooks
    backup_file ".git/hooks/pre-commit"
    backup_file ".git/hooks/pre-push"
    
    # Check if git hooks directory exists
    if [ ! -d ".git/hooks" ]; then
        print_status "ERROR" "Git hooks directory not found. Are you in a git repository?"
        return 1
    fi
    
    # Copy optimized hooks
    if [ -f "scripts/pre-commit-optimized" ]; then
        cp "scripts/pre-commit-optimized" ".git/hooks/pre-commit"
        chmod +x ".git/hooks/pre-commit"
        print_status "SUCCESS" "Installed optimized pre-commit hook"
    else
        print_status "WARNING" "Optimized pre-commit hook not found, using current version"
    fi
    
    if [ -f "scripts/pre-push-optimized" ]; then
        cp "scripts/pre-push-optimized" ".git/hooks/pre-push"
        chmod +x ".git/hooks/pre-push"
        print_status "SUCCESS" "Installed optimized pre-push hook"
    else
        print_status "WARNING" "Optimized pre-push hook not found, using current version"
    fi
    
    print_status "SUCCESS" "Git hooks setup complete"
}

# Function to validate setup
validate_setup() {
    echo -e "\n${BLUE}🔍 Validating setup...${NC}"
    
    local all_good=true
    
    # Check optimized scripts
    check_script "scripts/validate-optimized.sh" || all_good=false
    check_script "scripts/validate-docs-ultra-fast.sh" || all_good=false
    check_script "scripts/check-changes-type-optimized.js" || all_good=false
    check_script "scripts/benchmark-validation.sh" || all_good=false
    
    # Check git hooks
    check_script ".git/hooks/pre-commit" || all_good=false
    check_script ".git/hooks/pre-push" || all_good=false
    
    # Check cache directory
    if [ -d ".validation-cache" ]; then
        print_status "SUCCESS" "Cache directory exists"
    else
        print_status "ERROR" "Cache directory missing"
        all_good=false
    fi
    
    if [ "$all_good" = true ]; then
        print_status "SUCCESS" "Setup validation passed"
        return 0
    else
        print_status "ERROR" "Setup validation failed"
        return 1
    fi
}

# Function to run performance test
run_performance_test() {
    echo -e "\n${BLUE}🏃 Running performance test...${NC}"
    
    if [ -f "scripts/benchmark-validation.sh" ]; then
        echo "Running benchmark to test performance improvements..."
        ./scripts/benchmark-validation.sh
    else
        print_status "WARNING" "Benchmark script not found, skipping performance test"
    fi
}

# Function to display usage instructions
display_usage() {
    echo -e "\n${CYAN}📖 USAGE INSTRUCTIONS${NC}"
    echo "====================="
    echo ""
    echo "The optimized validation system is now active with the following features:"
    echo ""
    echo "🚀 Performance Improvements:"
    echo "  • Ultra-fast docs validation: < 5 seconds"
    echo "  • Optimized code validation: < 30 seconds"
    echo "  • Parallel execution of frontend/backend validation"
    echo "  • Smart caching of validation results"
    echo "  • Incremental validation (only changed files)"
    echo ""
    echo "📁 Scripts Available:"
    echo "  • scripts/validate-optimized.sh - Main optimized validation"
    echo "  • scripts/validate-docs-ultra-fast.sh - Ultra-fast docs validation"
    echo "  • scripts/check-changes-type-optimized.js - Optimized change detection"
    echo "  • scripts/benchmark-validation.sh - Performance testing"
    echo ""
    echo "🔧 Manual Commands:"
    echo "  • Run optimized validation: ./scripts/validate-optimized.sh"
    echo "  • Run ultra-fast docs validation: ./scripts/validate-docs-ultra-fast.sh"
    echo "  • Run performance benchmark: ./scripts/benchmark-validation.sh"
    echo ""
    echo "📊 Expected Performance:"
    echo "  • Documentation changes: 2-5 seconds (was 2-3 minutes)"
    echo "  • Code changes: 15-30 seconds (was 2-3 minutes)"
    echo "  • Improvement: 80-85% faster execution"
    echo ""
    echo "🔄 Git Hooks:"
    echo "  • pre-commit: Automatically detects change type and runs appropriate validation"
    echo "  • pre-push: Runs optimized validation before pushing"
    echo ""
    echo "💡 Tips:"
    echo "  • The system automatically detects if changes are docs-only or include code"
    echo "  • Validation results are cached for faster subsequent runs"
    echo "  • Only changed files are validated in incremental mode"
    echo "  • Use the benchmark script to test performance improvements"
}

# Main setup function
main() {
    echo -e "${BLUE}Starting optimized validation setup...${NC}\n"
    
    # Install dependencies
    install_dependencies || exit 1
    
    # Setup cache directory
    setup_cache
    
    # Setup git hooks
    setup_git_hooks || exit 1
    
    # Validate setup
    validate_setup || exit 1
    
    # Run performance test
    run_performance_test
    
    # Display usage instructions
    display_usage
    
    echo -e "\n${GREEN}🎉 OPTIMIZED VALIDATION SYSTEM SETUP COMPLETE!${NC}"
    echo -e "${GREEN}✅ Your commit/push process should now be significantly faster${NC}"
    echo -e "${CYAN}🚀 Ready to use optimized validation system${NC}"
}

# Run main function
main "$@"
