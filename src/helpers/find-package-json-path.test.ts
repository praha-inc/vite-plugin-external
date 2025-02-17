import { vol } from 'memfs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { findPackageJsonPath } from './find-package-json-path';

import type fs from 'node:fs';

vi.mock('node:fs', async () => {
  const memfs: { fs: typeof fs } = await vi.importActual('memfs');

  return {
    default: memfs.fs,
    ...memfs.fs,
  };
});

describe('findPackageJsonPath', () => {
  beforeEach(() => {
    vol.reset();
  });

  it('should return the path of package.json if it exists in the current directory', async () => {
    vol.fromJSON({
      '/project/package.json': '',
    });

    const result = await findPackageJsonPath('/project');
    expect(result).toBe('/project/package.json');
  });

  it('should return the path of package.json if it exists in a parent directory', async () => {
    vol.fromJSON({
      '/project/package.json': '',
      '/project/src/README.md': '',
    });

    const result = await findPackageJsonPath('/project/src');
    expect(result).toBe('/project/package.json');
  });

  it('should return undefined if package.json is not found', async () => {
    vol.fromJSON({
      '/project/other.txt': '',
    });

    const result = await findPackageJsonPath('/project');
    expect(result).toBeUndefined();
  });
});
