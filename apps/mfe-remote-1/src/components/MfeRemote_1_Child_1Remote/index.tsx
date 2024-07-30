import { mount } from "mfe-remote-1-child-1/bootstrap";
import {
  useLocation,
  useNavigate,
  useNavigationType,
  NavigationType,
} from "react-router-dom";
import { useRef, useEffect, DetailedHTMLProps, HTMLAttributes } from "react";
import {
  mfeRemote_1_Child_1RoutingPrefix,
  shellRoutingPrefix,
} from "../../routing/constants";
import { NavigationEvent, UnmountFn } from "@cnapp-ui/mfe-utils";
import React from "react";

type DivProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

const mfeRemote_1_child_1_Basename = `/${mfeRemote_1_Child_1RoutingPrefix}`;

export default function MfeRemote_1_Child_1Remote(props: DivProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const navigationType = useNavigationType();

  // Listen to navigation events dispatched inside app1 mfe.
  useEffect(() => {
    const mfeRemote_1_Child_1NavEventHandler = (event: Event) => {
      const { pathname, search, navigationType } = (event as NavigationEvent)
        .detail;
      const newPathname = `${mfeRemote_1_child_1_Basename}${pathname}${search}`;
      if (newPathname === location.pathname + location.search) {
        return;
      }
      navigate(newPathname, {
        replace: navigationType === NavigationType.Replace,
      });
    };

    window.addEventListener(
      `[${mfeRemote_1_Child_1RoutingPrefix}] navigated`,
      mfeRemote_1_Child_1NavEventHandler,
    );

    return () => {
      window.removeEventListener(
        `[${mfeRemote_1_Child_1RoutingPrefix}] navigated`,
        mfeRemote_1_Child_1NavEventHandler,
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  // Listen for shell location changes and dispatch a notification.
  useEffect(() => {
    if (location.pathname.startsWith(mfeRemote_1_child_1_Basename)) {
      window.dispatchEvent(
        new NavigationEvent(`[${shellRoutingPrefix}] navigated`, {
          detail: {
            pathname: location.pathname.replace(
              mfeRemote_1_child_1_Basename,
              "",
            ),
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
        mfeRemote_1_child_1_Basename,
        "",
      ),
      initialLocationSearch: location.search,
      shellRoutingPrefix,
      appRoutingPrefix: mfeRemote_1_Child_1RoutingPrefix,
    }) as UnmountFn;
    isFirstRunRef.current = false;
  }, [location]);

  useEffect(() => unmountRef.current, []);
  return <div ref={wrapperRef} id="mfe-remote-1-child-1-mfe" {...props} />;
}
