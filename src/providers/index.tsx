import { QueryClientProvider } from '@tanstack/react-query';
import * as React from 'react';

import { queryClient } from '../lib/react-query';

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <React.Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center">
          Loading...
        </div>
      }
    >

      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </React.Suspense>
  );
};