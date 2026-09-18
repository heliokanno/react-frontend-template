import { useFormContext, type FieldPath, type FieldValues } from 'react-hook-form';

import { FormField } from '../FormField';

import { Input, type InputProps } from '@/shared/ui/input/Input';

type TextFieldProps<TValues extends FieldValues> = {
  readonly name: FieldPath<TValues>;
  readonly label: string;
  readonly description?: string;
  readonly required?: boolean;
} & Omit<InputProps, 'id' | 'name' | 'aria-invalid' | 'aria-describedby'>;

/** Campo de texto de linha única, integrado ao formulário. */
export function TextField<TValues extends FieldValues>({
  name,
  label,
  description,
  required,
  ...inputProps
}: TextFieldProps<TValues>) {
  const { register } = useFormContext<TValues>();

  return (
    <FormField<TValues> name={name} label={label} description={description} required={required}>
      {({ id, describedBy, invalid }) => (
        <Input
          id={id}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          {...inputProps}
          {...register(name)}
        />
      )}
    </FormField>
  );
}

export type { TextFieldProps };
