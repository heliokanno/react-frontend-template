import { Loader2 } from 'lucide-react';

import { cn } from '@/shared/ui/cn';

type SpinnerProps = {
  readonly className?: string;
  /** Rótulo acessível do estado de carregamento. */
  readonly label?: string;
};

/** Indicador de carregamento com rótulo acessível para leitores de tela. */
export function Spinner({ className, label = 'Carregando' }: SpinnerProps) {
  return (
    <span role="status" aria-live="polite" className="inline-flex items-center">
      <Loader2
        aria-hidden="true"
        className={cn('text-text-muted h-5 w-5 animate-spin', className)}
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}

export type { SpinnerProps };
