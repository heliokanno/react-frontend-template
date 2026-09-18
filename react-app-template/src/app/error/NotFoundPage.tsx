import { Link } from 'react-router';

import { ROUTES } from '@/app/router/routes';
import { Button } from '@/shared/ui';

/** Página 404. */
export function NotFoundPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="text-text-muted text-sm font-medium">Erro 404</p>
      <h1 className="text-text-primary text-3xl font-bold">Página não encontrada</h1>
      <p className="text-text-secondary max-w-md">
        A página que você procura não existe ou foi movida.
      </p>
      <Button asChild variant="secondary">
        <Link to={ROUTES.root}>Voltar ao início</Link>
      </Button>
    </div>
  );
}
