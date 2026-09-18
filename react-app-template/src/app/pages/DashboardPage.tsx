import { useQuery } from '@tanstack/react-query';

import { useContainer } from '@/app/di/useContainer';
import { toAsyncState } from '@/shared/async/asyncState';
import { Badge, ErrorState, Skeleton } from '@/shared/ui';

/**
 * Dashboard (placeholder). O dashboard orientado a decisões é entregue na spec
 * 012. Aqui demonstra o fluxo completo DI → Query → HttpClient → AsyncState com
 * os estados de loading/error tratados.
 */
export function DashboardPage() {
  const { serviceInfoGateway } = useContainer();

  const query = useQuery({
    queryKey: ['service-info'],
    // O adapter lança HttpError/TimeoutError (Errors reais); a normalização
    // para AppError acontece na leitura, em toAsyncState.
    queryFn: () => serviceInfoGateway.fetchInfo(),
  });

  const state = toAsyncState(query);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 p-6">
      <h1 className="text-text-primary text-3xl font-bold">Dashboard</h1>
      <p className="text-text-secondary">
        Área protegida de exemplo. O dashboard completo é implementado na spec 012.
      </p>

      <section className="border-border-default rounded-lg border p-4">
        <h2 className="text-text-secondary mb-3 text-sm font-medium">Status do serviço</h2>
        {state.status === 'loading' || state.status === 'idle' ? (
          <Skeleton className="h-6 w-40" />
        ) : null}
        {state.status === 'error' ? <ErrorState onRetry={() => void query.refetch()} /> : null}
        {state.status === 'success' ? (
          <div className="flex items-center gap-2">
            <span className="text-text-primary">
              {state.data.name} v{state.data.version}
            </span>
            <Badge variant={state.data.healthy ? 'success' : 'error'}>
              {state.data.healthy ? 'Operacional' : 'Indisponível'}
            </Badge>
          </div>
        ) : null}
      </section>
    </div>
  );
}
