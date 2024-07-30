//Sidebar
import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { ErrorBoundary } from "@cnapp-ui/mfe-utils";
import { Link } from "react-router-dom";
import { mfeRemote_1_Child_1RoutingPrefix } from "../../routing/constants";

export function Sidebar() {
  return (
    <Box
      sx={{
        width: 240,
        height: "100vh",
        borderRight: 1,
        borderColor: "divider",
      }}
    >
      <List>
        <ListItem key={mfeRemote_1_Child_1RoutingPrefix} button>
          <ListItemButton>
            <Link to={mfeRemote_1_Child_1RoutingPrefix}>
              <ListItemText primary={mfeRemote_1_Child_1RoutingPrefix} />
            </Link>
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
}
