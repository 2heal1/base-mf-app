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
    "./ExternalMFERemote2Component":
      "./src/components/ExternalMFERemote2Component/index.tsx",
  },
  remotes: {
    "z-mfe-remote-3": "z_mfe_remote_3@http://localhost:3004/remoteEntry.js",
    "mfe-remote-1-child-1":
      "mfe_remote_1_child_1@http://localhost:3003/remoteEntry.js",
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
  dev:{
    writeToDisk:true,
    assetPrefix:'http://localhost:3002'
  },
  plugins: [pluginReact()],
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
