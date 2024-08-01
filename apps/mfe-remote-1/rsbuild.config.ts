import { defineConfig, loadEnv, Rspack } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import {ModuleFederationPlugin} from '@module-federation/enhanced/rspack'
import pkg from "./package.json";

const NodePolyfillPlugin = require("@rspack/plugin-node-polyfill");
const { publicVars } = loadEnv({ prefixes: ["REACT_APP_", "mfe_"] });

const stage = process.env.STAGE || "dev";

const appConfigs: Record<
  string,
  Record<string, { local: string; prod: string }>
> = {
  dev: {
    mfe_remote_1_child_1: {
      local: "http://localhost:3003",
      prod: `http://localhost:3003`,
    },
  },
  staging: {
    mfe_remote_1_child_1: {
      local: "http://localhost:3003",
      prod: `http://localhost:3003`,
    },
  },
  production: {
    mfe_remote_1_child_1: {
      local: "http://localhost:3003",
      prod: `http://localhost:3003`,
    },
  },
};

const appDomainConfig = appConfigs[stage] || {};

const moduleFederationPluginOptions: ConstructorParameters<typeof ModuleFederationPlugin>[0] = {
  dts:false,
  name: pkg.name.replace(/-/g, "_"),
  filename: "remoteEntry.js",
  exposes: {
    "./bootstrap": "./src/bootstrap.tsx",
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
  remotes: {
    "mfe-remote-1-child-1": `mfe_remote_1_child_1@${appDomainConfig["mfe_remote_1_child_1"].local}/remoteEntry.js`,
  },
  runtimePlugins: [require.resolve("./mfe-runtime-plugin.ts")],
};

export default defineConfig({
  plugins: [pluginReact()],
  dev:{
    writeToDisk:true,
    assetPrefix:'http://localhost:3001'
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
