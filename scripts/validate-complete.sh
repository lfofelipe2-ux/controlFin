#!/bin/bash

# Complete Project Validation Script
# Validates both frontend and backend before commits/pushes

set -e  # Exit on any error

echo "🚀 COMPLETE PROJECT VALIDATION STARTING..."
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Track validation results
FRONTEND_PASSED=false
BACKEND_PASSED=false
OVERALL_PASSED=false

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

# Function to validate frontend
validate_frontend() {
    echo -e "\n${BLUE}🔍 VALIDATING FRONTEND...${NC}"
    echo "================================"
    
    cd controlfin-frontend
    
    # TypeScript compilation
    echo "🔄 Running TypeScript compilation..."
    if npm run type-check; then
        print_status "SUCCESS" "TypeScript compilation passed"
    else
        print_status "ERROR" "TypeScript compilation failed"
        return 1
    fi
    
    # ESLint check (allow warnings for frontend)
    echo "🔄 Running ESLint check..."
    if npm run lint; then
        print_status "SUCCESS" "ESLint check passed"
    else
        print_status "WARNING" "ESLint warnings found (non-blocking)"
        # Continue with validation even if there are warnings
    fi
    
    # Tests
    echo "🔄 Running frontend tests..."
    if npm run test:coverage; then
        print_status "SUCCESS" "Frontend tests passed"
    else
        print_status "ERROR" "Frontend tests failed"
        return 1
    fi
    
    # Build test
    echo "🔄 Testing frontend build..."
    if npm run build; then
        print_status "SUCCESS" "Frontend build successful"
    else
        print_status "ERROR" "Frontend build failed"
        return 1
    fi
    
    cd ..
    FRONTEND_PASSED=true
    return 0
}

# Function to validate backend
validate_backend() {
    echo -e "\n${BLUE}🔍 VALIDATING BACKEND...${NC}"
    echo "================================"
    
    cd /Users/luisfelipedeoliveira/controlFin/controlfin-backend
    
    # TypeScript compilation
    echo "🔄 Running TypeScript compilation..."
    if npm run type-check; then
        print_status "SUCCESS" "TypeScript compilation passed"
    else
        print_status "ERROR" "TypeScript compilation failed"
        return 1
    fi
    
    # ESLint check (allow warnings for backend)
    echo "🔄 Running ESLint check..."
    if ESLINT_USE_FLAT_CONFIG=false npm run lint:all; then
        print_status "SUCCESS" "ESLint check passed"
    else
        print_status "WARNING" "ESLint warnings found (non-blocking)"
        # Continue with validation even if there are warnings
    fi
    
    # Tests
    echo "🔄 Running backend tests..."
    if npm run test:coverage; then
        print_status "SUCCESS" "Backend tests passed"
    else
        print_status "ERROR" "Backend tests failed"
        return 1
    fi
    
    # Build test
    echo "🔄 Testing backend build..."
    if npm run build; then
        print_status "SUCCESS" "Backend build successful"
    else
        print_status "ERROR" "Backend build failed"
        return 1
    fi
    
    cd ..
    BACKEND_PASSED=true
    return 0
}

# Main validation process
main() {
    echo -e "${BLUE}Starting complete project validation...${NC}\n"
    
    # Validate frontend
    if validate_frontend; then
        print_status "SUCCESS" "Frontend validation completed successfully"
    else
        print_status "ERROR" "Frontend validation failed"
        OVERALL_PASSED=false
    fi
    
    # Validate backend
    if validate_backend; then
        print_status "SUCCESS" "Backend validation completed successfully"
    else
        print_status "ERROR" "Backend validation failed"
        OVERALL_PASSED=false
    fi
    
    # Final results
    echo -e "\n${BLUE}📊 VALIDATION SUMMARY${NC}"
    echo "========================"
    
    if [ "$FRONTEND_PASSED" = true ]; then
        print_status "SUCCESS" "Frontend: PASSED"
    else
        print_status "ERROR" "Frontend: FAILED"
    fi
    
    if [ "$BACKEND_PASSED" = true ]; then
        print_status "SUCCESS" "Backend: PASSED"
    else
        print_status "ERROR" "Backend: FAILED"
    fi
    
    # Overall result
    if [ "$FRONTEND_PASSED" = true ] && [ "$BACKEND_PASSED" = true ]; then
        OVERALL_PASSED=true
        echo -e "\n${GREEN}🎉 ALL VALIDATIONS PASSED!${NC}"
        echo -e "${GREEN}✅ Project is ready for commit/push${NC}"
        exit 0
    else
        echo -e "\n${RED}❌ VALIDATION FAILED!${NC}"
        echo -e "${RED}🚫 Please fix the issues above before committing${NC}"
        exit 1
    fi
}

# Run main function
main "$@"
