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
  output: {
    // NOTE: This is a workaround for the following issue.
    // @see: https://github.com/web-infra-dev/rslib/issues/759
    externals: [
      'find-up',
    ],
  },
  lib: [
    {
      format: 'cjs',
      bundle: false,
      dts: true,
      output: {
        distPath: {
          root: './dist/cjs',
        },
      },
    },
    {
      format: 'esm',
      bundle: false,
      dts: true,
      output: {
        distPath: {
          root: './dist/esm',
        },
      },
    },
  ],
});
