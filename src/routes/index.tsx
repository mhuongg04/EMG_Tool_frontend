import { createBrowserRouter } from 'react-router-dom';

export const createRouter = () =>
  createBrowserRouter([
    {
      path: '/',
      lazy: async () => {
        const { HomeRoute } = await import('./home');
        return { Component: HomeRoute };
      },
    },
    {
      path: '/legacy',
      lazy: async () => {
        const { LegacyRoute } = await import('./legacy');
        return { Component: LegacyRoute };
      },
    },
    {
      path: '/auth',
      lazy: async () => {
        const { AuthRoute } = await import('./auth');
        return { Component: AuthRoute };
      },
    },
    {
      path: '/file/:id?',
      lazy: async () => {
        const { FileRoute } = await import('./file');
        return { Component: FileRoute };
      },
    },
    {
      path: '*',
      lazy: async () => {
        const { NotFoundRoute } = await import('./not-found');
        return { Component: NotFoundRoute };
      },
    },
  ]);