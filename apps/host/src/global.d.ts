/**
 * @file
 * When using Module Federation the imported modules will not have any type definitions associated with them,
 * because what we are importing is bundled JS, with typing information stripped out.
 *
 * To allow working in a TS environment it is required to manually define the typing for the imported modules.
 */

// generated declarations
declare module "mfe-remote-1/bootstrap" {
  type MountFn = import("@cnapp-ui/mfe-utils").MountFn;
  export const mount: MountFn;
}
declare module "mfe-remote-2/bootstrap" {
  type MountFn = import("@cnapp-ui/mfe-utils").MountFn;
  export const mount: MountFn;
}
declare module "z-mfe-remote-3/bootstrap" {
  type MountFn = import("@cnapp-ui/mfe-utils").MountFn;
  export const mount: MountFn;
}
