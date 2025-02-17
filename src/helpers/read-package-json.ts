import fs from 'node:fs';

export type PackageJson = {
  name: string;
  version: string;
  dependencies?: Record<string, string> | undefined;
};

export const readPackageJson = (path: string): PackageJson => {
  return JSON.parse(fs.readFileSync(path, { encoding: 'utf8' })) as PackageJson;
};
