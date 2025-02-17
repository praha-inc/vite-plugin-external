import { createRequire, isBuiltin } from 'node:module';
import path from 'node:path';

import { findUp } from 'find-up';

import { readPackageJson } from './helpers/read-package-json';

import type { PackageJson } from './helpers/read-package-json';
import type { Plugin } from 'vite';

type MaybeArray<T> = T | Array<T>;

const require = createRequire(import.meta.url);
const packageJson = require('#package.json') as PackageJson;

export type ExternalPluginOptions = {
  include?: MaybeArray<string | RegExp> | undefined;
  exclude?: MaybeArray<string | RegExp> | undefined;
};

export const externalPlugin = (options: ExternalPluginOptions = {}): Plugin => {
  const dependencies: Record<string, RegExp[]> = {};

  const include = options.include ? (Array.isArray(options.include) ? options.include : [options.include]) : [];
  const isIncluded = (id: string) => {
    return (
      include.some((value) => typeof value === 'string' ? value === id : value.test(id))
      || Object.values(dependencies).some((values) => values.some((value) => value.test(id)))
    );
  };

  const exclude = options.exclude ? (Array.isArray(options.exclude) ? options.exclude : [options.exclude]) : [];
  const isExcluded = (id: string) => {
    return exclude.some((value) => typeof value === 'string' ? value === id : value.test(id));
  };

  return {
    name: packageJson.name,
    version: packageJson.version,
    enforce: 'pre',
    buildStart: async () => {
      const packageJsonPath = await findUp('package.json', { type: 'file' });
      if (!packageJsonPath) return;

      const packageJson = readPackageJson(packageJsonPath);
      dependencies['__root__'] = Object.keys(packageJson.dependencies || {}).map((dependency) => new RegExp(`^${dependency}(?:/.+)?$`));
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

        const packageJsonPath = await findUp('package.json', { type: 'file', cwd: path.dirname(require.resolve(source)) });
        if (!packageJsonPath) return null;

        const packageJson = readPackageJson(packageJsonPath);
        dependencies[source] = Object.keys(packageJson.dependencies || {}).map((dependency) => new RegExp(`^${dependency}(?:/.+)?$`));
        return null;
      }

      return isIncluded(source) ? false : null;
    },
  };
};
