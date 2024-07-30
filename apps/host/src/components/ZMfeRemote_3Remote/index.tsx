import { mount } from "z-mfe-remote-3/bootstrap";
import {
  useLocation,
  useNavigate,
  useNavigationType,
  NavigationType,
} from "react-router-dom";
import { useRef, useEffect, DetailedHTMLProps, HTMLAttributes } from "react";
import {
  shellRoutingPrefix,
  zMfeRemote_2RoutingPrefix,
} from "../../routing/constants";
import { NavigationEvent, UnmountFn } from "@cnapp-ui/mfe-utils";
import React from "react";

type DivProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

const zMfeRemote_3Basename = `/${zMfeRemote_2RoutingPrefix}`;

export default function ZMfeRemote_3Remote(props: DivProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const navigationType = useNavigationType();

  // Listen to navigation events dispatched inside app1 mfe.
  useEffect(() => {
    const zMfeRemote_2NavEventHandler = (event: Event) => {
      const { pathname, search, navigationType } = (event as NavigationEvent)
        .detail;
      const newPathname = `${zMfeRemote_3Basename}${pathname}${search}`;
      if (newPathname === location.pathname + location.search) {
        return;
      }
      navigate(newPathname, {
        replace: navigationType === NavigationType.Replace,
      });
    };

    window.addEventListener(
      `[${zMfeRemote_2RoutingPrefix}] navigated`,
      zMfeRemote_2NavEventHandler,
    );

    return () => {
      window.removeEventListener(
        `[${zMfeRemote_2RoutingPrefix}] navigated`,
        zMfeRemote_2NavEventHandler,
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  // Listen for shell location changes and dispatch a notification.
  useEffect(() => {
    if (location.pathname.startsWith(zMfeRemote_3Basename)) {
      window.dispatchEvent(
        new NavigationEvent(`[${shellRoutingPrefix}] navigated`, {
          detail: {
            pathname: location.pathname.replace(zMfeRemote_3Basename, ""),
            search: location.search,
            navigationType,
          },
        }),
      );
    }
  }, [location, navigationType]);

  const isFirstRunRef = useRef(true);
  const unmountRef = useRef(() => {});

  useEffect(() => {
    if (!isFirstRunRef.current) {
      return;
    }
    unmountRef.current = mount({
      mountPoint: wrapperRef.current!,
      initialLocationPathname: location.pathname.replace(
        zMfeRemote_3Basename,
        "",
      ),
      initialLocationSearch: location.search,
      shellRoutingPrefix,
      appRoutingPrefix: zMfeRemote_2RoutingPrefix,
    }) as UnmountFn;
    isFirstRunRef.current = false;
  }, [location]);

  useEffect(() => unmountRef.current, []);

  return <div ref={wrapperRef} id="z-mfe-remote-3-mfe" {...props} />;
}
