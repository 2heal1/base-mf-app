import versions from "./versions.json";
import { FederationRuntimePlugin } from "@module-federation/enhanced/runtime";

const stage = process.env.REACT_APP_STAGE || "dev";

const prodDomainNameByStage: Record<string, string> = {
  dev: "cnapp-ui-dev.eticloud.io",
  staging: "cnapp-ui-staging.eticloud.io",
  production: "cnapp-ui-production.eticloud.io",
};

const CustomPlugin = (): FederationRuntimePlugin => {
  const isDevPreview = localStorage.getItem("isDevPreview") === "true";
  const activePreviewedVersions = JSON.parse(
    localStorage.getItem("activePreviewedVersions") || "{}",
  );

  return {
    name: "backend-remote-control",
    init: async (args) => {
      await Promise.all(
        args.options.remotes.map(async (remote) => {
          // const local_mfes = process.env.mfe_local;
          // const activeVersions = localStorage.getItem("hostActiveVersions");
          // const parsedActiveVersions = activeVersions
          //   ? JSON.parse(activeVersions)
          //   : null;
          // const version =
          //   (isDevPreview && activePreviewedVersions[remote.alias || ""]) ||
          //   (remote.alias &&
          //     parsedActiveVersions &&
          //     parsedActiveVersions[remote.alias]?.version) ||
          //   //TODO: update using logRocket that version was loaded from versions[stage][remote.alias]
          //   versions[stage][remote.alias];
          // if (local_mfes?.includes(remote.name) || !version) {
          //   return remote;
          // }
          // remote[
          //   "entry"
          // ] = `https://${remote.alias}.${prodDomainNameByStage[stage]}/${version}/remoteEntry.js`;

          return remote;
        }),
      );

      return args;
    },
  };
};

export default CustomPlugin;
