import React, { lazy, useMemo } from "react";
import { Navigate, RouteObject } from "react-router-dom";
import { Layout } from "../components/Layout/Layout";
import { Box } from "@mui/material";
// injected routing prefix
import { mfeRemote_1_Child_1RoutingPrefix } from "./constants";
import { MFENode } from "@cnapp-ui/mfe-utils";

// Lazy load remote applications
const MfeRemote_1_Child_1_Lazy = lazy(
  () => import("../components/MfeRemote_1_Child_1Remote"),
);

interface MFERoute {
  path: string;
  element: JSX.Element;
  disabled?: boolean;
}

export const useRoutes = (
  shellRoutingPrefix?: string,
  appRoutingPrefix?: string,
) => {
  const mfeRoutes = useMemo<MFERoute[]>(() => {
    return [
      // Injecting Routes MFEs
      {
        path: `/${mfeRemote_1_Child_1RoutingPrefix}/*`,
        element: (
          <MFENode>
            <MfeRemote_1_Child_1_Lazy />
          </MFENode>
        ),
      },
    ];
  }, []);

  return [
    {
      path: "/",
      element: (
        <Layout
          shellRoutingPrefix={shellRoutingPrefix}
          appRoutingPrefix={appRoutingPrefix}
        />
      ),
      children: [
        ...mfeRoutes,
        {
          path: "*",
          element: <Box>404 Error Page</Box>,
        },
      ],
    },
  ];
};
