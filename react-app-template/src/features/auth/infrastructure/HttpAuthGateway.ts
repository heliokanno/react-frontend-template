import type { AuthGateway } from '@/features/auth/application/ports/AuthGateway';
import type { Credentials, Session, SessionTokens } from '@/features/auth/domain/Session';
import type { HttpClient } from '@/infrastructure/http/HttpClient';

/** DTO retornado pela API de autenticação. Difere do modelo de domínio. */
type AuthResponseDto = {
  readonly access_token: string;
  readonly refresh_token?: string;
  readonly user: {
    readonly id: string;
    readonly name: string;
    readonly email: string;
  };
};

function toSession(dto: AuthResponseDto): Session {
  return {
    user: { id: dto.user.id, name: dto.user.name, email: dto.user.email },
    tokens: {
      accessToken: dto.access_token,
      ...(dto.refresh_token !== undefined ? { refreshToken: dto.refresh_token } : {}),
    },
  };
}

/**
 * Adapter HTTP da porta `AuthGateway`. Só ele conhece endpoints, formato do DTO
 * e o mapeamento para o domínio. Compatível com JWT/OAuth2 Resource Server.
 */
export class HttpAuthGateway implements AuthGateway {
  constructor(private readonly http: HttpClient) {}

  async login(credentials: Credentials): Promise<Session> {
    const dto = await this.http.post<AuthResponseDto>('/auth/login', credentials);
    return toSession(dto);
  }

  async refresh(tokens: SessionTokens): Promise<Session> {
    const dto = await this.http.post<AuthResponseDto>('/auth/refresh', {
      refresh_token: tokens.refreshToken,
    });
    return toSession(dto);
  }

  async logout(tokens: SessionTokens): Promise<void> {
    await this.http.post<void>('/auth/logout', { refresh_token: tokens.refreshToken });
  }
}
