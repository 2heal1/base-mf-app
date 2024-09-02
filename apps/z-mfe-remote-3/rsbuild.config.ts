import { defineConfig, loadEnv, Rspack } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import pkg from "./package.json";

const NodePolyfillPlugin = require("@rspack/plugin-node-polyfill");
const { publicVars } = loadEnv({ prefixes: ["REACT_APP_", "mfe_"] });

const moduleFederationPluginOptions: Rspack.ModuleFederationPluginOptions = {
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
    "external-package-version-display-2": {
      singleton: false,
      requiredVersion: '1.0.0',
      strictVersion:true
    },
    "external-package-version-display": {
      singleton: false,
      requiredVersion: '2.1.4',
      strictVersion:true
    },
  },
  runtimePlugins: [require.resolve("./mfe-runtime-plugin.ts")],
  implementation:require.resolve('@module-federation/runtime-tools')
};

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    template: "./public/index.html",
  },
  dev:{
    writeToDisk:true
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
      plugins: [new NodePolyfillPlugin()],
    },
  },
  source: {
    define: publicVars,
  },
  moduleFederation: {
    options: moduleFederationPluginOptions,
  },
});
