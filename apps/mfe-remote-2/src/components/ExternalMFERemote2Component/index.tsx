import React from "react";
import { Box } from "@mui/material";
import { VersionDisplay } from "external-package-version-display";

export const ExternalMFERemote2Component = () => {
  return (
    <Box sx={{ backgroundColor: "orange", border: "1px solid black" }}>
      External component from mfe-remote-2
      <VersionDisplay />
    </Box>
  );
};
export default ExternalMFERemote2Component;
