/**
 * Entry point raiz da biblioteca (`@hmk/react-admin-kit`).
 *
 * Agrega os módulos estáveis do núcleo reutilizável. Páginas, rotas e layouts
 * de exemplo NÃO são exportados — vivem no app de demonstração (playground).
 *
 * Para melhor tree-shaking, prefira importar o subpath específico
 * (ex.: `@hmk/react-admin-kit/ui`) em vez do raiz.
 */
export * from './ui';
export * from './design-system';
export * from './authorization';
export * from './auth';
export * from './http';
export * from './query';

export { toAsyncState, type AsyncState } from '@/shared/async/asyncState';
