import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';

export default function ErrorMessage({
  title = 'Something went wrong',
  description = 'An unexpected error occurred. Please try again later.',
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="w-full flex mt-8">
      <Alert variant="destructive" className="max-w-md">
        <AlertTriangle className="h-5 w-5" />
        <div className="ml-3 flex-1">
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription className="mt-1">{description}</AlertDescription>

          {onRetry && (
            <div className="mt-4">
              <Button
                variant="destructive"
                size="sm"
                className="inline-flex items-center gap-2"
                onClick={onRetry}
              >
                Retry
              </Button>
            </div>
          )}
        </div>
      </Alert>
    </div>
  );
}
