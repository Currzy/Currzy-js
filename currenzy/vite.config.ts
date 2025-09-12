import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [tsconfigPaths()],
    build: {
        lib: {
            entry: 'src/index.ts',
            name: 'Currenzy',
            fileName: (format) => `currenzy.${format}.js`,
            formats: ['es', 'cjs']
        },
        rollupOptions: {
            external: ['fast-xml-parser', 'ofetch']
        }
    },
    test: {
        globals: true,
        environment: 'node',
        include: ['tests/**/*.test.ts'],
        alias: {
            '@src': '/src'
        },
    },
});
