import { defineConfig } from 'orval';

export default defineConfig({
  semd: {
    input: {
      target: '../SEMD-backend/openapi.yaml',
    },
    output: {
      mode: 'split',
      target: './src/services/generated',
      schemas: './src/services/generated/models',
      client: 'axios-functions',
      mock: false,
      clean: true,
      prettier: true,
      override: {
        mutator: {
          path: './src/lib/orval-mutator.ts',
          name: 'customInstance',
        },
      },
    },
  },
});
