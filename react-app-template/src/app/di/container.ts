import { HttpServiceInfoGateway } from '@/infrastructure/http/example/HttpServiceInfoGateway';
import type { ServiceInfoGateway } from '@/infrastructure/http/example/ServiceInfo';
import { FetchHttpClient } from '@/infrastructure/http/FetchHttpClient';
import type { HttpClient } from '@/infrastructure/http/HttpClient';
import { httpConfig } from '@/infrastructure/http/httpConfig';

/**
 * Composition root: único ponto de montagem das dependências (ver
 * `.kiro/steering/hexagonal-architecture.md` → Injeção de Dependências).
 *
 * Cria o HttpClient e os adapters concretos, expondo as portas (não as
 * implementações) à UI. Adapters nunca são instanciados no domínio/aplicação.
 * Mantido simples e explícito, sem framework de DI.
 */
export type Container = {
  readonly httpClient: HttpClient;
  readonly serviceInfoGateway: ServiceInfoGateway;
};

export function createContainer(): Container {
  const httpClient = new FetchHttpClient({ config: httpConfig });
  const serviceInfoGateway = new HttpServiceInfoGateway(httpClient);

  return { httpClient, serviceInfoGateway };
}
