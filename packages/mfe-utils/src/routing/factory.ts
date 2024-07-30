import {
  RouteObject,
  createBrowserRouter,
  createMemoryRouter,
} from "react-router-dom";
import { RoutingStrategy } from "../types/env";

type CreateRouterProps = {
  strategy?: RoutingStrategy;
  initialLocationPathname?: string;
  initialLocationSearch?: string;
  routes: RouteObject[];
};

export function createRouter({
  strategy,
  initialLocationPathname,
  initialLocationSearch,
  routes,
}: CreateRouterProps) {
  if (strategy === "browser") {
    return createBrowserRouter(routes);
  }

  const initialEntries = [
    initialLocationPathname && initialLocationSearch
      ? initialLocationPathname + initialLocationSearch
      : initialLocationPathname || "/",
  ];
  return createMemoryRouter(routes, { initialEntries: initialEntries });
}
