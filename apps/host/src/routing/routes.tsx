import React, { lazy, useMemo } from "react";
import { Navigate, RouteObject } from "react-router-dom";
import { Layout } from "../components/Layout/Layout";
import { Box } from "@mui/material";
import GlobalNavigationRemote from "../components/GlobalNavigationRemote";
// injected routing prefix
import { mfeRemote_1RoutingPrefix } from "./constants";
import { MFENode } from "@cnapp-ui/mfe-utils";

// Lazy load remote applications
const MfeRemote_1Lazy = lazy(() => import("../components/MfeRemote_1Remote"));

interface MFERoute {
  path: string;
  element: JSX.Element;
  disabled?: boolean;
}

const generateRoutes = (mfeRoutes: MFERoute[]): RouteObject[] => {
  return [
    {
      path: "/",
      element: (
        <Box>
          {[GlobalNavigationRemote, Layout].map((Component) => (
            <Component key={Component.name} />
          ))}
        </Box>
      ),
      children: [
        {
          index: true,
          element: <Navigate to={`/`} replace />,
        },
        ...mfeRoutes,
        {
          path: "*",
          element: <Box>404 Error Page</Box>,
        },
      ],
    },
  ];
};

export const useRoutes = () => {
  const mfeRoutes = useMemo<MFERoute[]>(() => {
    return [
      // Injecting Routes MFEs
      {
        path: `/${mfeRemote_1RoutingPrefix}/*`,
        element: (
          <MFENode>
            <MfeRemote_1Lazy />
          </MFENode>
        ),
      },
    ];
  }, []);

  return useMemo(() => {
    return generateRoutes(mfeRoutes);
  }, []);
};
