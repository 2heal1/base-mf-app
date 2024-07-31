import React from "react";
import { Outlet } from "react-router-dom";
import { Box, useTheme } from "@mui/material";
import { horizontalLayoutStyle, mfeContainerStyle } from "./styles";
import { ErrorBoundary } from "@cnapp-ui/mfe-utils";
import { VersionDisplay } from "external-package-version-display";
import { Sidebar } from "../Sidebar";

export function Layout() {
  const theme = useTheme();

  return (
    <Box display="flex" height="100vh">
      <Box sx={horizontalLayoutStyle}>
        <Box display="flex">
          <Box
            id="mfe-container"
            flex={4}
            sx={mfeContainerStyle(theme)}
            paddingBottom={8}
          >
            <ErrorBoundary>
              <Box>
                <Box>MFE: host</Box> external-package-version-display Required
                Version: 1.0.0
                <VersionDisplay />
              </Box>
              <Box sx={{ display: "flex" }}>
                <Sidebar />
                <Outlet />
              </Box>
            </ErrorBoundary>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
