import { defineConfig } from 'tsup'

export default defineConfig([
    {
        entry: ['src/index.ts'],
        outDir: 'dist',
        format: ['esm', 'cjs'],
        target: 'es2020',
        clean: true,
        sourcemap: true,
        dts: true,
        splitting: false,
        external: ['fast-xml-parser', 'ofetch'],
    },
    {
        entry: ['src/index.ts'],
        outDir: 'dist',
        format: ['iife'],
        globalName: 'Currenzy',
        minify: true,
        sourcemap: false,
        dts: false,
        splitting: false,
        external: [],
    },
])
