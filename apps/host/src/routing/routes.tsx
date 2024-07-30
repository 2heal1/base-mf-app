import React, { lazy, useMemo } from "react";
import { Navigate, RouteObject } from "react-router-dom";
import { Layout } from "../components/Layout/Layout";
import { Box } from "@mui/material";
import GlobalNavigationRemote from "../components/GlobalNavigationRemote";
// injected routing prefix

// Lazy load remote applications

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
            <Component />
          ))}
        </Box>
      ),
      children: [
        {
          index: true,
          element: <Navigate to={`/main/`} replace />,
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
    ];
  }, []);

  return useMemo(() => {
    return generateRoutes(mfeRoutes);
  }, []);
};
