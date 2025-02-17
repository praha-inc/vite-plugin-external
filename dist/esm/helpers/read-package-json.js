import * as __WEBPACK_EXTERNAL_MODULE_node_fs_5ea92f0c__ from "node:fs";
const readPackageJson = (path)=>JSON.parse(__WEBPACK_EXTERNAL_MODULE_node_fs_5ea92f0c__["default"].readFileSync(path, {
        encoding: 'utf8'
    }));
export { readPackageJson };
