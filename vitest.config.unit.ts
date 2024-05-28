import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['./tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      exclude: [
        'src/index.ts',
        'src/libs/**',
        '**/.{eslint,mocha,prettier}rc.{?(c|m)js,yml}',
      ],
    },
  },
})
