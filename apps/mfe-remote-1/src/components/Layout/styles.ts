import { Theme } from "@mui/material/styles";

export const horizontalLayoutStyle = {
  flexGrow: 1,
  bgcolor: "background.default",
  flex: "1 1 auto",
  height: "100vh",
  position: "relative",
};

export const topbarContainerStyle = (theme: Theme) => {
  return {
    top: "0px",
  };
};

export const mfeContainerStyle = (theme: Theme) => {
  return {
    paddingLeft: "24px",
    paddingRight: "24px",
  };
};
