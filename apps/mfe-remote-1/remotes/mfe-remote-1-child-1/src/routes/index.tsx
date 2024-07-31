import { Outlet } from "react-router-dom";
import { AppProviders } from "../components/AppProviders";
import { NavigationManager } from "../components/NavigationManager";
import { Box } from "@mui/material";
import { VersionDisplay } from "external-package-version-display";
import React from "react";
const ExternalMFERemote2Component = React.lazy(
  () => import("mfe-remote-2/ExternalMFERemote2Component"),
);
const ExternalZMFERemote3Component = React.lazy(
  () => import("z-mfe-remote-3/ExternalZMFERemote3Component"),
);

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
            external-package-version-display Required Version: 1.1.0
            <VersionDisplay />
            <ExternalZMFERemote3Component />
            <ExternalMFERemote2Component />
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
