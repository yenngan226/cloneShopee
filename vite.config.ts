import { defineConfig } from 'vite'
import type { InlineConfig } from 'vitest'
import type { UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

interface VitestConfigExport extends UserConfig {
  test: InlineConfig
}
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), visualizer()],
  server: {
    port: 3000
  },
  css: {
    devSourcemap: true
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src')
    }
  },
  test: {
    environment: 'jsdom'
  }
} as VitestConfigExport)
