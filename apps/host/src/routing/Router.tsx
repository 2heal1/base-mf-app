import React from "react";
import { useMemo } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useRoutes } from "./routes";

export function Router() {
  const routes = useRoutes();
  const router = useMemo(() => createBrowserRouter(routes), [routes]);
  return <RouterProvider router={router} />;
}
