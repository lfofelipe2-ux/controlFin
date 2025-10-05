const fs = require('fs');
const path = require('path');

module.exports = {
    rules: {
        'no-duplicate-i18n-keys': {
            meta: {
                type: 'problem',
                docs: {
                    description: 'Disallow duplicate i18n translation keys',
                    category: 'Best Practices',
                    recommended: false,
                },
                messages: {
                    duplicateKey: 'Duplicate i18n key "{{key}}" found in translation files',
                },
                schema: [
                    {
                        type: 'object',
                        properties: {
                            translationFiles: {
                                type: 'array',
                                items: { type: 'string' },
                                description: 'Array of translation file paths to check',
                            },
                        },
                        additionalProperties: false,
                    },
                ],
            },
            create(context) {
                const options = context.options[0] || {};
                const translationFiles = options.translationFiles || [
                    'src/locales/en/common.json',
                    'src/locales/pt/common.json',
                ];

                // Cache for storing parsed translation files
                const translationCache = new Map();

                const parseTranslationFile = (filePath) => {
                    if (translationCache.has(filePath)) {
                        return translationCache.get(filePath);
                    }

                    try {
                        const fullPath = path.resolve(context.getCwd(), filePath);
                        if (!fs.existsSync(fullPath)) {
                            translationCache.set(filePath, { keys: [], errors: [] });
                            return { keys: [], errors: [] };
                        }

                        const content = fs.readFileSync(fullPath, 'utf8');
                        const parsed = JSON.parse(content);
                        const keys = [];

                        const extractKeys = (obj, prefix = '') => {
                            for (const [key, value] of Object.entries(obj)) {
                                const fullKey = prefix ? `${prefix}.${key}` : key;
                                if (typeof value === 'object' && value !== null) {
                                    extractKeys(value, fullKey);
                                } else {
                                    keys.push(fullKey);
                                }
                            }
                        };

                        extractKeys(parsed);
                        const result = { keys, errors: [] };
                        translationCache.set(filePath, result);
                        return result;
                    } catch (error) {
                        const result = { keys: [], errors: [error.message] };
                        translationCache.set(filePath, result);
                        return result;
                    }
                };

                const findDuplicateKeys = () => {
                    // Check for duplicates within each file individually
                    for (const filePath of translationFiles) {
                        const { keys, errors } = parseTranslationFile(filePath);
                        
                        if (errors.length > 0) {
                            context.report({
                                loc: { line: 1, column: 0 },
                                message: `Error parsing ${filePath}: ${errors.join(', ')}`,
                            });
                            continue;
                        }

                        // Check for duplicates within this file
                        const keyCount = new Map();
                        for (const key of keys) {
                            keyCount.set(key, (keyCount.get(key) || 0) + 1);
                        }

                        // Report duplicates within this file
                        for (const [key, count] of keyCount.entries()) {
                            if (count > 1) {
                                context.report({
                                    loc: { line: 1, column: 0 },
                                    messageId: 'duplicateKey',
                                    data: {
                                        key: `${key} (in ${filePath})`,
                                    },
                                });
                            }
                        }
                    }
                };

                // Run the check
                findDuplicateKeys();

                return {};
            },
        },
    },
};
