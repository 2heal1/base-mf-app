import React from "react";
import { Box } from "@mui/material";
import { VersionDisplay } from "external-package-version-display";

export const ExternalZMFERemote3Component = () => {
  return (
    <Box sx={{ backgroundColor: "yellow", border: "1px solid black" }}>
      External component from z-mfe-remote-3
      <VersionDisplay />
    </Box>
  );
};
export default ExternalZMFERemote3Component;
