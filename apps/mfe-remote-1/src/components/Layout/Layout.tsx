import React from "react";
import { Outlet } from "react-router-dom";
import { Box, useTheme } from "@mui/material";
import { horizontalLayoutStyle, mfeContainerStyle } from "./styles";
import { ErrorBoundary } from "@cnapp-ui/mfe-utils";
import { Sidebar } from "../Sidebar";
import { NavigationManager } from "../NavigationManager";

export const Layout = ({
  shellRoutingPrefix,
  appRoutingPrefix,
}: {
  shellRoutingPrefix: string | undefined;
  appRoutingPrefix: string | undefined;
}) => {
  const theme = useTheme();
  return (
    <>
      <NavigationManager
        shellRoutingPrefix={shellRoutingPrefix}
        appRoutingPrefix={appRoutingPrefix}
      >
        <Box display="flex" height="100vh">
          <Box sx={horizontalLayoutStyle}>
            <Box display="flex">
              <Box flex={4} sx={mfeContainerStyle(theme)} paddingBottom={8}>
                <ErrorBoundary>
                  <Box sx={{ display: "flex" }}>
                    mfe-remote-1
                    <Sidebar />
                    <Outlet />
                  </Box>
                </ErrorBoundary>
              </Box>
            </Box>
          </Box>
        </Box>
      </NavigationManager>
    </>
  );
};
