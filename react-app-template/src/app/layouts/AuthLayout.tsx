import { Outlet } from 'react-router';

/**
 * Layout das páginas públicas (ex.: login). Centraliza o conteúdo; a tela de
 * login concreta é implementada na spec 008.
 */
export function AuthLayout() {
  return (
    <div className="bg-surface-subtle flex min-h-dvh items-center justify-center p-6">
      <main className="w-full max-w-md">
        <Outlet />
      </main>
    </div>
  );
}
