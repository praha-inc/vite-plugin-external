import path from 'node:path';

import { vol } from 'memfs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { externalPlugin } from './index';

import type fs from 'node:fs';

vi.mock('node:fs', async () => {
  const memfs: { fs: typeof fs } = await vi.importActual('memfs');

  return {
    default: memfs.fs,
    ...memfs.fs,
  };
});

describe('externalPlugin', () => {
  beforeEach(() => {
    vol.reset();
  });

  it('should have correct plugin properties', () => {
    const plugin = externalPlugin();

    expect(plugin.name).toBeDefined();
    expect(plugin.version).toBeDefined();
    expect(plugin.enforce).toBe('pre');
  });

  it('should not externalize relative path', async () => {
    const plugin = externalPlugin();

    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await plugin.resolveId('./relative/path', undefined, { isEntry: false });

    expect(result).toBeNull();
  });

  it('should not externalize absolute path', async () => {
    const plugin = externalPlugin();

    const absolutePath = path.resolve('absolute/path');
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await plugin.resolveId(absolutePath, undefined, { isEntry: false });

    expect(result).toBeNull();
  });

  it('should not externalize entry point', async () => {
    const plugin = externalPlugin();

    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await plugin.resolveId('some-package', undefined, { isEntry: true });

    expect(result).toBeNull();
  });

  it('should externalize Node.js built-in module', async () => {
    const plugin = externalPlugin();

    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await plugin.resolveId('node:fs', undefined, { isEntry: false });

    expect(result).toBe(false);
  });

  it('should externalize the package specified in the include', async () => {
    const plugin = externalPlugin({
      include: ['some-package'],
    });

    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await plugin.resolveId('some-package', undefined, { isEntry: false });

    expect(result).toBe(false);
  });

  it('should not externalize the package specified in the exclude', async () => {
    const plugin = externalPlugin({
      include: ['some-package'],
      exclude: ['some-package'],
    });

    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await plugin.resolveId!('some-lib', undefined, { isEntry: false });

    expect(result).toBeNull();
  });

  it('should not externalize the package not specified in the include', async () => {
    const plugin = externalPlugin();

    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await plugin.resolveId('some-package', undefined, { isEntry: false });

    expect(result).toBeNull();
  });

  it('should externalize the package specified in the dependencies', async () => {
    vol.fromJSON({ './package.json': JSON.stringify({ dependencies: { 'some-package': '1.0.0' } }) });
    const plugin = externalPlugin();

    // @ts-ignore
    await plugin.buildStart();
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await plugin.resolveId('some-package', undefined, { isEntry: false });

    expect(result).toBe(false);
  });
});
