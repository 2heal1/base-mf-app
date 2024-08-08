import { Outlet } from "react-router-dom";
import { AppProviders } from "../components/AppProviders";
import { NavigationManager } from "../components/NavigationManager";
import { Box } from "@mui/material";
import { VersionDisplay } from "external-package-version-display";
import { VersionDisplay as VersionDisplay2 } from "external-package-version-display-2";
import React from "react";
// const ExternalMFERemote2Component = React.lazy(
//   () => import("mfe-remote-2/ExternalMFERemote2Component"),
// );
// const ExternalZMFERemote3Component = React.lazy(
//   () => import("z-mfe-remote-3/ExternalZMFERemote3Component"),
// );
// console.log("mfe-remote-1-child-1 mui version", version, version === "5.15.2");
export const routes = (
  shellRoutingPrefix?: string,
  appRoutingPrefix?: string,
) => [
  {
    path: "/",
    element: (
      <AppProviders>
        <NavigationManager
          shellRoutingPrefix={shellRoutingPrefix}
          appRoutingPrefix={appRoutingPrefix}
        >
          <>
            mfe-remote-1-child-1
            <Outlet />
          </>
        </NavigationManager>
      </AppProviders>
    ),
    children: [
      {
        index: true,
        element: (
          <Box>
            <Box>MFE: mfe-remote-1-child-1</Box>
            external-package-version-display Required Version: 2.1.2
            <VersionDisplay />
            <VersionDisplay2 />
            {/* <ExternalZMFERemote3Component />
            <ExternalMFERemote2Component /> */}
          </Box>
        ),
      },
      {
        path: "*",
        element: <div>404 Error Page</div>,
      },
    ],
  },
];
