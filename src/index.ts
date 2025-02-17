import fs from 'node:fs';
import { createRequire, isBuiltin } from 'node:module';
import path from 'node:path';

import { createDependenciesRegExp } from './helpers/create-dependencies-reg-exp';
import { readPackageJson } from './helpers/read-package-json';
import { toArray } from './helpers/to-array';

import type { MaybeArray, PackageJson } from './types';
import type { Plugin } from 'vite';

const require = createRequire(import.meta.url);
const packageJson = require('#package.json') as PackageJson;

export type ExternalPluginOptions = {
  packageJsonPath?: string | undefined;
  include?: MaybeArray<string | RegExp> | undefined;
  exclude?: MaybeArray<string | RegExp> | undefined;
};

export const externalPlugin = (options: ExternalPluginOptions = {}): Plugin => {
  let dependenciesRegExp: RegExp | undefined;

  const include = toArray(options.include);
  const isIncluded = (id: string) => {
    return (
      include.some((value) => typeof value === 'string' ? value === id : value.test(id))
      || dependenciesRegExp?.test(id)
    );
  };

  const exclude = toArray(options.exclude);
  const isExcluded = (id: string) => {
    return exclude.some((value) => typeof value === 'string' ? value === id : value.test(id));
  };

  return {
    name: packageJson.name,
    version: packageJson.version,
    enforce: 'pre',
    buildStart: () => {
      const packageJsonPath = options.packageJsonPath ?? path.resolve(process.cwd(), 'package.json');
      if (!fs.existsSync(packageJsonPath)) {
        console.warn(`The package.json file was not found at "${packageJsonPath}".`);
        return;
      }
      dependenciesRegExp = createDependenciesRegExp(readPackageJson(packageJsonPath));
    },
    resolveId: (source, _, { isEntry }) => {
      if (
        isEntry
        || /^(?:\0|\.{1,2}\/)/.test(source)
        || path.isAbsolute(source)
      ) {
        return null;
      }

      if (isBuiltin(source)) return false;
      if (isExcluded(source)) return null;
      return isIncluded(source) ? false : null;
    },
  };
};
