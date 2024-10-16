import { useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { RouterProvider } from 'react-router-dom';
import { createRouter } from './routes';

import { AppProvider } from './providers';

const AppRouter = () => {
  const queryClient = useQueryClient();

  const router = useMemo(() => createRouter(), [queryClient]);

  return <RouterProvider router={router} />;
};

function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}

export default App;