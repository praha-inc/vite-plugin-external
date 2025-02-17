"use strict";
const __rslib_import_meta_url__ = /*#__PURE__*/ function() {
    return 'undefined' == typeof document ? new (require('url'.replace('', ''))).URL('file:' + __filename).href : document.currentScript && document.currentScript.src || new URL('main.js', document.baseURI).href;
}();
var __webpack_require__ = {};
(()=>{
    __webpack_require__.n = function(module) {
        var getter = module && module.__esModule ? function() {
            return module['default'];
        } : function() {
            return module;
        };
        __webpack_require__.d(getter, {
            a: getter
        });
        return getter;
    };
})();
(()=>{
    __webpack_require__.d = function(exports1, definition) {
        for(var key in definition)if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports1, key)) Object.defineProperty(exports1, key, {
            enumerable: true,
            get: definition[key]
        });
    };
})();
(()=>{
    __webpack_require__.o = function(obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop);
    };
})();
(()=>{
    __webpack_require__.r = function(exports1) {
        if ('undefined' != typeof Symbol && Symbol.toStringTag) Object.defineProperty(exports1, Symbol.toStringTag, {
            value: 'Module'
        });
        Object.defineProperty(exports1, '__esModule', {
            value: true
        });
    };
})();
var __webpack_exports__ = {};
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
    externalPlugin: ()=>externalPlugin
});
const external_node_module_namespaceObject = require("node:module");
const external_node_path_namespaceObject = require("node:path");
var external_node_path_default = /*#__PURE__*/ __webpack_require__.n(external_node_path_namespaceObject);
const external_find_up_namespaceObject = require("find-up");
const read_package_json_cjs_namespaceObject = require("./helpers/read-package-json.cjs");
const src_rslib_entry_require = (0, external_node_module_namespaceObject.createRequire)(__rslib_import_meta_url__);
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
            const packageJsonPath = await (0, external_find_up_namespaceObject.findUp)('package.json', {
                type: 'file'
            });
            if (!packageJsonPath) return;
            const packageJson = (0, read_package_json_cjs_namespaceObject.readPackageJson)(packageJsonPath);
            dependencies['__root__'] = Object.keys(packageJson.dependencies || {}).map((dependency)=>new RegExp(`^${dependency}(?:/.+)?$`));
        },
        resolveId: async (source, _, { isEntry })=>{
            if (isEntry || /^(?:\0|\.{1,2}\/)/.test(source) || external_node_path_default().isAbsolute(source)) return null;
            if ((0, external_node_module_namespaceObject.isBuiltin)(source)) return false;
            if (isExcluded(source)) {
                if (source in dependencies) return null;
                const packageJsonPath = await (0, external_find_up_namespaceObject.findUp)('package.json', {
                    type: 'file',
                    cwd: external_node_path_default().dirname(src_rslib_entry_require.resolve(source))
                });
                if (!packageJsonPath) return null;
                const packageJson = (0, read_package_json_cjs_namespaceObject.readPackageJson)(packageJsonPath);
                dependencies[source] = Object.keys(packageJson.dependencies || {}).map((dependency)=>new RegExp(`^${dependency}(?:/.+)?$`));
                return null;
            }
            return isIncluded(source) ? false : null;
        }
    };
};
var __webpack_export_target__ = exports;
for(var __webpack_i__ in __webpack_exports__)__webpack_export_target__[__webpack_i__] = __webpack_exports__[__webpack_i__];
if (__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, '__esModule', {
    value: true
});
