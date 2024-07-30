import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { MountFn, createRouter } from "@cnapp-ui/mfe-utils";
import { routes } from "./routes";

const mount: MountFn = ({
  mountPoint,
  initialLocationPathname,
  initialLocationSearch,
  routingStrategy,
  shellRoutingPrefix,
  appRoutingPrefix,
}) => {
  const getRoutes = routes(shellRoutingPrefix, appRoutingPrefix);
  const router = createRouter({
    strategy: routingStrategy,
    initialLocationPathname,
    initialLocationSearch,
    routes: getRoutes,
  });
  const root = createRoot(mountPoint);
  root.render(<RouterProvider router={router} />);
  return () => queueMicrotask(() => root.unmount());
};

export { mount };
