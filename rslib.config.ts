import { defineConfig } from '@rslib/core';

export default defineConfig({
  source: {
    entry: {
      index: [
        './src/**',
        '!**/*.test.*',
      ],
    },
    tsconfigPath: './tsconfig.build.json',
  },
  lib: [
    {
      format: 'cjs',
      bundle: false,
      dts: {
        distPath: './dist/cjs',
      },
      output: {
        distPath: {
          root: './dist/cjs',
        },
      },
    },
    {
      format: 'esm',
      bundle: false,
      dts: {
        distPath: './dist/esm',
      },
      output: {
        distPath: {
          root: './dist/esm',
        },
      },
    },
  ],
});
