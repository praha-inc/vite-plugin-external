import type { Plugin } from 'vite';
type MaybeArray<T> = T | Array<T>;
export type ExternalPluginOptions = {
    include?: MaybeArray<string | RegExp> | undefined;
    exclude?: MaybeArray<string | RegExp> | undefined;
};
export declare const externalPlugin: (options?: ExternalPluginOptions) => Plugin;
export {};
