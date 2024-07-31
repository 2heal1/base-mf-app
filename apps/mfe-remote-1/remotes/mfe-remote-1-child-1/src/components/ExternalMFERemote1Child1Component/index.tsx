import React from "react";
import { Box } from "@mui/material";
import { VersionDisplay } from "external-package-version-display";

export const ExternalMFERemote1Child1Component = () => {
  return (
    <Box sx={{ backgroundColor: "grey", border: "1px solid black" }}>
      External component from mfe-remote-1-child-1
      <VersionDisplay />
    </Box>
  );
};
export default ExternalMFERemote1Child1Component;
