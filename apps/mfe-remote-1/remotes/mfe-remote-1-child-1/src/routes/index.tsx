import { Outlet } from "react-router-dom";
import { AppProviders } from "../components/AppProviders";
import { NavigationManager } from "../components/NavigationManager";

export const routes = (
  shellRoutingPrefix?: string,
  appRoutingPrefix?: string,
) => [
  {
    path: "/",
    element: (
      <AppProviders>
        <NavigationManager
          shellRoutingPrefix={shellRoutingPrefix}
          appRoutingPrefix={appRoutingPrefix}
        >
          <>
            mfe-remote-1-child-1
            <Outlet />
          </>
        </NavigationManager>
      </AppProviders>
    ),
    children: [
      {
        index: true,
        element: <div>template app MfeRemote_1_Child_1</div>,
      },
      {
        path: "*",
        element: <div>404 Error Page</div>,
      },
    ],
  },
];
