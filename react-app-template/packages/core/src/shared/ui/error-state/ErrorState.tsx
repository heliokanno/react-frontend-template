import { AlertCircle } from 'lucide-react';

import { Button } from '@/shared/ui/button/Button';
import { cn } from '@/shared/ui/cn';

type ErrorStateProps = {
  readonly title?: string;
  readonly description?: string;
  /** Handler de recuperação; quando presente, exibe o botão "Tentar novamente". */
  readonly onRetry?: () => void;
  readonly className?: string;
};

/**
 * Estado de erro com possibilidade de recuperação. A mensagem é voltada ao
 * usuário (sem detalhes técnicos); o retry permite tentar novamente.
 */
export function ErrorState({
  title = 'Algo deu errado',
  description = 'Não foi possível carregar os dados. Tente novamente.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'border-border-default flex flex-col items-center justify-center gap-3 rounded-md border p-8 text-center',
        className,
      )}
    >
      <AlertCircle aria-hidden="true" className="text-feedback-error h-10 w-10" />
      <div className="flex flex-col gap-1">
        <p className="text-text-primary font-medium">{title}</p>
        <p className="text-text-secondary text-sm">{description}</p>
      </div>
      {onRetry ? (
        <Button variant="secondary" size="sm" onClick={onRetry} className="mt-2">
          Tentar novamente
        </Button>
      ) : null}
    </div>
  );
}

export type { ErrorStateProps };
