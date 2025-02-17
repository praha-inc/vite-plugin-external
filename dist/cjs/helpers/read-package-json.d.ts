export type PackageJson = {
    name: string;
    version: string;
    dependencies?: Record<string, string> | undefined;
};
export declare const readPackageJson: (path: string) => PackageJson;
