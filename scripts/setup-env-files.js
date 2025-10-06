#!/usr/bin/env node

/**
 * Environment Files Setup Script
 *
 * Creates .env files from .env.example and provides guidance
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class EnvSetup {
  constructor() {
    this.createdFiles = [];
    this.errors = [];
  }

  log(message, type = 'info') {
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
    console.log(`${prefix} ${message}`);
  }

  // Check if .env.example exists
  checkExampleFiles() {
    this.log('🔍 Verificando arquivos de exemplo...');

    const frontendExample = 'controlfin-frontend/env.example';
    const backendExample = 'controlfin-backend/env.example';

    if (!fs.existsSync(frontendExample)) {
      this.log('Arquivo controlfin-frontend/env.example não encontrado', 'error');
      this.errors.push('Frontend .env.example não encontrado');
      return false;
    }

    if (!fs.existsSync(backendExample)) {
      this.log('Arquivo controlfin-backend/env.example não encontrado', 'error');
      this.errors.push('Backend .env.example não encontrado');
      return false;
    }

    this.log('Arquivos de exemplo encontrados', 'success');
    return true;
  }

  // Create .env files from examples
  createEnvFiles() {
    this.log('📄 Criando arquivos .env...');

    const filesToCreate = [
      {
        example: 'controlfin-frontend/env.example',
        target: 'controlfin-frontend/.env',
      },
      {
        example: 'controlfin-backend/env.example',
        target: 'controlfin-backend/.env',
      },
    ];

    for (const file of filesToCreate) {
      try {
        if (fs.existsSync(file.target)) {
          this.log(`Arquivo ${file.target} já existe - pulando`, 'info');
          continue;
        }

        fs.copyFileSync(file.example, file.target);
        this.createdFiles.push(file.target);
        this.log(`Arquivo ${file.target} criado com sucesso`, 'success');
      } catch (error) {
        this.log(`Erro ao criar ${file.target}: ${error.message}`, 'error');
        this.errors.push(`Erro ao criar ${file.target}`);
      }
    }
  }

  // Check if .env files were created successfully
  verifyEnvFiles() {
    this.log('🔍 Verificando arquivos criados...');

    const envFiles = ['controlfin-frontend/.env', 'controlfin-backend/.env'];

    for (const envFile of envFiles) {
      if (fs.existsSync(envFile)) {
        this.log(`Arquivo ${envFile} verificado`, 'success');
      } else {
        this.log(`Arquivo ${envFile} não foi criado`, 'error');
        this.errors.push(`Arquivo ${envFile} não encontrado após criação`);
      }
    }
  }

  // Generate JWT secret
  async generateJWTSecret() {
    this.log('🔑 Gerando JWT secret...');

    try {
      const crypto = await import('crypto');
      const secret = crypto.randomBytes(64).toString('hex');

      // Update backend .env with new secret
      const backendEnvPath = 'controlfin-backend/.env';
      if (fs.existsSync(backendEnvPath)) {
        let envContent = fs.readFileSync(backendEnvPath, 'utf8');

        // Replace placeholder JWT secret
        envContent = envContent.replace(
          /JWT_SECRET=your_super_secret_jwt_key_change_this_in_production/,
          `JWT_SECRET=${secret}`
        );

        fs.writeFileSync(backendEnvPath, envContent);
        this.log('JWT secret gerado e configurado', 'success');
        return secret;
      }
    } catch (error) {
      this.log(`Erro ao gerar JWT secret: ${error.message}`, 'error');
      this.errors.push('Erro ao gerar JWT secret');
    }

    return null;
  }

  // Show next steps
  showNextSteps() {
    console.log('\n📋 PRÓXIMOS PASSOS:');
    console.log('1. Configure o Google OAuth 2.0:');
    console.log('   📚 Tutorial: docs/tutorials/google-oauth-tutorial.md');
    console.log('   🌐 Google Cloud Console: https://console.cloud.google.com/');

    console.log('\n2. Configure o MongoDB Atlas:');
    console.log('   📚 Tutorial: docs/tutorials/mongodb-atlas-tutorial.md');
    console.log('   🌐 MongoDB Atlas: https://www.mongodb.com/atlas');

    console.log('\n3. Configure as variáveis de ambiente:');
    console.log('   🔐 Frontend: VITE_GOOGLE_CLIENT_ID=seu_client_id');
    console.log('   🗄️ Backend: MONGODB_URI=sua_connection_string');
    console.log('   🔑 Backend: GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET');

    console.log('\n4. Teste as configurações:');
    console.log('   npm run validate:config');
    console.log('   npm run test:mongodb');

    console.log('\n5. Configure produção (opcional):');
    console.log('   📚 Tutorial: docs/tutorials/production-setup-tutorial.md');
  }

  // Main setup method
  async run() {
    console.log('🚀 Configurando arquivos de ambiente do ControlFin...\n');

    // Check example files
    if (!this.checkExampleFiles()) {
      console.log('\n❌ ERRO: Arquivos de exemplo não encontrados');
      return;
    }

    // Create .env files
    this.createEnvFiles();

    // Verify files
    this.verifyEnvFiles();

    // Generate JWT secret
    await this.generateJWTSecret();

    // Show results
    console.log('\n📊 RESULTADO DA CONFIGURAÇÃO:');

    if (this.createdFiles.length > 0) {
      console.log('\n✅ Arquivos criados:');
      this.createdFiles.forEach((file) => {
        console.log(`   • ${file}`);
      });
    }

    if (this.errors.length > 0) {
      console.log('\n❌ Erros encontrados:');
      this.errors.forEach((error) => {
        console.log(`   • ${error}`);
      });
    }

    // Show next steps
    this.showNextSteps();

    if (this.errors.length === 0) {
      console.log('\n🎉 Configuração de ambiente concluída com sucesso!');
      console.log('\n🚀 Para continuar:');
      console.log('1. Configure o Google OAuth 2.0');
      console.log('2. Configure o MongoDB Atlas');
      console.log('3. Teste as configurações');
    } else {
      console.log('\n⚠️ Alguns erros foram encontrados. Verifique as mensagens acima.');
    }
  }
}

// Run setup if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const setup = new EnvSetup();
  setup.run();
}

export default EnvSetup;
