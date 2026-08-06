import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  plugins: [
      vue(),
      AutoImport({
        dts: 'src/auto-imports.d.ts',

        imports: [
          'vue',
          'vue-router',
          'pinia',
        ],

        dirs: [
          'src/typings',
        ],
      }),
  ],
  publicDir: 'public',
  base: './',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '0.0.0.0',
    port: 6363
  }
})
