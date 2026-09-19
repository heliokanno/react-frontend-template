import {
  createAccessTokenHolder,
  createAuthRequestInterceptor,
  createLocalTokenStorage,
  HttpAuthGateway,
  LoginService,
  LogoutService,
  RefreshSessionService,
  type AccessTokenHolder,
  type Login,
  type Logout,
  type RefreshSession,
  type TokenStorage,
} from '@/features/auth';
import { HttpServiceInfoGateway } from '@/infrastructure/http/example/HttpServiceInfoGateway';
import type { ServiceInfoGateway } from '@/infrastructure/http/example/ServiceInfo';
import { FetchHttpClient } from '@/infrastructure/http/FetchHttpClient';
import type { HttpClient } from '@/infrastructure/http/HttpClient';
import { httpConfig } from '@/infrastructure/http/httpConfig';

/**
 * Composition root: único ponto de montagem das dependências (ver
 * `.kiro/steering/hexagonal-architecture.md` → Injeção de Dependências).
 *
 * Cria o HttpClient (com o interceptor que anexa o token da sessão), os adapters
 * concretos e os casos de uso, expondo as portas (não as implementações) à UI.
 */
export type Container = {
  readonly httpClient: HttpClient;
  readonly serviceInfoGateway: ServiceInfoGateway;
  readonly auth: {
    readonly login: Login;
    readonly logout: Logout;
    readonly refreshSession: RefreshSession;
    readonly tokenStorage: TokenStorage;
    readonly tokenHolder: AccessTokenHolder;
  };
};

export function createContainer(): Container {
  // O holder guarda o token corrente; o interceptor o lê a cada request.
  const tokenHolder = createAccessTokenHolder();
  const httpClient = new FetchHttpClient({
    config: httpConfig,
    requestInterceptors: [createAuthRequestInterceptor(tokenHolder)],
  });

  const serviceInfoGateway = new HttpServiceInfoGateway(httpClient);

  const authGateway = new HttpAuthGateway(httpClient);
  const tokenStorage = createLocalTokenStorage();

  return {
    httpClient,
    serviceInfoGateway,
    auth: {
      login: new LoginService(authGateway),
      logout: new LogoutService(authGateway),
      refreshSession: new RefreshSessionService(authGateway),
      tokenStorage,
      tokenHolder,
    },
  };
}
