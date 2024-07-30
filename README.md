<h1 style="text-align: center">CNAPP-UI</h1>

<div style="text-align: center">
  <p>Panoptica application for Outshift's CNAPP platform.<p>
</div>

## Table of Contents

<!-- To update the table of contents, install globally `doctoc`, and run 'doctoc ./README.md'
DO NOT UPDATE MANUALLY! -->
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Project Foundations](#project-foundations)
  - [Overview](#overview)
  - [State Management](#state-management)
- [Development](#development)
  - [Setup](#setup)
    - [Authentication](#authentication)
  - [Running the project](#running-the-project)
  - [Stages & Environment Variables](#stages--environment-variables)
  - [Best Practices](#best-practices)
    - [Tagged Projects](#tagged-projects)
    - [Micro frontend Remote Run](#micro-frontend-remote-run)
    - [Running the project with local BE](#running-the-project-with-local-be)
- [Integration (CI)](#integration-ci)
  - [Branching Strategy](#branching-strategy)
  - [Integration Workflow](#integration-workflow)
- [Deployment](#deployment)
  - [Dev & Staging Deployment](#dev--staging-deployment)
  - [Production Deployment](#production-deployment)
  - [Feature Flags](#feature-flags)
- [Project Core Components](#project-core-components)
  - [Micro Frontend Applications](#micro-frontend-applications)
    - [Create a new app](#create-a-new-app)
    - [Authentication](#authentication-1)
      - [Cross Micro Frontend Shared auth-state](#cross-micro-frontend-shared-auth-state)
    - [Navigation](#navigation)
      - [Cross Micro Frontend Navigation](#cross-micro-frontend-navigation)
    - [Shared API Access Across Micro Frontends](#shared-api-access-across-micro-frontends)
      - [Adding new API](#adding-new-api)
      - [Usage](#usage)
  - [Shared Packages](#shared-packages)
    - [Create a new package](#create-a-new-package)
    - [Using a shared package](#using-a-shared-package)
  - [Design Library](#design-library)
- [Quality Assurance](#quality-assurance)
  - [Unit Testing](#unit-testing)
  - [End-to-End Testing](#end-to-end-testing)
  - [Github Actions Failure Space](#github-actions-failure-space)
- [Support & Questions](#support--questions)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Project Foundations

## Overview

The project uses the Micro Frontend (MFE) architecture based on the "Module Federation" plugin by Webpack, each app is a
a standalone application that can be deployed
independently.
The main app is the 'host', it is the main entry point for the user, and it is responsible for loading the other apps.

**NOTE:** This project assumes that you use `node 18.18.2`.

## State Management

The project has a common state management package(packages/shared-state) that can be used by all the apps
using [zustand](https://github.com/pmndrs/zustand).
To use it inside the MFE app, you need to import the hooks functions(for ex: useAuthStore) from this package and use
it
to get the state and dispatch actions.

# Development

## Setup

### Authentication

Since this project is using the [`@cisco-eti/cnapp-design`](https://github.com/cisco-eti/cnapp-design) package you will
need to authenticate to GitHub packages.

To do so, please go to <https://github.com/settings/tokens/new> and create a new personal access token with `packages`
permissions,
and make sure to configure `SSO` to the cisco-eti organization, once you have your token, you need to make sure its
available as an environment variable named `NPM_TOKEN`.

There are a few ways you can set the `NPM_TOKEN` env variable:

- setting it in `~/.bashrc` / `~/.zshrc` (`export NPM_TOKEN="<your-token>"`)
- using a `.env` file in the root of the project

## Running the project

1. Install packages
   ```sh
   yarn install
   ```
2. Run project

   - Run full application:
     - ```sh
       yarn dev
       ```
   - Run application with a selected MFEs:

     - ```sh
       yarn dev --projects=MFE-NAME-1,MFE-NAME-2,...
       ```

   - Run application with [remote MFEs](#micro-frontend-remote-run):

     - ```sh
       yarn dev:remote --projects=MFE-NAME-1,MFE-NAME-2,...
       ```

## Stages & Environment Variables

| Variable Name   | Description              | Accepted Values                | Default Value | Example                            |
| --------------- | ------------------------ | ------------------------------ | ------------- | ---------------------------------- |
| REACT_APP_STAGE | define the current stage | `dev`, `staging`, `production` | `dev`         | `REACT_APP_STAGE=staging yarn dev` |

## Best Practices

### Tagged Projects

By tagging a project to use only the necessary common team MFEs and packages, the build speed of the local application can be significantly enhanced.

1.  Add nx tag in MFE `project.json` file:
    ```
    "nx": { "tags": ["best-team"] }
    ```
2.  Run the project
    ```sh
    yarn dev --projects=tag:base, tag:best-team
    ```

**NOTE:** `tag:base` includes all the core MFEs and packages for basic and proper running of the application

### Micro frontend Remote Run

Instead of relying on the traditional `yarn dev` command, which involves waiting for all micro frontends to build and run.

```sh
yarn dev:remote --projects=MFE-NAME-1,MFE-NAME-2
```

In case you want to run packages in watch mode

```sh
yarn dev:remote --projects=MFE-NAME-1,@cnapp-ui/PACKAGE-NAME
```

In case you want to run locally mfe from the settings section you need to run settings mfe locally as well.

```sh
yarn dev:remote --projects=settings,MFE-NAME-1
```

This approach allows you to locally run only the host and your micro-frontends while loading other micro frontends from a remote source.

**NOTE:** Be aware that local changes will affect only the local MFE's, remote MFE's will not be affected from local changes.

### Running the project with local BE

1. Run the BE locally.
2. Remove locally "singleton:true" of "@cnapp-ui/mfe-api" inside the MFE you want to run locally. (Don't commit this change)
3. Find the environment name of the MFE API URL you want to run locally from "@cnapp-ui/mfe-api" package, for example: REACT_APP_ASOC_FINDINGS_API
4. Add the environment variable to the run command, for example:
   ```sh
   REACT_APP_ASOC_FINDINGS_API=http://localhost:3000 yarn dev:remote --projects=MFE-NAME-1,MFE-NAME-2,...
   ```

# Integration (CI)

## Branching Strategy

This project is using a single branch: `main`.\
To add a new feature/bugfix:

1. Check out a new branch from `main`.
2. Develop.
3. Once ready, open a new PR targeting `main`.

Read more about environments deployment in the [deployment section](#deployment).

## Integration Workflow

The project is using GitHub actions to run the CI pipeline.\
On the [CI pipeline workflow](https://github.com/cisco-eti/cnapp-ui/actions/workflows/ci.yml), the project is using nx to run relevant scripts on specific MFEs.\
By using nx only the affected apps and packages will be built, linted and tested.

# Deployment

## Dev & Staging Deployment

Once a PR is merged to `main`, deployment automatically starts to both `dev` and `staging` environments.\
The deployment status can be viewed in the merged commit status checks on `main`.

## Production Deployment

Production deployment can only be done by the [authorized team](https://github.com/orgs/cisco-eti/teams/cnapp-ui-admins/members).\
For step-by-step instruction, please refer to the [production deployment confluence](https://cisco-eti.atlassian.net/wiki/x/BYCRFQ).

## Feature Flags

Feature flags can show, hide, or limit features according to the current stage.\
Currently, the project supports static feature flags (which can't be changed at runtime).\
A usage guide can be found in the [feature-flags readme](./packages/mfe-utils/src/feature-flags/README.md).\
In the future, this mechanism will be replaced by a fully-featured system.

# Project Core Components

## Micro Frontend Applications

### Create a new app

In order to create a new MFE app, you need to open a minimal PR with the new MFE infrastructure (should be approved by `@cisco-eti/terra`):

1. #### Create the new MFE infrastructure

   ```bash
   1. Run 'yarn gen'
   2. Enter app name and follow the instructions
   ```

2. #### Code ownership

   Add a team ownership to the new MFE app in `/CODEOWNERS` file

3. #### Optional - Access from the Sidebar

   Add a new button to the host sidebar under `/apps/host/src/components/Sidebar/SideBarData.ts`

4. #### Optional - Initiate a project tag

   [Tag application](#tagged-projects) for faster local development.

### Authentication

Each MFE is protected with the package [@cisco-eti/auth-providers-react](https://github.com/cisco-eti/auth-providers-react), this package will give you the following options:

- using a React hook to have access to the values of `auth`;
- using React components to use on your application.

#### Cross Micro Frontend Shared auth-state

In each MFE you can access the value of `auth` using the `@cnapp-ui/shared-state` library.

**Usage**

You need to import the lib into your MFE application.

```javascript
import { useAuthStore } from "@cnapp-ui/shared-state";

export const MyComponent = () => {
  const auth = useAuthStore((state) => state.auth);
  return <p>{JSON.stringfy(auth?.authInfo?.user)}</p>;
};
```

If you need to "watch" the auth object being changed.

```javascript
import { useAuthStore } from "@cnapp-ui/shared-state";

export const MyComponent = () => {
   const auth = useAuthStore((state) => state.auth);

   React.useEffect(() => {
      // due operations
   }, [auth]);

   ...
}
```

### Navigation

Each MFE independently manages the internal routes using `react-router-dom`

#### Cross Micro Frontend Navigation

Use the **`crossMFENavigation`** function for navigation between different MFE applications. if one application (say `App-A`) wants to navigate to another application (say `App-B`), using this function, `App-A` communicates this navigation request to the `host` MFE. The `host` MFE, which connects to all MFEs, make the navigation to `App-B`.

**Usage**

Function props arguments:

- `pathname`: (String) The URL path to which you want to navigate.
- `search`: (String) Any query parameters that should be included in the URL. This should be in string format, beginning with a '?'.
- `navigationType`: (Enum) The type of navigation, it should be either `NavigationType.Push` or `NavigationType.Replace`.

| Prop Name        | Type   | Description                                                                       | Required |
| ---------------- | ------ | --------------------------------------------------------------------------------- | -------- |
| `pathname`       | String | The URL path for navigation.                                                      | Yes      |
| `search`         | String | Query parameters to include in the URL. Starts with a '?'.                        | No       |
| `navigationType` | Enum   | The type of navigation, either `NavigationType.Push` or `NavigationType.Replace`. | No       |

Example:

```javascript
import { crossMFENavigation } from "@cnapp-ui/mfe-utils";

crossMFENavigation({
  pathname: "/settings/",
  search: "?filter=active",
  navigationType: NavigationType.Push,
});
```

### Shared API Access Across Micro Frontends

In each MFE, you can access the endpoint of the requested backend, based on the client's stage and region, using the `@cnapp-ui/mfe-api` package.

#### Adding new API

New APIs should be defined in `packages/mfe-api/src/api`.

#### Usage

For using any API, you need to import its corresponding function into your MFE application.

For example, to use Asoc Security Findings API, you can do:

```typescript
import { getAsocSecurityFindingsApi } from "@cnapp-ui/mfe-api";

const asocSecurityFindingsApi = getAsocSecurityFindingsApi();
```

## Packages

### Currently available packages

1. [panoptica-mfe-utils](https://github.com/cisco-eti/panoptica-mfe-utils)
2. [panoptica-shared-constructs](https://github.com/cisco-eti/panoptica-shared-constructs)
3. [panoptica-mfe-domains](https://github.com/cisco-eti/panoptica-mfe-domains)
4. [paoptica-eslint-connfig](https://github.com/cisco-eti/paoptica-eslint-connfig)
5. [panoptica-jest-config](https://github.com/cisco-eti/panoptica-jest-config)
6. [panoptica-tsconfig-common](https://github.com/cisco-eti/panoptica-tsconfig-common)
7. [panoptica-mfe-dev-utils](https://github.com/cisco-eti/panoptica-mfe-dev-utils)

### Create a new package

1. #### Generate the package

   1. Use the [GitHub template](https://github.com/cisco-eti/panoptica-package-template) for creating new shared packages.
   2. Follow the instructions in the template repository to set up the new package.
   3. Clone the newly created repository to your local environment and proceed with the package development.
   4. Ensure that you configure the code ownership for the new package by updating the /CODEOWNERS file within the package's repository.
   5. Merge new code, release it, and add it as a regular dependency in your cnapp-ui MFE.

2. #### Code ownership

   Add a team ownership to the new package in `/CODEOWNERS` file.

3. #### Optional - Initiate a project tag

   [Tag package](#tagged-projects) for faster local development.

### Using a shared package

1. #### Adding to `package.json`

   Include the new package in the target MFE `package.json`:

   ```bash
   {
       dependencies/devDependencies: {
         ...
         "@cisco-eti/new-package": "1.0.0",
         ...
       }
   }
   ```

2. #### Adding to `craco.config.ts`/`rsbuild.config.ts`

   If the package is a production dependency, include it in the `craco.config.ts`/`rsbuild.config.ts` shared section (not needed):

   ```bash
   {
      ...
      shared: {
         ...
         "@cisco-eti/new-package": {
            requiredVersion: pkg.dependencies["@cisco-eti/new-package"],
         },
         ...
      }
   }
   ```

   **Note**: This step is not required for dev dependencies.

## Design Library

`cnapp-design` is a private design library used in this project. It contains a collection of components that are specifically designed by Outshift's designers for this project. These components, ensure consistency and efficiency in our UI design.

For more details about the components and how to use them, visit the [`cnapp-design`](https://github.com/cisco-eti/cnapp-design) repository and explore the Storybook.

# Quality Assurance

## Unit Testing

The project is using Jest + React Testing Library ([test example](./apps/host/src/components/NotFound/)).

Run a MFE app tests by executing `yarn test` inside the app directory.

## End-to-End Testing

The project is using [Playwright](https://playwright.dev/) as the automation testing tool.
All tests run automatically on every Pull Request by GitHub Actions.
To run the tests locally, navigate to `/tests/e2e` folder and follow the instructions in the [README file](./tests/e2e/).

## Github Actions Failure Space

Join our Webex room to receive alerts for deployment and sanity test failures. - webexteams://im?space=4f6cf040-ad5c-11ee-b3f7-6bfce0846392

# Support & Questions

Join our Webex space - webexteams://im?space=284f4e30-7702-11ee-9e51-b5ef023cd0d7
