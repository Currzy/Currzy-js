import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/index.ts'],
    outDir: 'dist',
    format: ['esm', 'cjs'],
    target: 'es2020',
    clean: true,
    sourcemap: true,
    dts: true,
    splitting: false,
    external: ['fast-xml-parser', 'ofetch'],
})
