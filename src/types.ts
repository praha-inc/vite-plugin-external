export type MaybeArray<T> = T | Array<T>;

export type PackageJson = {
  name: string;
  version: string;
  dependencies?: Record<string, string> | undefined;
};
