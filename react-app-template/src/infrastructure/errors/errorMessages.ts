import type { AppError, AppErrorKind } from './AppError';

/**
 * Mensagens de usuário por categoria de erro. Traduz `AppError` na borda de
 * apresentação, sem expor stack trace, status cru ou dados sensíveis
 * (ver `.kiro/steering/ux-design.md` → Error UX).
 */
const MESSAGES: Record<AppErrorKind, string> = {
  network: 'Não foi possível conectar. Verifique sua conexão e tente novamente.',
  timeout: 'A operação demorou mais que o esperado. Tente novamente.',
  unauthorized: 'Sua sessão expirou. Entre novamente para continuar.',
  forbidden: 'Você não tem permissão para realizar esta ação.',
  notFound: 'O recurso solicitado não foi encontrado.',
  validation: 'Verifique os dados informados e tente novamente.',
  conflict: 'Esta operação conflita com o estado atual dos dados.',
  server: 'Ocorreu um erro no servidor. Tente novamente em instantes.',
  unknown: 'Algo deu errado. Tente novamente.',
};

/** Retorna a mensagem de usuário adequada para um `AppError`. */
export function getErrorMessage(error: AppError): string {
  return MESSAGES[error.kind];
}
