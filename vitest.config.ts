import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    mockReset: true,
    clearMocks: true,
    restoreMocks: true,
    server: {
      deps: {
        inline: [
          'find-up',
          'locate-path',
        ],
      },
    },
  },
});
