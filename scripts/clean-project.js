#!/usr/bin/env node

/**
 * DESIGN FIRST - Project Cleanup
 * Remove código não utilizado e otimiza para UI/UX
 */

const fs = require('fs');
const path = require('path');

console.log('🧹 Limpeza contínua DESIGN FIRST...');

// Remover arquivos temporários
const tempFiles = [
  'package.json.backup',
  'test-backups',
  'coverage',
  'dist',
  'node_modules/.cache',
  '.vscode/settings.json',
  '.DS_Store'
];

tempFiles.forEach(file => {
  if (fs.existsSync(file)) {
    fs.rmSync(file, { recursive: true, force: true });
    console.log(`✅ Removido: ${file}`);
  }
});

console.log('🎨 Projeto limpo para DESIGN FIRST!');
