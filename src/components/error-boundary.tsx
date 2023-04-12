import React, { Component } from 'react';

interface ErrorBoundaryProps {
  fallback?: React.ReactNode;
  onError?: (error: any) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    console.error(error);
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
        if (this.props.onError) {
            this.props?.onError(this.state);
        }
        return this.props.fallback || null;
    }

    return this.props.children;
  }
}