'use client';

import { NotAuthenticatedError } from '@/lib/types';
import { redirect } from 'next/navigation';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.log('error', error.cause);
  if (error.message === 'Access denied. You must be logged in.') {
    redirect('/login');
  }

  return (
    <div>
      <h2>{error?.message ?? error}</h2>
    </div>
  );
}
