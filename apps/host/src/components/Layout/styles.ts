import { Theme } from "@mui/material/styles";

export const horizontalLayoutStyle = {
  flexGrow: 1,
  bgcolor: "background.default",
  flex: "1 1 auto",
  height: "100vh",
  overflow: "auto",
  position: "relative",
};

export const topbarContainerStyle = (theme: Theme) => {
  return {
    top: "0px",
    height: `${theme.mixins.toolbar.minHeight}px`,
  };
};

export const mfeContainerStyle = (theme: Theme) => {
  return {
    paddingLeft: "24px",
    paddingRight: "24px",
    overflow: "auto",
    height: `calc(100vh - ${theme.mixins.toolbar.minHeight}px)`,
  };
};
