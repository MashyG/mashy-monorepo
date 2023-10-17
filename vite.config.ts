/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  define: {
    'import.meta.vitest': 'undefined'
  },
  test: {
    includeSource: ['packages/**/*.{js,ts}']
  }
})
