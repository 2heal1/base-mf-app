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
    "./ExternalMFERemote1Child1Component":
      "./src/components/ExternalMFERemote1Child1Component/index.tsx",
  },
  remotes: {
    "z-mfe-remote-3": "z_mfe_remote_3@http://localhost:3004/remoteEntry.js",
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
    "external-package-version-display": {
      requiredVersion: pkg.dependencies["external-package-version-display"],
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
