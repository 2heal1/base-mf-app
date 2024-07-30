import React from "react";
import { CircularProgress, Box, Backdrop } from "@mui/material";

export const Loading = () => {
  return (
    <Box sx={{ display: "flex" }} data-testid="loading-container">
      <Backdrop sx={{ color: "#fff", zIndex: 5000 }} open={true}>
        <CircularProgress size="7rem" data-testid="circular-progress" />
      </Backdrop>
    </Box>
  );
};

export default Loading;
