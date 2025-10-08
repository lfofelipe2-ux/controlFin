#!/bin/bash

# Validation Performance Benchmark Script
# Tests and compares different validation approaches

echo "🏁 VALIDATION PERFORMANCE BENCHMARK"
echo "===================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Results storage
declare -A results

# Function to run benchmark
run_benchmark() {
    local test_name=$1
    local script_path=$2
    local description=$3
    
    echo -e "\n${BLUE}🧪 Testing: $test_name${NC}"
    echo "Description: $description"
    echo "Script: $script_path"
    echo "----------------------------------------"
    
    if [ ! -f "$script_path" ]; then
        echo -e "${RED}❌ Script not found: $script_path${NC}"
        results["$test_name"]="ERROR: Script not found"
        return 1
    fi
    
    # Run the script and measure time
    local start_time=$(date +%s.%N)
    
    if [ "${script_path##*.}" = "js" ]; then
        # Node.js script
        node "$script_path" > /dev/null 2>&1
        local exit_code=$?
    else
        # Shell script
        bash "$script_path" > /dev/null 2>&1
        local exit_code=$?
    fi
    
    local end_time=$(date +%s.%N)
    local duration=$(echo "$end_time - $start_time" | bc)
    
    if [ $exit_code -eq 0 ]; then
        echo -e "${GREEN}✅ PASSED${NC} - Duration: ${duration}s"
        results["$test_name"]="PASSED: ${duration}s"
    else
        echo -e "${RED}❌ FAILED${NC} - Duration: ${duration}s (Exit code: $exit_code)"
        results["$test_name"]="FAILED: ${duration}s (Exit code: $exit_code)"
    fi
    
    return $exit_code
}

# Function to create test scenarios
create_test_scenarios() {
    echo -e "\n${CYAN}🔧 Creating test scenarios...${NC}"
    
    # Create a test commit with docs-only changes
    echo "Creating docs-only test commit..."
    echo "# Test documentation change" >> test-docs.md
    git add test-docs.md
    
    # Create a test commit with code changes
    echo "Creating code change test commit..."
    echo "// Test code change" >> controlfin-frontend/src/test-file.ts
    git add controlfin-frontend/src/test-file.ts
    
    echo "Test scenarios created"
}

# Function to cleanup test scenarios
cleanup_test_scenarios() {
    echo -e "\n${CYAN}🧹 Cleaning up test scenarios...${NC}"
    
    # Remove test files
    rm -f test-docs.md
    rm -f controlfin-frontend/src/test-file.ts
    
    # Reset git changes
    git reset HEAD test-docs.md controlfin-frontend/src/test-file.ts 2>/dev/null || true
    git checkout -- test-docs.md controlfin-frontend/src/test-file.ts 2>/dev/null || true
    
    echo "Test scenarios cleaned up"
}

# Function to display results
display_results() {
    echo -e "\n${BLUE}📊 BENCHMARK RESULTS${NC}"
    echo "====================="
    
    for test_name in "${!results[@]}"; do
        local result="${results[$test_name]}"
        if [[ $result == PASSED* ]]; then
            echo -e "${GREEN}✅ $test_name: $result${NC}"
        elif [[ $result == FAILED* ]]; then
            echo -e "${RED}❌ $test_name: $result${NC}"
        else
            echo -e "${YELLOW}⚠️  $test_name: $result${NC}"
        fi
    done
    
    echo -e "\n${CYAN}📈 PERFORMANCE SUMMARY${NC}"
    echo "======================"
    
    # Extract durations and sort
    local durations=()
    for test_name in "${!results[@]}"; do
        local result="${results[$test_name]}"
        if [[ $result == *"s" ]]; then
            local duration=$(echo "$result" | grep -o '[0-9.]*s' | sed 's/s//')
            durations+=("$test_name:$duration")
        fi
    done
    
    # Sort by duration
    IFS=$'\n' sorted_durations=($(sort -t: -k2 -n <<<"${durations[*]}"))
    unset IFS
    
    echo "Fastest to slowest:"
    for item in "${sorted_durations[@]}"; do
        local test_name=$(echo "$item" | cut -d: -f1)
        local duration=$(echo "$item" | cut -d: -f2)
        echo "  $test_name: ${duration}s"
    done
}

# Main benchmark function
main() {
    echo -e "${BLUE}Starting validation performance benchmark...${NC}\n"
    
    # Check if we're in a git repository
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        echo -e "${RED}❌ Not in a git repository${NC}"
        exit 1
    fi
    
    # Create test scenarios
    create_test_scenarios
    
    # Run benchmarks
    echo -e "\n${BLUE}🏃 Running benchmarks...${NC}"
    
    # Test 1: Change detection (optimized)
    run_benchmark "Change Detection (Optimized)" "scripts/check-changes-type-optimized.js" "Fast change type detection with caching"
    
    # Test 2: Change detection (legacy)
    run_benchmark "Change Detection (Legacy)" "scripts/check-changes-type.js" "Original change detection without optimization"
    
    # Test 3: Ultra-fast docs validation
    run_benchmark "Ultra-Fast Docs Validation" "scripts/validate-docs-ultra-fast.sh" "Ultra-fast validation for documentation-only changes"
    
    # Test 4: Optimized validation
    run_benchmark "Optimized Validation" "scripts/validate-optimized.sh" "Optimized validation with parallel execution and caching"
    
    # Test 5: Legacy docs validation
    run_benchmark "Legacy Docs Validation" "scripts/validate-docs-only.sh" "Original documentation validation"
    
    # Test 6: Complete validation
    run_benchmark "Complete Validation" "scripts/validate-complete.sh" "Full validation without optimization"
    
    # Display results
    display_results
    
    # Cleanup
    cleanup_test_scenarios
    
    echo -e "\n${GREEN}🎉 Benchmark completed!${NC}"
    echo -e "${CYAN}💡 Use the results above to choose the best validation approach${NC}"
}

# Check if bc is available for floating point arithmetic
if ! command -v bc >/dev/null 2>&1; then
    echo -e "${RED}❌ 'bc' command not found. Please install it for accurate timing.${NC}"
    echo "On macOS: brew install bc"
    echo "On Ubuntu/Debian: sudo apt-get install bc"
    exit 1
fi

# Run main function
main "$@"
