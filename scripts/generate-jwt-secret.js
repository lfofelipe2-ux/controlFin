#!/usr/bin/env node

/**
 * JWT Secret Generator
 *
 * Generates a cryptographically secure JWT secret
 */

import crypto from 'crypto';

// Generate a secure JWT secret
function generateJWTSecret() {
  return crypto.randomBytes(64).toString('hex');
}

// Generate multiple secrets for different environments
function generateSecrets() {
  console.log('🔑 Gerando JWT Secrets Seguros...\n');

  const secrets = {
    development: generateJWTSecret(),
    staging: generateJWTSecret(),
    production: generateJWTSecret(),
  };

  console.log('✅ JWT Secrets gerados com sucesso!\n');

  console.log('📋 Adicione estes valores ao seu arquivo .env:\n');

  console.log('# Development');
  console.log(`JWT_SECRET=${secrets.development}`);
  console.log('');

  console.log('# Staging');
  console.log(`JWT_SECRET=${secrets.staging}`);
  console.log('');

  console.log('# Production');
  console.log(`JWT_SECRET=${secrets.production}`);
  console.log('');

  console.log('🔒 DICAS DE SEGURANÇA:');
  console.log('• Use secrets diferentes para cada ambiente');
  console.log('• Nunca commite secrets no código');
  console.log('• Use pelo menos 256 bits (32 bytes) de entropia');
  console.log('• Regenere secrets periodicamente');
  console.log('• Armazene em variáveis de ambiente ou gerenciadores de secrets');

  return secrets;
}

// Generate a single secret
function generateSingleSecret() {
  const secret = generateJWTSecret();
  console.log('🔑 JWT Secret gerado:');
  console.log(secret);
  return secret;
}

// Check command line arguments
const args = process.argv.slice(2);
const command = args[0];

if (command === 'single') {
  generateSingleSecret();
} else {
  generateSecrets();
}
