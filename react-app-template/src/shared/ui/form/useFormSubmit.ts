import { useCallback, useState } from 'react';
import type { FieldValues, SubmitHandler, UseFormReturn } from 'react-hook-form';

import { applyApiErrors } from './apiErrors';

import { toAppError } from '@/infrastructure/errors/toAppError';

export type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

type UseFormSubmitOptions<TValues extends FieldValues> = {
  readonly form: UseFormReturn<TValues>;
  /** Ação de submissão (ex.: chamar um caso de uso). Lança em caso de erro. */
  readonly onSubmit: (values: TValues) => Promise<void>;
  readonly onSuccess?: () => void;
};

/**
 * Gerencia os estados de submissão do formulário: idle/submitting/success/error.
 * Bloqueia submissões duplicadas, preserva os dados digitados após falha e
 * mapeia erros da API para os campos (erros de validação) ou para uma mensagem
 * geral. Ver `.kiro/steering/ux-design.md` → Form UX.
 */
export function useFormSubmit<TValues extends FieldValues>({
  form,
  onSubmit,
  onSuccess,
}: UseFormSubmitOptions<TValues>) {
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [generalError, setGeneralError] = useState<string | undefined>(undefined);

  const submitHandler: SubmitHandler<TValues> = useCallback(
    async (values) => {
      setStatus('submitting');
      setGeneralError(undefined);
      try {
        await onSubmit(values);
        setStatus('success');
        onSuccess?.();
      } catch (error) {
        const appError = toAppError(error);
        const { generalMessage } = applyApiErrors(appError, form.setError);
        setGeneralError(generalMessage);
        setStatus('error');
      }
    },
    [form.setError, onSubmit, onSuccess],
  );

  return {
    status,
    generalError,
    isSubmitting: status === 'submitting',
    submitHandler,
  };
}
