import type { PackageJson } from '../types';

export const createDependenciesRegex = (packageJson: PackageJson): RegExp | undefined => {
  if (!packageJson.dependencies) return;
  return new RegExp(`^(${Object.keys(packageJson.dependencies).join('|')})(?:/.+)?$`);
};
