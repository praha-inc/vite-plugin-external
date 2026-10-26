export type MaybeArray<T> = T | Array<T>;

export type PackageJson = {
  name: string;
  version: string;
  dependencies?: Record<string, string> | undefined;
  peerDependencies?: Record<string, string> | undefined;
  optionalDependencies?: Record<string, string> | undefined;
};
