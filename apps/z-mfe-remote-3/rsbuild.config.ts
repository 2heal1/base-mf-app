import { defineConfig, loadEnv, Rspack } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import pkg from "./package.json";
import {ModuleFederationPlugin} from '@module-federation/enhanced/rspack'

const NodePolyfillPlugin = require("@rspack/plugin-node-polyfill");
const { publicVars } = loadEnv({ prefixes: ["REACT_APP_", "mfe_"] });

const moduleFederationPluginOptions: ConstructorParameters<typeof ModuleFederationPlugin>[0] = {
  dts:false,
  name: pkg.name.replace(/-/g, "_"),
  filename: "remoteEntry.js",
  exposes: {
    "./bootstrap": "./src/bootstrap.tsx",
    "./ExternalZMFERemote3Component":
      "./src/components/ExternalZMFERemote3Component/index.tsx",
  },
  remotes: {
    "mfe-remote-2": "mfe_remote_2@http://localhost:3002/remoteEntry.js",
  },
  shared: {
    ...pkg.dependencies,
    react: {
      singleton: true,
      requiredVersion: pkg.dependencies.react,
    },
    "react-dom": {
      singleton: true,
      requiredVersion: pkg.dependencies["react-dom"],
    },
    "react-router-dom": {
      singleton: true,
      requiredVersion: pkg.dependencies["react-router-dom"],
    },
    "@cnapp-ui/mfe-utils": {
      singleton: true,
      requiredVersion: pkg.dependencies["@cnapp-ui/mfe-utils"],
    },
  },
  runtimePlugins: [require.resolve("./mfe-runtime-plugin.ts")],
};

export default defineConfig({
  plugins: [pluginReact()],
  dev:{
    writeToDisk:true,
    assetPrefix:'http://localhost:3004'
  },
  html: {
    template: "./public/index.html",
  },
  output: {
    sourceMap: {
      js: "source-map",
    },
    distPath: {
      root: "build",
    },
  },
  tools: {
    htmlPlugin: {
      publicPath: "/",
    },
    rspack: {
      output: {
        uniqueName: pkg.name,
      },
      plugins: [new NodePolyfillPlugin(),new ModuleFederationPlugin(moduleFederationPluginOptions)],
    },
  },
  source: {
    define: publicVars,
  },
  // moduleFederation: {
  //   options: moduleFederationPluginOptions,
  // },
});
