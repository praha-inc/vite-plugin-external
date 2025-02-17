import fs from 'node:fs';

import type { PackageJson } from '../types';

export const readPackageJson = (path: string): PackageJson => {
  return JSON.parse(fs.readFileSync(path, { encoding: 'utf8' })) as PackageJson;
};
