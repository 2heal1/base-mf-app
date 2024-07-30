import React from "react";
import ReactDOM from "react-dom/client";
import { ErrorBoundary } from "@cnapp-ui/mfe-utils";
import { App } from "./App";

console.log("Bootstrap file loaded");

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <ErrorBoundary isGlobalErrorBoundary>
    <App />
  </ErrorBoundary>,
);
console.log("App rendered");
