import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

const config = defineConfig(() => {
  const alias = {
    '~/': new URL('./src/', import.meta.url).pathname, 
  }
  
  return {
    test: {
      projects: [
        {
          plugins: [tsconfigPaths()],
          test: {
            alias,
            include: ['src/server/**/*.test.ts'],
            environment: 'node',
            name: 'server',
          }
        },
        {
          plugins: [tsconfigPaths(), react()],
          test: { 
            alias,
            include: ['src/app/**/*.test.{ts,tsx}'],
            environment: 'jsdom',
            name: 'app',
            setupFiles: ['./vitest.react.setup.ts'],
          }
        }
      ],
    },
  }
})

export default config;