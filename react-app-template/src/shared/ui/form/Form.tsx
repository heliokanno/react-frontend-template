import { type ReactNode } from 'react';
import {
  FormProvider,
  type FieldValues,
  type SubmitHandler,
  type UseFormReturn,
} from 'react-hook-form';

type FormProps<TValues extends FieldValues> = {
  /** Instância do formulário (criada com `useForm` + resolver Zod). */
  readonly form: UseFormReturn<TValues>;
  readonly onSubmit: SubmitHandler<TValues>;
  readonly children: ReactNode;
  readonly className?: string;
  /** Rótulo acessível do formulário quando não houver título visível associado. */
  readonly 'aria-label'?: string;
};

/**
 * Wrapper sobre React Hook Form: provê o contexto do formulário aos campos e
 * conecta o submit. A validação vem do resolver Zod (fonte única de schema);
 * ver `.kiro/steering/tech.md` → Formulários e validação.
 */
export function Form<TValues extends FieldValues>({
  form,
  onSubmit,
  children,
  className,
  'aria-label': ariaLabel,
}: FormProps<TValues>) {
  return (
    <FormProvider {...form}>
      <form
        noValidate
        aria-label={ariaLabel}
        onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}
        className={className}
      >
        {children}
      </form>
    </FormProvider>
  );
}

export type { FormProps };
