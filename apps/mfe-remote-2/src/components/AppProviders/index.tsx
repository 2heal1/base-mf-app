import { PropsWithChildren, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { HelmetProvider } from "react-helmet-async";

const ErrorFallback = () => <div>Something went wrong!</div>;

export const AppProviders = ({ children }: PropsWithChildren) => {
  return (
    <Suspense>
      <ErrorBoundary fallback={<ErrorFallback />}>
        <HelmetProvider>{children}</HelmetProvider>
      </ErrorBoundary>
    </Suspense>
  );
};
