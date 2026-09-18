/**
 * Constantes de rota tipadas. Evita strings mágicas espalhadas pela aplicação
 * (ver `.kiro/steering/frontend-architecture.md` → Routing).
 *
 * Features de negócio registram suas rotas via composição (spec 011); estas são
 * as rotas do núcleo.
 */
export const ROUTES = {
  root: '/',
  login: '/login',
  dashboard: '/dashboard',
  notFound: '*',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
