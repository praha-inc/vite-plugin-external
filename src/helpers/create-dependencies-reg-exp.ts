import type { PackageJson } from '../types';

export const createDependenciesRegExp = (packageJson: PackageJson): RegExp | undefined => {
  const names = [
    ...Object.keys(packageJson.dependencies ?? {}),
    ...Object.keys(packageJson.peerDependencies ?? {}),
    ...Object.keys(packageJson.optionalDependencies ?? {}),
  ];
  if (names.length === 0) return;
  return new RegExp(`^(${names.join('|')})(?:/.+)?$`);
};
