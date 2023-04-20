import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { terser } from 'rollup-plugin-terser' // 消除console

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    rollupOptions: {
      plugins: [
        terser({
          compress: {
            drop_console: true,
          },
        }),
      ],
    },
  },
})
