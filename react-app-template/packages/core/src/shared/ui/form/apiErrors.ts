import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';

import type { AppError } from '@/infrastructure/errors/AppError';
import { getErrorMessage } from '@/infrastructure/errors/errorMessages';

/**
 * Aplica erros de validação vindos da API (AppError com `fieldErrors`) aos
 * campos do formulário via `setError` do RHF. Retorna a mensagem geral quando
 * o erro não é de campo (para exibir em Alert/Toast), sem detalhes técnicos.
 */
export function applyApiErrors<TValues extends FieldValues>(
  error: AppError,
  setError: UseFormSetError<TValues>,
): { readonly generalMessage: string | undefined } {
  if (error.kind === 'validation' && error.fieldErrors) {
    for (const [field, messages] of Object.entries(error.fieldErrors)) {
      const message = messages[0];
      if (message) {
        setError(field as Path<TValues>, { type: 'server', message });
      }
    }
    return { generalMessage: undefined };
  }

  return { generalMessage: getErrorMessage(error) };
}
