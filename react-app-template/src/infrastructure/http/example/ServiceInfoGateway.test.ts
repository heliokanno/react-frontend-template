import { describe, expect, it } from 'vitest';

import { InMemoryServiceInfoGateway } from './InMemoryServiceInfoGateway';
import type { ServiceInfoGateway } from './ServiceInfo';

// Consumidor de exemplo (equivalente a um caso de uso) que depende da porta,
// testável com um fake in-memory, sem HTTP (ver hexagonal-architecture.md).
async function isServiceHealthy(gateway: ServiceInfoGateway): Promise<boolean> {
  const info = await gateway.fetchInfo();
  return info.healthy;
}

describe('ServiceInfoGateway (fake in-memory)', () => {
  it('permite testar consumidores sem mockar HTTP', async () => {
    const gateway = new InMemoryServiceInfoGateway({
      name: 'template',
      version: '1.0.0',
      healthy: true,
    });

    expect(await isServiceHealthy(gateway)).toBe(true);
  });
});
