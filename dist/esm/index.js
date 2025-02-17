import * as __WEBPACK_EXTERNAL_MODULE_node_module_ab9f2194__ from "node:module";
import * as __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__ from "node:path";
import * as __WEBPACK_EXTERNAL_MODULE_find_up_69e9ea2b__ from "find-up";
import * as __WEBPACK_EXTERNAL_MODULE__helpers_read_package_json_js_65f36b6d__ from "./helpers/read-package-json.js";
const src_rslib_entry_require = (0, __WEBPACK_EXTERNAL_MODULE_node_module_ab9f2194__.createRequire)(import.meta.url);
const src_rslib_entry_packageJson = src_rslib_entry_require('#package.json');
const externalPlugin = (options = {})=>{
    const dependencies = {};
    const include = options.include ? Array.isArray(options.include) ? options.include : [
        options.include
    ] : [];
    const isIncluded = (id)=>include.some((value)=>'string' == typeof value ? value === id : value.test(id)) || Object.values(dependencies).some((values)=>values.some((value)=>value.test(id)));
    const exclude = options.exclude ? Array.isArray(options.exclude) ? options.exclude : [
        options.exclude
    ] : [];
    const isExcluded = (id)=>exclude.some((value)=>'string' == typeof value ? value === id : value.test(id));
    return {
        name: src_rslib_entry_packageJson.name,
        version: src_rslib_entry_packageJson.version,
        enforce: 'pre',
        buildStart: async ()=>{
            const packageJsonPath = await (0, __WEBPACK_EXTERNAL_MODULE_find_up_69e9ea2b__.findUp)('package.json', {
                type: 'file'
            });
            if (!packageJsonPath) return;
            const packageJson = (0, __WEBPACK_EXTERNAL_MODULE__helpers_read_package_json_js_65f36b6d__.readPackageJson)(packageJsonPath);
            dependencies['__root__'] = Object.keys(packageJson.dependencies || {}).map((dependency)=>new RegExp(`^${dependency}(?:/.+)?$`));
        },
        resolveId: async (source, _, { isEntry })=>{
            if (isEntry || /^(?:\0|\.{1,2}\/)/.test(source) || __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__["default"].isAbsolute(source)) return null;
            if ((0, __WEBPACK_EXTERNAL_MODULE_node_module_ab9f2194__.isBuiltin)(source)) return false;
            if (isExcluded(source)) {
                if (source in dependencies) return null;
                const packageJsonPath = await (0, __WEBPACK_EXTERNAL_MODULE_find_up_69e9ea2b__.findUp)('package.json', {
                    type: 'file',
                    cwd: __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__["default"].dirname(src_rslib_entry_require.resolve(source))
                });
                if (!packageJsonPath) return null;
                const packageJson = (0, __WEBPACK_EXTERNAL_MODULE__helpers_read_package_json_js_65f36b6d__.readPackageJson)(packageJsonPath);
                dependencies[source] = Object.keys(packageJson.dependencies || {}).map((dependency)=>new RegExp(`^${dependency}(?:/.+)?$`));
                return null;
            }
            return isIncluded(source) ? false : null;
        }
    };
};
export { externalPlugin };
