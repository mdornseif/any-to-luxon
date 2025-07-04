import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: false,
    watch: false,
    run: true,
    testTimeout: process.env.CI ? 10000 : 5000, // Longer timeout in CI
    hookTimeout: process.env.CI ? 10000 : 5000,
    teardownTimeout: process.env.CI ? 10000 : 5000,
    coverage: {
      provider: 'v8',
      reporter: process.env.CI ? ['text', 'json'] : ['text'],
      exclude: [
        'node_modules/',
        'test/',
        'dist/',
        '**/*.d.ts',
        '**/*.config.ts',
        '**/*.config.js',
      ],
      thresholds: {
        global: {
          branches: 95,
          functions: 95,
          lines: 95,
          statements: 95,
        },
      },
    },
  },
})