import { Box } from "@mui/material";
import { Component, ReactNode } from "react";

export type ErrorBoundaryProps = {
  fallback?: ReactNode;
  children: ReactNode;
  isGlobalErrorBoundary?: boolean;
};

export type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
};

/**
 * ErrorBoundary component used to display alternative or fallback UI in case of an error.
 *
 * Unfortunatly this is the only case that react doesn't support a
 * functional component and requires a class component.
 *
 * @see https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    //TODO: send error to analytics service
    this.setState({ hasError: true, error, errorInfo });
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (prevProps.children !== this.props.children) {
      this.setState({ hasError: false, error: null, errorInfo: null });
    }
  }
  renderChildren() {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback, isGlobalErrorBoundary } = this.props;
    if (hasError) {
      return fallback || <Box>Error: {error?.message}</Box>;
    }
    return children;
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    return this.renderChildren();
  }
}
