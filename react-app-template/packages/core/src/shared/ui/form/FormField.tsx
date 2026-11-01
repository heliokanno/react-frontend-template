import { type ReactNode } from 'react';
import { useFormContext, type FieldPath, type FieldValues } from 'react-hook-form';

import { Label } from '@/shared/ui/label/Label';

/** Ids derivados do nome do campo, para associação acessível. */
export type FieldA11y = {
  readonly id: string;
  readonly describedBy: string | undefined;
  readonly invalid: boolean;
};

type FormFieldProps<TValues extends FieldValues> = {
  readonly name: FieldPath<TValues>;
  readonly label: string;
  readonly description?: string | undefined;
  readonly required?: boolean | undefined;
  /** Render prop que recebe os atributos de acessibilidade do controle. */
  readonly children: (field: FieldA11y) => ReactNode;
};

/**
 * Campo de formulário acessível: associa label, descrição e mensagem de erro ao
 * controle via `aria-describedby`/`aria-invalid`. O controle concreto (Input,
 * Select, etc. de 003) é fornecido pelo consumidor via render prop, mantendo a
 * composição. Placeholder nunca substitui o label.
 */
export function FormField<TValues extends FieldValues>({
  name,
  label,
  description,
  required,
  children,
}: FormFieldProps<TValues>) {
  const {
    formState: { errors },
  } = useFormContext<TValues>();

  const error = errors[name];
  const errorMessage = typeof error?.message === 'string' ? error.message : undefined;

  const id = `field-${name}`;
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = errorMessage ? `${id}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>
        {label}
        {required ? (
          <span className="text-feedback-error ml-0.5" aria-hidden="true">
            *
          </span>
        ) : null}
      </Label>

      {children({ id, describedBy, invalid: Boolean(errorMessage) })}

      {description ? (
        <p id={descriptionId} className="text-text-muted text-xs">
          {description}
        </p>
      ) : null}

      {errorMessage ? (
        <p id={errorId} className="text-feedback-error text-xs">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}

export type { FormFieldProps };
