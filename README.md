# @praha/vite-plugin-external

[![npm version](https://badge.fury.io/js/@praha%2Fvite-plugin-external.svg)](https://www.npmjs.com/package/@praha/vite-plugin-external)
[![npm download](https://img.shields.io/npm/dm/@praha/vite-plugin-external.svg)](https://www.npmjs.com/package/@praha/vite-plugin-external)
[![license](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/praha-inc/vite-plugin-external/blob/main/LICENSE)
[![Github](https://img.shields.io/github/followers/praha-inc?label=Follow&logo=github&style=social)](https://github.com/orgs/praha-inc/followers)

A Vite plugin that automatically excludes Node.js built-in modules and npm dependencies from the bundle.

## 👏 Getting Started

### Installation

```bash
npm install @praha/vite-plugin-external
```

### Usage

To use `@praha/vite-plugin-external`, import and add it to the plugins array in your Vite configuration file:

#### Basic Usage

By default, this plugin will exclude:

- Node.js built-in modules
- Dependencies listed in package.json

```ts
import { externalPlugin } from '@praha/vite-plugin-external';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    externalPlugin(),
  ],
});
```

#### With Options

You can customize the behavior of the plugin by passing an options object:

```ts
import { externalPlugin } from '@praha/vite-plugin-external';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    externalPlugin({
      packageJsonPath: './path/to/package.json', // Specify a custom package.json path
      include: ['some-package', /^@scoped\/.*$/], // Explicitly externalize specific packages
      exclude: ['some-lib'], // Do not externalize certain packages
    }),
  ],
});
```

#### Options

| Name              | Type                                              | Description                                                                          |
|-------------------|---------------------------------------------------|--------------------------------------------------------------------------------------|
| `packageJsonPath` | `string`                                          | Path to a custom `package.json` file. Defaults to the project's root `package.json`. |
| `include`         | `string` \| `RegExp` \| `Array<string \| RegExp>` | Packages to always externalize.                                                      |
| `exclude`         | `string` \| `RegExp` \| `Array<string \| RegExp>` | Packages to explicitly prevent from being externalized.                              |

## 🤝 Contributing

Contributions, issues and feature requests are welcome.

Feel free to check [issues page](https://github.com/praha-inc/vite-plugin-external/issues) if you want to contribute.

## 📝 License

Copyright © [PrAha, Inc.](https://www.praha-inc.com/)

This project is [```MIT```](https://github.com/praha-inc/vite-plugin-external/blob/main/LICENSE) licensed.
