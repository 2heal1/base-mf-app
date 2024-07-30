import {
  useLocation,
  useNavigate,
  NavigationType,
  useNavigationType,
} from "react-router-dom";
import { useRef, useEffect, DetailedHTMLProps, HTMLAttributes } from "react";
import { shellRoutingPrefix } from "../../routing/constants";
import { NavigationEvent } from "@cnapp-ui/mfe-utils";

type DivProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export default function GlobalNavigationRemote(props: DivProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const navigationType = useNavigationType();

  // Listen to navigation events dispatched inside mfes.
  useEffect(() => {
    const globalNavEventHandler = (event: Event) => {
      const { pathname, search, navigationType } = (event as NavigationEvent)
        .detail;
      const newPathname = `${pathname}${search}`;
      if (newPathname === location.pathname + location.search) {
        return;
      }
      navigate(newPathname, {
        replace: navigationType === NavigationType.Replace,
      });
    };

    window.addEventListener(`cross-mfes navigated`, globalNavEventHandler);

    return () => {
      window.removeEventListener(`cross-mfes navigated`, globalNavEventHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  // send to [${shellRoutingPrefix}-global] the full navigation details (MFEs normally don't use it).
  // used to listen globally to navigation events for example in the topbar
  useEffect(() => {
    window.dispatchEvent(
      new NavigationEvent(`[${shellRoutingPrefix}-global] navigated`, {
        detail: {
          pathname: location.pathname,
          search: location.search,
          navigationType,
        },
      }),
    );
  }, [location, navigationType]);

  return <div ref={wrapperRef} id="global-navigation" {...props} />;
}
