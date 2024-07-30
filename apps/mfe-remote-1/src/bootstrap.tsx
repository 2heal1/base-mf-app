import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { MountFn, createRouter } from "@cnapp-ui/mfe-utils";
import { useRoutes } from "./routing/routes";
import { useMemo } from "react";

type RoutingStrategy = "memory" | "browser";

interface SettingsRouterProps {
  strategy?: RoutingStrategy;
  initialLocationPathname?: string;
  initialLocationSearch?: string;
  shellRoutingPrefix?: string;
  appRoutingPrefix?: string;
}

const SettingsRouter: React.FC<SettingsRouterProps> = ({
  strategy,
  initialLocationPathname,
  initialLocationSearch,
  shellRoutingPrefix,
  appRoutingPrefix,
}) => {
  const routes = useRoutes(shellRoutingPrefix, appRoutingPrefix);
  const router = useMemo(
    () =>
      createRouter({
        strategy,
        initialLocationPathname,
        initialLocationSearch,
        routes,
      }),
    [strategy, initialLocationPathname, initialLocationSearch, routes],
  );

  return <RouterProvider router={router} />;
};

const mount: MountFn = ({
  mountPoint,
  initialLocationPathname,
  initialLocationSearch,
  routingStrategy,
  shellRoutingPrefix,
  appRoutingPrefix,
}) => {
  const root = createRoot(mountPoint);
  root.render(
    <SettingsRouter
      strategy={routingStrategy}
      initialLocationPathname={initialLocationPathname}
      initialLocationSearch={initialLocationSearch}
      shellRoutingPrefix={shellRoutingPrefix}
      appRoutingPrefix={appRoutingPrefix}
    />,
  );
  return () => queueMicrotask(() => root.unmount());
};

export { mount };
