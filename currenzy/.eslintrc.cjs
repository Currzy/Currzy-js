module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2024,
        sourceType: "module",
    },
    plugins: ['@typescript-eslint', 'prettier'],
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
    rules: {
        'prettier/prettier': 'error',
    },
    overrides: [
        {
            files: ["tests/**/*.ts"],
            rules: {
                "import/no-relative-parent-imports": "off"
            }
        }
    ],
    settings: {
        'import/resolver': {
            typescript: {
                alwaysTryTypes: true,
                project: './tsconfig.json',
            },
        },
    },
};
