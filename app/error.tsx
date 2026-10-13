'use client';

import { useEffect } from 'react';
import { Button } from '@heroui/button';
import { Link } from '@heroui/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Route error boundary for every page under app/. The layout renders nothing
 * that can throw, so no global-error boundary is needed.
 */
export default function RouteError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      role='alert'
      className='flex min-h-96 flex-col items-center justify-center gap-4 text-center'
    >
      <h2 className='text-2xl font-semibold'>Something went wrong</h2>
      <p className='text-gray-600'>
        The recipes could not be loaded right now. Please try again.
      </p>
      <div className='flex gap-4'>
        <Button color='secondary' onPress={reset}>
          Try again
        </Button>
        <Link href='/'>Back to all recipes</Link>
      </div>
    </div>
  );
}
