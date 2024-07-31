import { Outlet } from "react-router-dom";
import { AppProviders } from "../components/AppProviders";
import { NavigationManager } from "../components/NavigationManager";
import { Box } from "@mui/material";
import { VersionDisplay } from "external-package-version-display";
import React from "react";
const ExternalZMFERemote3Component = React.lazy(
  () => import("z-mfe-remote-3/ExternalZMFERemote3Component"),
);
const ExternalMFERemote1Child1Component = React.lazy(
  () => import("mfe-remote-1-child-1/ExternalMFERemote1Child1Component"),
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
          <Outlet />
        </NavigationManager>
      </AppProviders>
    ),
    children: [
      {
        index: true,
        element: (
          <Box>
            <Box>MFE: mfe-remote-2</Box>
            external-package-version-display Required Version: 2.0.0
            <VersionDisplay />
            <ExternalZMFERemote3Component />
            <ExternalMFERemote1Child1Component />
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
