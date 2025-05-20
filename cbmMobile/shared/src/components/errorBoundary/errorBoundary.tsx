import React, { PropsWithChildren } from 'react';

export interface FallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

interface ErrorBoundaryProps extends PropsWithChildren<unknown> {
  onError?: (error: Error, info: React.ErrorInfo) => void;
  onReset?: () => boolean | void;
  renderFallback: (props: FallbackProps) => JSX.Element;
}

interface ErrorBoundaryState {
  error?: Error;
}

const initialState: Readonly<ErrorBoundaryState> = {
  error: undefined,
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  state = initialState;

  resetErrorBoundary = (): void => {
    if (this.props.onReset?.()) {
      return;
    }
    this.reset();
  };

  reset(): void {
    this.setState(initialState);
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    this.props.onError?.(error, info);
  }

  render() {
    const { error } = this.state;
    const { renderFallback } = this.props;

    if (error) {
      const props = {
        error,
        resetErrorBoundary: this.resetErrorBoundary,
      };
      return renderFallback(props);
    }

    return this.props.children;
  }
}
