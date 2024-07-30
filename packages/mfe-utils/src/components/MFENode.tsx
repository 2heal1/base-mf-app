import { Suspense } from "react";
import { ErrorBoundary } from "./ErrorBoundary";
import { Box } from "@mui/material";

export interface MFENodeProps {
  children: React.ReactNode;
  disableErrorBoundary?: boolean;
  customErrorFallback?: React.ReactNode;
}

export const MFENode = ({
  children,
  disableErrorBoundary,
  customErrorFallback,
}: MFENodeProps) => {
  const getWrappedChildren = () => (
    <Suspense fallback={<Box>Loading...</Box>}>{children}</Suspense>
  );

  return disableErrorBoundary ? (
    getWrappedChildren()
  ) : (
    <ErrorBoundary fallback={customErrorFallback}>
      {getWrappedChildren()}
    </ErrorBoundary>
  );
};
