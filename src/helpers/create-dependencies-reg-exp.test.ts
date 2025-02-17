import { describe, expect, it } from 'vitest';

import { createDependenciesRegExp } from './create-dependencies-reg-exp';

import type { PackageJson } from '../types';

describe('createDependenciesRegExp', () => {
  const basePackageJson: PackageJson = {
    name: 'test',
    version: '1.0.0',
  };

  it('should return undefined if packageJson has no dependencies', () => {
    expect(createDependenciesRegExp(basePackageJson)).toBeUndefined();
  });

  it('should return a regex that matches dependencies', () => {
    const packageJson: PackageJson = {
      ...basePackageJson,
      dependencies: {
        dep1: '1.0.0',
        dep2: '2.0.0',
      },
    };

    const regex = createDependenciesRegExp(packageJson);

    expect(regex).toBeInstanceOf(RegExp);
    expect(regex!.test('dep1')).toBe(true);
    expect(regex!.test('dep2')).toBe(true);
    expect(regex!.test('dep1/subpath')).toBe(true);
    expect(regex!.test('dep2/subpath')).toBe(true);
  });

  it('should return a regex that does not match other dependencies', () => {
    const packageJson: PackageJson = {
      ...basePackageJson,
      dependencies: {
        dep1: '1.0.0',
      },
    };

    const regex = createDependenciesRegExp(packageJson);

    expect(regex).toBeInstanceOf(RegExp);
    expect(regex!.test('dep2')).toBe(false);
    expect(regex!.test('dep3')).toBe(false);
  });
});
