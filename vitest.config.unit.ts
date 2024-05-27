import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['./tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
    },
  },
  plugins: [tsconfigPaths()],
})
