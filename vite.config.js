import { resolve } from 'path'
import { defineConfig } from 'vite'
export default defineConfig({
  build: {
    outDir: 'lib',
    minify: false,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'watone-ai-sdk',
      fileName: (format) => `index.${format}.js`,
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: [], // 在这里列出外部依赖
      output: {
        preserveModules: true,
        exports: 'named'
      }
    },
  },
  plugins: [
  ],
})