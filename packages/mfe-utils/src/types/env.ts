type MountProps = {
  mountPoint: HTMLElement;
  initialLocationPathname?: string;
  initialLocationSearch?: string;
  routingStrategy?: RoutingStrategy;
  shellRoutingPrefix?: string;
  appRoutingPrefix?: string;
};

type TopbarMountProps = MountProps & {
  handleHelpClick: () => void;
  handleNotificationsClick: () => void;
  handleRefreshClick: () => void;
};

export type RoutingStrategy = "memory" | "browser";

export type UnmountFn = () => void;
export type MountFn = (props: MountProps) => UnmountFn | void;
export type TopbarMountFn = (props: TopbarMountProps) => UnmountFn | void;
