import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router';

/**
 * Layout da área autenticada. O shell administrativo completo (sidebar, header,
 * breadcrumb) é implementado na spec 010; aqui fornecemos a estrutura base e o
 * gerenciamento de foco na troca de rota (acessibilidade).
 */
export function RootLayout() {
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  // Move o foco para o conteúdo principal a cada troca de rota, tornando a
  // navegação perceptível para tecnologias assistivas.
  useEffect(() => {
    mainRef.current?.focus();
  }, [location.pathname]);

  return (
    <div className="bg-surface-default text-text-primary min-h-dvh">
      <main ref={mainRef} tabIndex={-1} className="outline-none">
        <Outlet />
      </main>
    </div>
  );
}
