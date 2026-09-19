/**
 * Domínio de sessão. Não depende de React, HTTP ou storage
 * (ver `.kiro/steering/hexagonal-architecture.md` → Domain).
 */

export type CurrentUser = {
  readonly id: string;
  readonly name: string;
  readonly email: string;
};

/** Tokens da sessão. O refresh token pode não existir dependendo da estratégia. */
export type SessionTokens = {
  readonly accessToken: string;
  readonly refreshToken?: string;
};

/** Sessão autenticada: usuário atual + tokens. */
export type Session = {
  readonly user: CurrentUser;
  readonly tokens: SessionTokens;
};

export type Credentials = {
  readonly email: string;
  readonly password: string;
};
