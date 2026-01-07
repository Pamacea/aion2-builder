'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';

/**
 * Test Error Page
 *
 * This page is used to test the ErrorBoundary component.
 * Click the button to trigger an error and see the ErrorBoundary in action.
 *
 * IMPORTANT: Remove this page in production!
 */
export default function TestErrorPage() {
  const [shouldError, setShouldError] = useState(false);

  if (shouldError) {
    // This will trigger the ErrorBoundary
    throw new Error('This is a test error to verify ErrorBoundary is working!');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-2xl w-full space-y-8">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-cinzel font-bold text-foreground">
            ErrorBoundary Test Page
          </h1>
          <p className="text-muted-foreground">
            This page is used to test the ErrorBoundary component.
            Click the button below to trigger an error.
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            Test Scenarios
          </h2>

          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between p-4 bg-muted rounded-lg">
              <div className="space-y-1">
                <p className="font-medium text-foreground">
                  Test 1: Trigger Error
                </p>
                <p className="text-sm text-muted-foreground">
                  Throws an error to test the ErrorBoundary UI
                </p>
              </div>
              <Button
                onClick={() => setShouldError(true)}
                variant="destructive"
                className="gap-2 shrink-0"
              >
                Trigger Error
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between p-4 bg-muted rounded-lg">
              <div className="space-y-1">
                <p className="font-medium text-foreground">
                  Test 2: Async Error
                </p>
                <p className="text-sm text-muted-foreground">
                  Simulates an async operation error
                </p>
              </div>
              <Button
                onClick={async () => {
                  await new Promise((resolve) => setTimeout(resolve, 100));
                  throw new Error('Async error test');
                }}
                variant="destructive"
                className="gap-2 shrink-0"
              >
                Trigger Async Error
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 space-y-2">
          <p className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
            ⚠️ Development Only
          </p>
          <p className="text-xs text-muted-foreground">
            Remember to remove this page before deploying to production!
            This page is for testing purposes only.
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            What to Expect
          </h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                A centered error screen with an alert icon
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                Error message (detailed in development, generic in production)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                Stack trace visible in development mode
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                "Try Again" button to reset the error boundary
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                "Reload Page" button to refresh the application
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                Link to contact support
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
