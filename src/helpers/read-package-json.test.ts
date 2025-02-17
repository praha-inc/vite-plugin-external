import { vol } from 'memfs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { readPackageJson } from './read-package-json';

import type fs from 'node:fs';

vi.mock('node:fs', async () => {
  const memfs: { fs: typeof fs } = await vi.importActual('memfs');

  return {
    default: memfs.fs,
    ...memfs.fs,
  };
});

describe('readPackageJson', () => {
  beforeEach(() => {
    vol.reset();
  });

  it('should return the parsed package.json', async () => {
    vol.fromJSON({
      './package.json': '{"name": "test", "version": "1.0.0", "dependencies": { "dep": "1.0.0" } }',
    });

    const result = readPackageJson('./package.json');

    expect(result).toEqual({
      name: 'test',
      version: '1.0.0',
      dependencies: {
        dep: '1.0.0',
      },
    });
  });
});
