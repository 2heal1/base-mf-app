import { defineConfig, loadEnv, Rspack } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import pkg from "./package.json";

const NodePolyfillPlugin = require("@rspack/plugin-node-polyfill");

const { publicVars } = loadEnv({ prefixes: ["REACT_APP_", "mfe_"] });

const stage = process.env.STAGE || "dev";

const appConfigs: Record<
  string,
  Record<string, { local: string; prod: string }>
> = {
  dev: {},
  staging: {},
  production: {},
};

const appDomainConfig = appConfigs[stage] || {};

const moduleFederationPluginOptions: Rspack.ModuleFederationPluginOptions = {
  name: pkg.name.replace(/-/g, "_"),
  filename: "remoteEntry.js",
  exposes: {
    "./bootstrap": "./src/bootstrap.tsx",
  },
  shared: {
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
      requiredVersion: pkg.devDependencies["@cnapp-ui/mfe-utils"],
    },
  },
  remotes: {},
  runtimePlugins: [require.resolve("./mfe-runtime-plugin.ts")],
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
