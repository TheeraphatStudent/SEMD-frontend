import { defineConfig } from 'orval';

export default defineConfig({
  semd: {
    input: {
      target: '../semd-backend/openapi.yaml',
    },
    output: {
      mode: 'split',
      target: './src/services/generated',
      schemas: './src/services/generated/models',
      client: 'axios',
      mock: false,
      clean: true,
      prettier: true,
      override: {
        mutator: {
          path: './src/lib/axios-instance.ts',
          name: 'axiosInstance',
        },
      },
    },
  },
});
