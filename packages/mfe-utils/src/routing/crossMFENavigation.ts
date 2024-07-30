import { NavigationType } from "react-router-dom";
import { NavigationEvent } from "../types/events";

export interface CrossMFENavigation {
  pathname: string;
  search?: string;
  navigationType?: NavigationType;
}

export function crossMFENavigation({
  pathname,
  search = "",
  navigationType = NavigationType.Push,
}: CrossMFENavigation) {
  window.dispatchEvent(
    new NavigationEvent(`cross-mfes navigated`, {
      detail: {
        pathname,
        search,
        navigationType,
      },
    }),
  );
}
