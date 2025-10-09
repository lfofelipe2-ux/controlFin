import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import noHardcodedStrings from '../eslint-plugins/no-hardcoded-strings/index.js';
import noDuplicateI18nKeys from '../eslint-plugins/no-duplicate-i18n-keys/index.js';

export default defineConfig([
  globalIgnores(['dist', 'coverage']),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'no-hardcoded-strings': noHardcodedStrings,
      'no-duplicate-i18n-keys': noDuplicateI18nKeys,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'no-console': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      'no-hardcoded-strings/no-hardcoded-strings': 'error',
      'no-duplicate-i18n-keys/no-duplicate-i18n-keys': [
        'error',
        {
          translationFiles: [
            'src/locales/en/common.json',
            'src/locales/pt/common.json',
          ],
        },
      ],
    },
  },
]);
