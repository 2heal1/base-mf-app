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
          <Outlet />
        </NavigationManager>
      </AppProviders>
    ),
    children: [
      {
        index: true,
        element: (
          <Box>
            <Box>MFE: z-mfe-remote-3</Box>
            external-package-version-display Required Version: 2.1.4
            <VersionDisplay />
            <VersionDisplay2 />
            {/* <ExternalMFERemote2Component /> */}
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
