import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['tests/unit/**/*.test.ts', 'tests/integration/**/*.test.tsx'],
    setupFiles: ['tests/setup.ts'],
    css: false
  }
});
