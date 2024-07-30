import { ReactElement, useEffect } from "react";
import {
  matchRoutes,
  useLocation,
  useNavigate,
  useNavigationType,
  NavigationType,
} from "react-router-dom";
import { routes } from "../../routes";
import { NavigationEvent } from "@cnapp-ui/mfe-utils";

interface NavigationManagerProps {
  children: ReactElement;
  shellRoutingPrefix?: string;
  appRoutingPrefix?: string;
}

export function NavigationManager({
  children,
  shellRoutingPrefix,
  appRoutingPrefix,
}: NavigationManagerProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const navigationType = useNavigationType();

  useEffect(() => {
    function shellNavigationHandler(event: Event) {
      const { pathname, search } = (event as NavigationEvent).detail;
      const getRoutes = routes(shellRoutingPrefix, appRoutingPrefix);
      if (
        (location.pathname === pathname && location.search === search) ||
        !matchRoutes(getRoutes, { pathname })
      ) {
        return;
      }
      navigate(pathname, {
        replace: navigationType === NavigationType.Replace,
      });
    }

    window.addEventListener(
      `[${shellRoutingPrefix}] navigated`,
      shellNavigationHandler,
    );

    return () => {
      window.removeEventListener(
        `[${shellRoutingPrefix}] navigated`,
        shellNavigationHandler,
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  useEffect(() => {
    window.dispatchEvent(
      new NavigationEvent(`[${appRoutingPrefix}] navigated`, {
        detail: {
          pathname: location.pathname,
          search: location.search,
          navigationType,
        },
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return children;
}
