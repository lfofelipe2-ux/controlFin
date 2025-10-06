#!/usr/bin/env node

/**
 * MongoDB Connection Test Script
 *
 * Tests MongoDB Atlas connection and basic operations
 */

import fs from 'fs';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class MongoDBTester {
  constructor() {
    this.results = [];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
    console.log(`${prefix} ${message}`);
  }

  addResult(message, success = true) {
    this.results.push({ message, success });
    this.log(message, success ? 'success' : 'error');
  }

  // Test 1: Environment Variables
  testEnvironmentVariables() {
    this.log('🔍 Verificando variáveis de ambiente...');

    const envPath = 'controlfin-backend/.env';
    if (!fs.existsSync(envPath)) {
      this.addResult('Arquivo .env não encontrado', false);
      return false;
    }

    const envContent = fs.readFileSync(envPath, 'utf8');
    const hasMongoURI = envContent.includes('MONGODB_URI=');
    const hasJWT = envContent.includes('JWT_SECRET=');

    if (hasMongoURI && !envContent.includes('username:password')) {
      this.addResult('MONGODB_URI configurado corretamente');
    } else {
      this.addResult('MONGODB_URI precisa ser configurado', false);
      return false;
    }

    if (hasJWT && !envContent.includes('your_super_secret')) {
      this.addResult('JWT_SECRET configurado corretamente');
    } else {
      this.addResult('JWT_SECRET precisa ser configurado', false);
      return false;
    }

    return true;
  }

  // Test 2: MongoDB Connection
  async testMongoDBConnection() {
    this.log('🔗 Testando conexão com MongoDB...');

    try {
      // Load environment variables
      const envPath = 'controlfin-backend/.env';
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split('\n').forEach((line) => {
          if (line.includes('=')) {
            const [key, ...valueParts] = line.split('=');
            const value = valueParts.join('=');
            if (key && value) {
              process.env[key] = value;
            }
          }
        });
      }

      if (!process.env.MONGODB_URI) {
        this.addResult('MONGODB_URI não definida', false);
        return false;
      }

      // Connect to MongoDB
      await mongoose.connect(process.env.MONGODB_URI);

      this.addResult('Conexão com MongoDB estabelecida com sucesso');

      // Test basic operations
      const db = mongoose.connection.db;
      const collections = await db.listCollections().toArray();

      this.addResult(`Banco de dados acessível (${collections.length} collections)`);

      return true;
    } catch (error) {
      this.addResult(`Erro de conexão: ${error.message}`, false);
      return false;
    } finally {
      // Close connection
      await mongoose.connection.close();
    }
  }

  // Test 3: Database Operations
  async testDatabaseOperations() {
    this.log('🗄️ Testando operações básicas de banco...');

    try {
      if (!process.env.MONGODB_URI) {
        this.addResult('MONGODB_URI não definida', false);
        return false;
      }

      await mongoose.connect(process.env.MONGODB_URI);

      const db = mongoose.connection.db;

      // Test database info
      const dbInfo = await db.admin().serverInfo();
      this.addResult(`MongoDB version: ${dbInfo.version}`);

      // Test collection creation
      const testCollection = db.collection('test_connection');
      await testCollection.insertOne({
        test: true,
        timestamp: new Date(),
        message: 'ControlFin connection test',
      });

      this.addResult('Inserção de teste realizada com sucesso');

      // Clean up
      await testCollection.drop();
      this.addResult('Limpeza de teste realizada');

      return true;
    } catch (error) {
      this.addResult(`Erro nas operações: ${error.message}`, false);
      return false;
    } finally {
      await mongoose.connection.close();
    }
  }

  // Test 4: Performance Check
  async testPerformance() {
    this.log('⚡ Testando performance básica...');

    try {
      if (!process.env.MONGODB_URI) {
        this.addResult('MONGODB_URI não definida', false);
        return false;
      }

      const startTime = Date.now();
      await mongoose.connect(process.env.MONGODB_URI);
      const connectTime = Date.now() - startTime;

      this.addResult(`Tempo de conexão: ${connectTime}ms`);

      if (connectTime < 2000) {
        this.addResult('Performance de conexão: Excelente');
      } else if (connectTime < 5000) {
        this.addResult('Performance de conexão: Boa');
      } else {
        this.addResult('Performance de conexão: Precisa otimização', false);
      }

      return true;
    } catch (error) {
      this.addResult(`Erro de performance: ${error.message}`, false);
      return false;
    } finally {
      await mongoose.connection.close();
    }
  }

  // Generate test report
  generateReport() {
    console.log('\n📊 RELATÓRIO DE TESTE MONGODB\n');

    const successCount = this.results.filter((r) => r.success).length;
    const totalCount = this.results.length;

    console.log(`✅ Testes Passados: ${successCount}/${totalCount}`);

    if (successCount === totalCount) {
      console.log('\n🎉 MongoDB está configurado e funcionando corretamente!');
      console.log('\n📋 PRÓXIMOS PASSOS:');
      console.log('1. Configure o Google OAuth 2.0');
      console.log('2. Teste a integração frontend-backend');
      console.log('3. Configure produção (Vercel + Render)');

      console.log('\n🚀 Para iniciar o backend:');
      console.log('cd controlfin-backend && npm run dev');

      console.log('\n📚 Para ver o tutorial completo:');
      console.log('cat docs/CONFIGURATION_GUIDE.md');
    } else {
      console.log('\n🔧 PROBLEMAS ENCONTRADOS:');
      this.results
        .filter((r) => !r.success)
        .forEach((result, index) => {
          console.log(`${index + 1}. ${result.message}`);
        });

      console.log('\n📋 SOLUÇÕES:');
      console.log('1. Configure o MongoDB Atlas seguindo o tutorial');
      console.log('2. Verifique a connection string');
      console.log('3. Configure o network access no Atlas');
      console.log('4. Execute este teste novamente após correções');

      console.log('\n📚 Consulte o tutorial:');
      console.log('cat docs/tutorials/mongodb-atlas-tutorial.md');
    }

    console.log('\n🚀 Para executar este teste novamente:');
    console.log('node scripts/test-mongodb-connection.js');
  }

  // Main test method
  async runTests() {
    console.log('🚀 Iniciando testes de conexão MongoDB...\n');

    try {
      // Test 1: Environment Variables
      const envOk = this.testEnvironmentVariables();

      if (!envOk) {
        this.generateReport();
        return;
      }

      // Test 2: Connection
      await this.testMongoDBConnection();

      // Test 3: Database Operations
      await this.testDatabaseOperations();

      // Test 4: Performance
      await this.testPerformance();

      this.generateReport();
    } catch (error) {
      this.addResult(`Erro inesperado: ${error.message}`, false);
      this.generateReport();
    }
  }
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const tester = new MongoDBTester();
  tester.runTests();
}

export default MongoDBTester;
