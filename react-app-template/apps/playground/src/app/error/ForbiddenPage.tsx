import { Button } from '@hmk/react-admin-kit/ui';
import { Link } from 'react-router';

import { ROUTES } from '@/app/router/routes';

/** Página de acesso negado (403). Exibida quando falta permissão para a rota. */
export function ForbiddenPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="text-text-muted text-sm font-medium">Erro 403</p>
      <h1 className="text-text-primary text-3xl font-bold">Acesso negado</h1>
      <p className="text-text-secondary max-w-md">
        Você não tem permissão para acessar esta página.
      </p>
      <Button asChild variant="secondary">
        <Link to={ROUTES.root}>Voltar ao início</Link>
      </Button>
    </div>
  );
}
