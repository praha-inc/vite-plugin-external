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

  it('should return a regex that matches peerDependencies and optionalDependencies', () => {
    const packageJson: PackageJson = {
      ...basePackageJson,
      peerDependencies: { peer1: '1.0.0' },
      optionalDependencies: { optional1: '1.0.0' },
    };

    const regex = createDependenciesRegExp(packageJson);

    expect(regex!.test('peer1')).toBe(true);
    expect(regex!.test('optional1/subpath')).toBe(true);
    expect(regex!.test('other')).toBe(false);
  });

  it('should not duplicate names listed in multiple dependency fields', () => {
    const packageJson: PackageJson = {
      ...basePackageJson,
      dependencies: { dep1: '1.0.0' },
      peerDependencies: { dep1: '1.0.0', peer1: '1.0.0' },
      optionalDependencies: { peer1: '1.0.0' },
    };

    const regex = createDependenciesRegExp(packageJson);

    expect(regex!.source).toBe(String.raw`^(${RegExp.escape('dep1')}|${RegExp.escape('peer1')})(?:\/.+)?$`);
  });

  it('should match package names containing special characters literally', () => {
    const packageJson: PackageJson = {
      ...basePackageJson,
      dependencies: {
        'lodash.get': '1.0.0',
        'c++': '1.0.0',
      },
    };

    const regex = createDependenciesRegExp(packageJson);

    expect(regex!.test('lodash.get')).toBe(true);
    expect(regex!.test('lodash.get/subpath')).toBe(true);
    expect(regex!.test('lodashXget')).toBe(false);
    expect(regex!.test('c++')).toBe(true);
    expect(regex!.test('c')).toBe(false);
  });
});
