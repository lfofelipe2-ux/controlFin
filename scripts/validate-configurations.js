#!/usr/bin/env node

/**
 * Configuration Validation Script
 *
 * Validates all critical configurations for ControlFin project
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ConfigurationValidator {
  constructor() {
    this.issues = [];
    this.successes = [];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
    console.log(`${prefix} ${message}`);
  }

  addIssue(message) {
    this.issues.push(message);
    this.log(message, 'error');
  }

  addSuccess(message) {
    this.successes.push(message);
    this.log(message, 'success');
  }

  // 1. Check Google OAuth Configuration
  validateGoogleOAuth() {
    this.log('🔐 Verificando configuração do Google OAuth...');

    // Check frontend .env
    const frontendEnv = this.readEnvFile('controlfin-frontend/.env');
    const backendEnv = this.readEnvFile('controlfin-backend/.env');

    // Check if .env files exist
    if (!frontendEnv) {
      this.addIssue(
        'Arquivo controlfin-frontend/.env não encontrado. Execute: cp controlfin-frontend/env.example controlfin-frontend/.env'
      );
    } else {
      if (
        !frontendEnv.VITE_GOOGLE_CLIENT_ID ||
        frontendEnv.VITE_GOOGLE_CLIENT_ID.includes('your_google_client_id')
      ) {
        this.addIssue(
          'VITE_GOOGLE_CLIENT_ID não configurado ou usando valor de exemplo no frontend'
        );
      } else {
        this.addSuccess('VITE_GOOGLE_CLIENT_ID configurado no frontend');
      }
    }

    if (!backendEnv) {
      this.addIssue(
        'Arquivo controlfin-backend/.env não encontrado. Execute: cp controlfin-backend/env.example controlfin-backend/.env'
      );
    } else {
      if (
        !backendEnv.GOOGLE_CLIENT_ID ||
        backendEnv.GOOGLE_CLIENT_ID.includes('your_google_client_id')
      ) {
        this.addIssue('GOOGLE_CLIENT_ID não configurado ou usando valor de exemplo no backend');
      } else {
        this.addSuccess('GOOGLE_CLIENT_ID configurado no backend');
      }

      if (
        !backendEnv.GOOGLE_CLIENT_SECRET ||
        backendEnv.GOOGLE_CLIENT_SECRET.includes('your_google_client_secret')
      ) {
        this.addIssue('GOOGLE_CLIENT_SECRET não configurado ou usando valor de exemplo no backend');
      } else {
        this.addSuccess('GOOGLE_CLIENT_SECRET configurado no backend');
      }
    }
  }

  // 2. Check MongoDB Configuration
  validateMongoDB() {
    this.log('🗄️ Verificando configuração do MongoDB...');

    const backendEnv = this.readEnvFile('controlfin-backend/.env');

    if (!backendEnv) {
      this.addIssue('Arquivo controlfin-backend/.env não encontrado');
      return;
    }

    if (!backendEnv.MONGODB_URI || backendEnv.MONGODB_URI.includes('username:password')) {
      this.addIssue('MONGODB_URI não configurado ou usando valores de exemplo');
    } else {
      this.addSuccess('MONGODB_URI configurado no backend');
    }
  }

  // 3. Check JWT Configuration
  validateJWT() {
    this.log('🔑 Verificando configuração do JWT...');

    const backendEnv = this.readEnvFile('controlfin-backend/.env');

    if (!backendEnv) {
      this.addIssue('Arquivo controlfin-backend/.env não encontrado');
      return;
    }

    if (!backendEnv.JWT_SECRET || backendEnv.JWT_SECRET.includes('your_super_secret')) {
      this.addIssue('JWT_SECRET não configurado ou usando valor de exemplo');
    } else {
      this.addSuccess('JWT_SECRET configurado no backend');
    }
  }

  // 4. Check Environment Files
  validateEnvFiles() {
    this.log('📄 Verificando arquivos de ambiente...');

    // Check if .env files exist
    const frontendEnvExists = fs.existsSync('controlfin-frontend/.env');
    const backendEnvExists = fs.existsSync('controlfin-backend/.env');

    if (!frontendEnvExists) {
      this.addIssue('controlfin-frontend/.env não existe - copie do .env.example');
    } else {
      this.addSuccess('controlfin-frontend/.env existe');
    }

    if (!backendEnvExists) {
      this.addIssue('controlfin-backend/.env não existe - copie do .env.example');
    } else {
      this.addSuccess('controlfin-backend/.env existe');
    }
  }

  // 5. Check Dependencies
  validateDependencies() {
    this.log('📦 Verificando dependências...');

    try {
      // Check frontend dependencies
      if (fs.existsSync('controlfin-frontend/package.json')) {
        this.addSuccess('controlfin-frontend/package.json encontrado');
      }

      // Check backend dependencies
      if (fs.existsSync('controlfin-backend/package.json')) {
        this.addSuccess('controlfin-backend/package.json encontrado');
      }
    } catch (error) {
      this.addIssue(`Erro ao verificar dependências: ${error.message}`);
    }
  }

  // Helper method to read .env files
  readEnvFile(envPath) {
    try {
      if (!fs.existsSync(envPath)) {
        return null;
      }

      const content = fs.readFileSync(envPath, 'utf8');
      const env = {};

      content.split('\n').forEach((line) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const [key, ...valueParts] = trimmed.split('=');
          env[key] = valueParts.join('=');
        }
      });

      return env;
    } catch (error) {
      return null;
    }
  }

  // Generate summary report
  generateReport() {
    console.log('\n📊 RELATÓRIO DE VALIDAÇÃO DE CONFIGURAÇÕES\n');

    console.log(`✅ Sucessos: ${this.successes.length}`);
    console.log(`❌ Problemas: ${this.issues.length}`);

    if (this.issues.length > 0) {
      console.log('\n🔧 PROBLEMAS ENCONTRADOS:');
      this.issues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue}`);
      });
    }

    if (this.successes.length > 0) {
      console.log('\n✅ CONFIGURAÇÕES OK:');
      this.successes.forEach((success, index) => {
        console.log(`${index + 1}. ${success}`);
      });
    }

    console.log('\n📋 PRÓXIMOS PASSOS:');

    if (this.issues.some((issue) => issue.includes('Google'))) {
      console.log(
        '1. Configure o Google OAuth 2.0 seguindo o tutorial em docs/CONFIGURATION_GUIDE.md'
      );
    }

    if (this.issues.some((issue) => issue.includes('MongoDB'))) {
      console.log(
        '2. Configure o MongoDB Atlas seguindo o tutorial em docs/CONFIGURATION_GUIDE.md'
      );
    }

    if (this.issues.some((issue) => issue.includes('.env'))) {
      console.log('3. Crie os arquivos .env a partir dos .env.example');
    }

    console.log('\n🚀 Para executar este script novamente:');
    console.log('node scripts/validate-configurations.js');

    console.log('\n📚 Para ver o tutorial completo:');
    console.log('cat docs/CONFIGURATION_GUIDE.md');
  }

  // Main validation method
  async validate() {
    console.log('🚀 Iniciando validação de configurações do ControlFin...\n');

    this.validateEnvFiles();
    this.validateGoogleOAuth();
    this.validateMongoDB();
    this.validateJWT();
    this.validateDependencies();

    this.generateReport();

    // Exit with error code if there are issues
    if (this.issues.length > 0) {
      process.exit(1);
    } else {
      console.log('\n🎉 Todas as configurações estão corretas!');
      process.exit(0);
    }
  }
}

// Run validation if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const validator = new ConfigurationValidator();
  validator.validate();
}

export default ConfigurationValidator;
