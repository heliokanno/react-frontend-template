/**
 * API pública da feature de autenticação (spec 008). O núcleo/UI consomem a
 * partir daqui; internals permanecem privados.
 */

export type { Session, CurrentUser, Credentials, SessionTokens } from './domain/Session';

export type { AuthGateway } from './application/ports/AuthGateway';
export type { TokenStorage } from './application/ports/TokenStorage';
export type { Login, Logout, RefreshSession } from './application/ports/usecases';
export {
  LoginService,
  LogoutService,
  RefreshSessionService,
} from './application/services/AuthService';

export { HttpAuthGateway } from './infrastructure/HttpAuthGateway';
export { InMemoryAuthGateway } from './infrastructure/InMemoryAuthGateway';
export { createLocalTokenStorage } from './infrastructure/tokenStorage';
export {
  createAccessTokenHolder,
  createAuthRequestInterceptor,
  type AccessTokenHolder,
} from './infrastructure/authTokenInterceptor';

export { AuthProvider } from './ui/AuthProvider';
export { useAuth } from './ui/useAuth';
export { useCurrentUser } from './ui/useCurrentUser';
export { LoginPage } from './ui/LoginPage';
export type { AuthContextValue, AuthStatus } from './ui/auth-context';
