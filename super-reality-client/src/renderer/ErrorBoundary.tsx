/* eslint-disable react/destructuring-assignment */
import React, { ReactNode } from "react";

interface ErrorState {
  error: any;
  errorInfo: any;
}

export default class ErrorBoundary extends React.Component<
  Record<string, unknown>,
  ErrorState
> {
  constructor(props: Record<string, unknown>) {
    super(props);
    this.state = { error: null, errorInfo: null } as ErrorState;
  }

  componentDidCatch(error: any, errorInfo: any): void {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
    // You can also log error messages to an error reporting service here
  }

  closeErrorDialog = (): void => {
    // const dispatcher = store.dispatch;
    // reduxAction(dispatcher, { type: "", arg: null });
    setTimeout(() => {
      this.setState({
        error: null,
        errorInfo: null,
      });
    }, 350);
  };

  render(): ReactNode {
    return (
      <>
        {this.state.errorInfo ? (
          <div className="error-boundary">
            <div className="error-info-top" />
            <div className="error-info-text">
              <div>{this.state.error && this.state.error.toString()}</div>
              <details style={{ whiteSpace: "pre-wrap" }}>
                <div>{this.state.errorInfo.componentStack}</div>
              </details>
            </div>
          </div>
        ) : (
          this.props.children
        )}
      </>
    );
  }
}
