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
import { useRoutes } from "../../routing/routes";
import { ErrorBoundary } from "@cnapp-ui/mfe-utils";
import { Link } from "react-router-dom";
import {
  mfeRemote_1RoutingPrefix,
  mfeRemote_2RoutingPrefix,
} from "../../routing/constants";

export function Sidebar() {
  const routes = useRoutes();

  return (
    <Box
      sx={{
        width: 240,
        height: "100vh",
        borderRight: 1,
        borderColor: "divider",
        overflowY: "auto",
      }}
    >
      <List>
        <ListItem key={mfeRemote_1RoutingPrefix} button>
          <ListItemButton>
            <Link to={mfeRemote_1RoutingPrefix}>
              <ListItemText primary={mfeRemote_1RoutingPrefix} />
            </Link>
          </ListItemButton>
        </ListItem>
        <ListItem key={mfeRemote_2RoutingPrefix} button>
          <ListItemButton>
            <Link to={mfeRemote_2RoutingPrefix}>
              <ListItemText primary={mfeRemote_2RoutingPrefix} />
            </Link>
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
}
