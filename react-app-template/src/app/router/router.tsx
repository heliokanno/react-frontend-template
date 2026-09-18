import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter, type RouteObject } from 'react-router';

import { NotFoundPage } from '@/app/error/NotFoundPage';
import { RouteErrorBoundary } from '@/app/error/RouteErrorBoundary';
import { AuthLayout } from '@/app/layouts/AuthLayout';
import { RootLayout } from '@/app/layouts/RootLayout';
import { LoginPage } from '@/app/pages/LoginPage';
import { ProtectedRoute } from '@/app/router/ProtectedRoute';
import { PublicRoute } from '@/app/router/PublicRoute';
import { ROUTES } from '@/app/router/routes';
import { Spinner } from '@/shared/ui';

// Lazy loading das páginas (code splitting). Componentes pequenos não são divididos.
const TokensReferencePage = lazy(() =>
  import('@/shared/design-system/reference/TokensReferencePage').then((m) => ({
    default: m.TokensReferencePage,
  })),
);
const DashboardPage = lazy(() =>
  import('@/app/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })),
);
const DataGridExamplePage = lazy(() =>
  import('@/app/pages/DataGridExamplePage').then((m) => ({ default: m.DataGridExamplePage })),
);

/** Fallback de carregamento para chunks preguiçosos. */
function PageFallback() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <Spinner label="Carregando página" />
    </div>
  );
}

function lazyPage(node: ReactNode): ReactNode {
  return <Suspense fallback={<PageFallback />}>{node}</Suspense>;
}

/** Definição central de rotas do núcleo (ver frontend-architecture.md → Routing). */
export const routes: RouteObject[] = [
  {
    element: <RootLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { path: ROUTES.root, element: lazyPage(<TokensReferencePage />) },
      { path: ROUTES.dataGridExample, element: lazyPage(<DataGridExamplePage />) },
      {
        path: ROUTES.dashboard,
        element: <ProtectedRoute>{lazyPage(<DashboardPage />)}</ProtectedRoute>,
      },
    ],
  },
  {
    element: <AuthLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: ROUTES.login,
        element: (
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        ),
      },
    ],
  },
  { path: ROUTES.notFound, element: <NotFoundPage /> },
];

export const router = createBrowserRouter(routes);
