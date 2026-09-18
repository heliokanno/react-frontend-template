import { Component, type ErrorInfo, type ReactNode } from 'react';

import { ErrorState } from '@/shared/ui';

type AppErrorBoundaryProps = {
  readonly children: ReactNode;
};

type AppErrorBoundaryState = {
  readonly hasError: boolean;
};

/**
 * Boundary de erro raiz. Evita que uma falha de renderização derrube toda a
 * aplicação. Boundaries mais específicos (por rota/feature) devem tratar falhas
 * localizadas; este é a rede de segurança final.
 */
export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Ponto de integração com observabilidade (spec futura). Não expor ao usuário.
    console.error('Erro não tratado capturado pelo AppErrorBoundary', error, info);
  }

  private readonly handleReset = () => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-dvh items-center justify-center p-6">
          <ErrorState
            title="Algo deu errado"
            description="A aplicação encontrou um erro inesperado."
            onRetry={this.handleReset}
          />
        </div>
      );
    }
    return this.props.children;
  }
}
