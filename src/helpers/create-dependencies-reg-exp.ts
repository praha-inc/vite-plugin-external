import type { PackageJson } from '../types';

export const createDependenciesRegExp = (packageJson: PackageJson): RegExp | undefined => {
  const names = new Set([
    ...Object.keys(packageJson.dependencies ?? {}),
    ...Object.keys(packageJson.peerDependencies ?? {}),
    ...Object.keys(packageJson.optionalDependencies ?? {}),
  ]);
  if (names.size <= 0) return;
  return new RegExp(`^(${Array.from(names).join('|')})(?:/.+)?$`);
};
