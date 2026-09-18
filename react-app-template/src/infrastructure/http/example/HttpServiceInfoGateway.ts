import type { ServiceInfo, ServiceInfoGateway } from './ServiceInfo';

import type { HttpClient } from '@/infrastructure/http/HttpClient';

/** Formato retornado pela API (DTO). Difere do modelo da aplicação. */
type ServiceInfoDto = {
  readonly service_name: string;
  readonly version: string;
  readonly status: 'UP' | 'DOWN';
};

/** Mapper DTO → modelo, na borda. O modelo nunca importa o DTO. */
function toServiceInfo(dto: ServiceInfoDto): ServiceInfo {
  return {
    name: dto.service_name,
    version: dto.version,
    healthy: dto.status === 'UP',
  };
}

/**
 * Adapter concreto da porta `ServiceInfoGateway`, usando o HttpClient.
 * Só o adapter conhece URLs, formato do DTO e o mapeamento.
 */
export class HttpServiceInfoGateway implements ServiceInfoGateway {
  constructor(private readonly http: HttpClient) {}

  async fetchInfo(): Promise<ServiceInfo> {
    const dto = await this.http.get<ServiceInfoDto>('/service-info');
    return toServiceInfo(dto);
  }
}
