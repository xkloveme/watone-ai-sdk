import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000
  },
  build: {
    outDir: 'lib',
    minify: false,
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
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
})