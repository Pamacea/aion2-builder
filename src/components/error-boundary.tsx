'use client';

import React, { Component, ReactNode, useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * ErrorBoundary Component
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of the
 * component tree that crashed.
 *
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to console (prepare for Sentry integration)
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Log additional context
    console.error('Component stack:', errorInfo.componentStack);

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Update state with error details
    this.setState({
      error,
      errorInfo,
    });

    // TODO: Send error to Sentry when integrated
    // Sentry.captureException(error, { contexts: { react: errorInfo } });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full space-y-6 text-center">
            {/* Error Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-destructive/20 rounded-full blur-xl animate-pulse" />
                <div className="relative bg-destructive/10 rounded-full p-6 border border-destructive/20">
                  <AlertCircle className="h-12 w-12 text-destructive" />
                </div>
              </div>
            </div>

            {/* Error Message */}
            <div className="space-y-2">
              <h1 className="text-2xl font-cinzel font-bold text-foreground">
                Oops! Something went wrong
              </h1>
              <p className="text-muted-foreground">
                {process.env.NODE_ENV === 'development'
                  ? this.state.error?.message ||
                    'An unexpected error occurred'
                  : 'An unexpected error occurred. Please try again.'}
              </p>
            </div>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' &&
              this.state.error && (
                <div className="bg-card border border-border rounded-lg p-4 text-left space-y-2">
                  <p className="text-sm font-semibold text-foreground">
                    Error Details (Development):
                  </p>
                  <pre className="text-xs text-muted-foreground overflow-auto max-h-40 whitespace-pre-wrap font-mono">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </div>
              )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={this.handleReset}
                variant="outline"
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
              <Button
                onClick={this.handleReload}
                variant="default"
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Reload Page
              </Button>
            </div>

            {/* Support Link */}
            <p className="text-sm text-muted-foreground">
              If the problem persists, please{' '}
              <a
                href="mailto:support@bahion.com"
                className="text-primary hover:underline"
              >
                contact support
              </a>
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook-based error boundary for functional components
 * Use this for simpler cases where you don't need the full class component
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { error, reset } = useErrorHandler();
 *
 *   if (error) {
 *     return <ErrorFallback error={error} resetError={reset} />;
 *   }
 *
 *   return <YourComponent />;
 * }
 * ```
 */
export function useErrorHandler() {
  const [error, setError] = useState<Error | null>(null);

  const reset = () => setError(null);

  // This will be caught by the ErrorBoundary
  const handleError = (error: Error) => {
    setError(error);
    throw error;
  };

  return { error, reset, handleError };
}

/**
 * Default Error Fallback Component
 * Can be used independently or as part of ErrorBoundary
 */
export function ErrorFallback({
  error,
  resetError,
}: {
  error: Error;
  resetError: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-destructive/20 rounded-full blur-xl animate-pulse" />
            <div className="relative bg-destructive/10 rounded-full p-6 border border-destructive/20">
              <AlertCircle className="h-12 w-12 text-destructive" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-cinzel font-bold text-foreground">
            Oops! Something went wrong
          </h1>
          <p className="text-muted-foreground">
            {process.env.NODE_ENV === 'development'
              ? error.message
              : 'An unexpected error occurred. Please try again.'}
          </p>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="bg-card border border-border rounded-lg p-4 text-left space-y-2">
            <p className="text-sm font-semibold text-foreground">
              Error Details (Development):
            </p>
            <pre className="text-xs text-muted-foreground overflow-auto max-h-40 whitespace-pre-wrap font-mono">
              {error.toString()}
              {error.stack}
            </pre>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={resetError} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          <Button onClick={() => window.location.reload()} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Reload Page
          </Button>
        </div>
      </div>
    </div>
  );
}
