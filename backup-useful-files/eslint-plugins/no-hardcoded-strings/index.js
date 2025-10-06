module.exports = {
    rules: {
        'no-hardcoded-strings': {
            meta: {
                type: 'problem',
                docs: {
                    description: 'Disallow hardcoded strings in favor of i18n or constants',
                    category: 'Best Practices',
                    recommended: false,
                },
                messages: {
                    hardcodedString:
                        'Avoid hardcoded strings. Use i18n translation keys or constants instead.',
                },
                schema: [
                    {
                        type: 'object',
                        properties: {
                            allow: {
                                type: 'array',
                                items: { type: 'string' },
                                description: 'Array of strings that are allowed to be hardcoded',
                            },
                            ignorePatterns: {
                                type: 'array',
                                items: { type: 'string' },
                                description: 'Array of regex patterns to ignore',
                            },
                        },
                        additionalProperties: false,
                    },
                ],
            },
            create(context) {
                const options = context.options[0] || {};
                const allowedStrings = options.allow || [];
                const ignorePatterns = options.ignorePatterns || [];

                // Common strings that are usually safe to hardcode
                const safeStrings = [
                    '', // Empty string
                    ' ', // Single space
                    '\n', // Newline
                    '\t', // Tab
                    '0',
                    '1',
                    '2',
                    '3',
                    '4',
                    '5',
                    '6',
                    '7',
                    '8',
                    '9', // Single digits
                    'true',
                    'false',
                    'null',
                    'undefined', // Boolean/null values
                    'GET',
                    'POST',
                    'PUT',
                    'DELETE',
                    'PATCH', // HTTP methods
                    'application/json',
                    'text/plain',
                    'text/html', // MIME types
                    'utf-8',
                    'utf8',
                    'ascii', // Encodings
                    'localhost',
                    '127.0.0.1', // Local addresses
                    'Bearer',
                    'Basic', // Auth types
                    'Authorization',
                    'Content-Type',
                    'Accept', // Common headers
                    // Design tokens
                    'Inter',
                    'Poppins',
                    'Roboto',
                    'Arial',
                    'Helvetica',
                    'sans-serif', // Fonts
                    '#',
                    'rgb',
                    'rgba',
                    'hsl',
                    'hsla', // Color functions
                    'px',
                    'em',
                    'rem',
                    '%',
                    'vh',
                    'vw', // CSS units
                    'solid',
                    'dashed',
                    'dotted',
                    'none', // CSS values
                    'center',
                    'left',
                    'right',
                    'top',
                    'bottom', // CSS positions
                    'flex',
                    'grid',
                    'block',
                    'inline',
                    'none', // CSS display
                    'row',
                    'column',
                    'wrap',
                    'nowrap', // CSS flexbox
                    'start',
                    'end',
                    'stretch',
                    'baseline', // CSS alignment
                    'auto',
                    'inherit',
                    'initial',
                    'unset', // CSS keywords
                    'normal',
                    'bold',
                    'italic',
                    'underline', // CSS text
                    'visible',
                    'hidden',
                    'scroll',
                    'auto', // CSS overflow
                    'static',
                    'relative',
                    'absolute',
                    'fixed',
                    'sticky', // CSS position
                    'transparent',
                    'currentColor',
                    'inherit', // CSS colors
                    'serif',
                    'monospace',
                    'cursive',
                    'fantasy', // CSS font families
                    'small',
                    'medium',
                    'large',
                    'x-large',
                    'xx-large', // CSS font sizes
                    'thin',
                    'normal',
                    'thick', // CSS border width
                    'none',
                    'hidden',
                    'dotted',
                    'dashed',
                    'solid',
                    'double',
                    'groove',
                    'ridge',
                    'inset',
                    'outset', // CSS border style
                ];

                const isAllowedString = (str) => {
                    // Check if string is in allowed list
                    if (allowedStrings.includes(str)) return true;

                    // Check if string is in safe strings
                    if (safeStrings.includes(str)) return true;

                    // Check against ignore patterns
                    return ignorePatterns.some((pattern) => {
                        const regex = new RegExp(pattern);
                        return regex.test(str);
                    });
                };

                const path = require('path');
                const isInTestFile = (filename) => {
                    const basename = path.basename(filename);
                    const dirname = filename.split(path.sep);
                    // Match files ending with .test.js, .test.ts, .spec.js, .spec.ts, etc.
                    const testFileRegex = /\.(test|spec)\.[jt]sx?$/;
                    if (testFileRegex.test(basename)) return true;
                    // Check if any directory in the path is __tests__ or tests
                    if (dirname.includes('__tests__') || dirname.includes('tests')) return true;
                    return false;
                };

                const isInConfigFile = (filename) => {
                    return (
                        filename.includes('config') ||
                        filename.includes('.config.') ||
                        filename.includes('eslint') ||
                        filename.includes('vite') ||
                        filename.includes('tsconfig')
                    );
                };

                return {
                    Literal(node) {
                        // Only check string literals
                        if (typeof node.value !== 'string') return;

                        const filename = context.getFilename();

                        // Skip test files
                        if (isInTestFile(filename)) return;

                        // Skip config files
                        if (isInConfigFile(filename)) return;

                        // Skip if string is allowed
                        if (isAllowedString(node.value)) return;

                        // Skip very short strings (likely identifiers)
                        if (node.value.length <= 2) return;

                        // Skip strings that look like identifiers or technical values
                        if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(node.value)) return;

                        // Skip strings that are clearly technical (contain special chars)
                        if (/^[^a-zA-Z]*$/.test(node.value)) return;

                        // Skip strings that are clearly not user-facing
                        if (node.value.includes('__') || node.value.includes('--')) return;

                        // Skip color values (hex, rgb, hsl, etc.)
                        if (/^#[0-9a-fA-F]{3,8}$/.test(node.value)) return;
                        if (/^rgb\(/.test(node.value)) return;
                        if (/^rgba\(/.test(node.value)) return;
                        if (/^hsl\(/.test(node.value)) return;
                        if (/^hsla\(/.test(node.value)) return;

                        // Skip CSS values with units
                        if (/^\d+(\.\d+)?(px|em|rem|%|vh|vw|pt|pc|in|cm|mm|ex|ch|vmin|vmax)$/.test(node.value))
                            return;

                        // Skip technical strings (containing only technical characters)
                        if (/^[a-zA-Z0-9._-]+$/.test(node.value) && node.value.length <= 20) return;

                        // Skip strings that are clearly CSS/technical values
                        if (
                            /^(inherit|initial|unset|auto|none|normal|bold|italic|underline|overline|line-through)$/.test(
                                node.value
                            )
                        )
                            return;

                        // Check if parent is a JSX attribute (likely user-facing)
                        const parent = node.parent;
                        if (parent && parent.type === 'JSXAttribute') {
                            // Allow certain JSX attributes that are technical
                            const allowedJSXAttrs = ['className', 'id', 'key', 'ref', 'type', 'name', 'value'];
                            if (allowedJSXAttrs.includes(parent.name.name)) return;

                            context.report({
                                node,
                                messageId: 'hardcodedString',
                                data: {
                                    string: node.value,
                                },
                            });
                            return;
                        }

                        // Check if parent is a function call (likely user-facing)
                        if (parent && parent.type === 'CallExpression') {
                            const callee = parent.callee;

                            // Allow certain function calls
                            if (callee.type === 'MemberExpression') {
                                const methodName = callee.property.name;
                                const allowedMethods = ['log', 'warn', 'error', 'info', 'debug'];
                                if (allowedMethods.includes(methodName)) return;
                            }

                            // Allow t() calls (i18n)
                            if (callee.name === 't') return;

                            context.report({
                                node,
                                messageId: 'hardcodedString',
                                data: {
                                    string: node.value,
                                },
                            });
                            return;
                        }

                        // Check if parent is an object property (likely user-facing)
                        if (parent && parent.type === 'Property') {
                            context.report({
                                node,
                                messageId: 'hardcodedString',
                                data: {
                                    string: node.value,
                                },
                            });
                            return;
                        }
                    },
                };
            },
        },
    },
};
