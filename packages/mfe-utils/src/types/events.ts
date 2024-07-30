import { NavigationType } from "react-router-dom";

export interface NavigationEventDetail {
  pathname: string;
  search: string;
  navigationType: NavigationType;
}
export class NavigationEvent extends CustomEvent<NavigationEventDetail> {
  constructor(
    eventName: string,
    eventInitDict?: CustomEventInit<NavigationEventDetail>,
  ) {
    super(eventName, eventInitDict);
  }
}
