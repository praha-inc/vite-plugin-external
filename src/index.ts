import { createRequire, isBuiltin } from 'node:module';
import path from 'node:path';

import { createDependenciesRegex } from './helpers/create-dependencies-regex';
import { findPackageJsonPath } from './helpers/find-package-json-path';
import { readPackageJson } from './helpers/read-package-json';
import { toArray } from './helpers/to-array';

import type { MaybeArray, PackageJson } from './types';
import type { Plugin } from 'vite';

const require = createRequire(import.meta.url);
const packageJson = require('#package.json') as PackageJson;

export type ExternalPluginOptions = {
  include?: MaybeArray<string | RegExp> | undefined;
  exclude?: MaybeArray<string | RegExp> | undefined;
};

export const externalPlugin = (options: ExternalPluginOptions = {}): Plugin => {
  const dependencies: Record<string, RegExp | undefined> = {};

  const include = toArray(options.include);
  const isIncluded = (id: string) => {
    return (
      include.some((value) => typeof value === 'string' ? value === id : value.test(id))
      || Object.values(dependencies).some((value) => value?.test(id))
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
    buildStart: async () => {
      const packageJsonPath = await findPackageJsonPath();
      if (!packageJsonPath) return;

      dependencies['__root__'] = createDependenciesRegex(readPackageJson(packageJsonPath));
    },
    resolveId: async (source, _, { isEntry }) => {
      if (
        isEntry
        || /^(?:\0|\.{1,2}\/)/.test(source)
        || path.isAbsolute(source)
      ) {
        return null;
      }

      if (isBuiltin(source)) return false;

      if (isExcluded(source)) {
        if (source in dependencies) return null;

        const packageJsonPath = await findPackageJsonPath(path.dirname(require.resolve(source)));
        if (!packageJsonPath) return null;

        dependencies[source] = createDependenciesRegex(readPackageJson(packageJsonPath));
        return null;
      }

      return isIncluded(source) ? false : null;
    },
  };
};
