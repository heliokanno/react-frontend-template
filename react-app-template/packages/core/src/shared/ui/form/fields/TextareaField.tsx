import { useFormContext, type FieldPath, type FieldValues } from 'react-hook-form';

import { FormField } from '../FormField';

import { Textarea, type TextareaProps } from '@/shared/ui/textarea/Textarea';

type TextareaFieldProps<TValues extends FieldValues> = {
  readonly name: FieldPath<TValues>;
  readonly label: string;
  readonly description?: string;
  readonly required?: boolean;
} & Omit<TextareaProps, 'id' | 'name' | 'aria-invalid' | 'aria-describedby'>;

/** Campo de texto multi-linha, integrado ao formulário. */
export function TextareaField<TValues extends FieldValues>({
  name,
  label,
  description,
  required,
  ...textareaProps
}: TextareaFieldProps<TValues>) {
  const { register } = useFormContext<TValues>();

  return (
    <FormField<TValues> name={name} label={label} description={description} required={required}>
      {({ id, describedBy, invalid }) => (
        <Textarea
          id={id}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          {...textareaProps}
          {...register(name)}
        />
      )}
    </FormField>
  );
}

export type { TextareaFieldProps };
