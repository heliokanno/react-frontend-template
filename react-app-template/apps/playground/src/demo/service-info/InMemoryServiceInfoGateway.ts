import type { ServiceInfo, ServiceInfoGateway } from './ServiceInfo';

/**
 * Implementação fake em memória da porta, para testar consumidores sem HTTP
 * (ver `.kiro/steering/hexagonal-architecture.md` → Testabilidade).
 */
export class InMemoryServiceInfoGateway implements ServiceInfoGateway {
  constructor(
    private readonly info: ServiceInfo = { name: 'template', version: '0.0.0', healthy: true },
  ) {}

  fetchInfo(): Promise<ServiceInfo> {
    return Promise.resolve(this.info);
  }
}
