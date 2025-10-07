#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

// Cores para output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'white') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, cwd, description) {
  log(`\n${colors.bold}${colors.blue}🔍 ${description}${colors.reset}`);
  log(`${colors.cyan}Executando: ${command}${colors.reset}`);
  
  try {
    const output = execSync(command, { 
      cwd, 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    log(`${colors.green}✅ ${description} - SUCESSO${colors.reset}`);
    return { success: true, output };
  } catch (error) {
    log(`${colors.red}❌ ${description} - FALHOU${colors.reset}`);
    log(`${colors.yellow}Erro: ${error.message}${colors.reset}`);
    return { success: false, error: error.message, output: error.stdout || error.stderr };
  }
}

function main() {
  log(`${colors.bold}${colors.magenta}🚀 VALIDAÇÃO COMPREHENSIVA - ControlFin${colors.reset}`);
  log(`${colors.cyan}Executando todas as validações sem parar no primeiro erro...${colors.reset}`);
  
  const results = {
    backend: {},
    frontend: {},
    overall: { success: true, errors: [] }
  };
  
  // Backend
  log(`\n${colors.bold}${colors.blue}📦 BACKEND VALIDATION${colors.reset}`);
  const backendPath = path.join(__dirname, '..', 'controlfin-backend');
  
  results.backend.typeCheck = runCommand('npm run type-check', backendPath, 'TypeScript Check');
  results.backend.lint = runCommand('npm run lint', backendPath, 'ESLint Check');
  results.backend.tests = runCommand('npm run test:all', backendPath, 'Test Suite');
  
  // Frontend
  log(`\n${colors.bold}${colors.blue}📦 FRONTEND VALIDATION${colors.reset}`);
  const frontendPath = path.join(__dirname, '..', 'controlfin-frontend');
  
  results.frontend.typeCheck = runCommand('npm run type-check', frontendPath, 'TypeScript Check');
  results.frontend.lint = runCommand('npm run lint', frontendPath, 'ESLint Check');
  results.frontend.tests = runCommand('npm run test:all', frontendPath, 'Test Suite');
  
  // Resumo
  log(`\n${colors.bold}${colors.magenta}📊 RESUMO DOS RESULTADOS${colors.reset}`);
  
  const backendSuccess = Object.values(results.backend).every(r => r.success);
  const frontendSuccess = Object.values(results.frontend).every(r => r.success);
  
  log(`\n${colors.bold}Backend:${colors.reset}`);
  log(`  TypeScript: ${results.backend.typeCheck.success ? '✅' : '❌'}`);
  log(`  ESLint: ${results.backend.lint.success ? '✅' : '❌'}`);
  log(`  Tests: ${results.backend.tests.success ? '✅' : '❌'}`);
  
  log(`\n${colors.bold}Frontend:${colors.reset}`);
  log(`  TypeScript: ${results.frontend.typeCheck.success ? '✅' : '❌'}`);
  log(`  ESLint: ${results.frontend.lint.success ? '✅' : '❌'}`);
  log(`  Tests: ${results.frontend.tests.success ? '✅' : '❌'}`);
  
  const overallSuccess = backendSuccess && frontendSuccess;
  
  log(`\n${colors.bold}${overallSuccess ? colors.green : colors.red}${overallSuccess ? '🎉 TODAS AS VALIDAÇÕES PASSARAM!' : '⚠️ ALGUMAS VALIDAÇÕES FALHARAM'}`)
  log(`${colors.reset}`);
  
  if (!overallSuccess) {
    log(`\n${colors.yellow}💡 DICA: Todos os erros foram coletados acima. Corrija os problemas e execute novamente.${colors.reset}`);
  }
  
  process.exit(overallSuccess ? 0 : 1);
}

main();
