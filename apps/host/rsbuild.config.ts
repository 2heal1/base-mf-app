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
  dev: {
    mfe_remote_1: {
      local: "http://localhost:3001",
      prod: `http://localhost:3001`,
    },
    mfe_remote_2: {
      local: "http://localhost:3002",
      prod: `http://localhost:3002`,
    },
    z_mfe_remote_3: {
      local: "http://localhost:3004",
      prod: `http://localhost:3004`,
    },
  },
  staging: {
    mfe_remote_1: {
      local: "http://localhost:3001",
      prod: `http://localhost:3001`,
    },
    mfe_remote_2: {
      local: "http://localhost:3002",
      prod: `http://localhost:3002`,
    },
    z_mfe_remote_3: {
      local: "http://localhost:3004",
      prod: `http://localhost:3004`,
    },
  },
  production: {
    mfe_remote_1: {
      local: "http://localhost:3001",
      prod: `http://localhost:3001`,
    },
    mfe_remote_2: {
      local: "http://localhost:3002",
      prod: `http://localhost:3002`,
    },
    z_mfe_remote_3: {
      local: "http://localhost:3004",
      prod: `http://localhost:3004`,
    },
  },
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
  remotes: {
    "mfe-remote-1": `mfe_remote_1@${appDomainConfig["mfe_remote_1"].local}/remoteEntry.js`,
    "mfe-remote-2": `mfe_remote_2@${appDomainConfig["mfe_remote_2"].local}/remoteEntry.js`,
    "z-mfe-remote-3": `z_mfe_remote_3@${appDomainConfig["z_mfe_remote_3"].local}/remoteEntry.js`,
  },
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
