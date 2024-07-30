import React from "react";
import { Outlet } from "react-router-dom";
import { Box, useTheme } from "@mui/material";
import { horizontalLayoutStyle, mfeContainerStyle } from "./styles";
import { ErrorBoundary } from "@cnapp-ui/mfe-utils";

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
            <div>dsufhidsa</div>
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
