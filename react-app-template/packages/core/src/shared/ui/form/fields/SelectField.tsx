import { Controller, useFormContext, type FieldPath, type FieldValues } from 'react-hook-form';

import { FormField } from '../FormField';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select/Select';

export type SelectOption = { readonly value: string; readonly label: string };

type SelectFieldProps<TValues extends FieldValues> = {
  readonly name: FieldPath<TValues>;
  readonly label: string;
  readonly description?: string;
  readonly required?: boolean;
  readonly placeholder?: string;
  readonly options: readonly SelectOption[];
};

/** Campo select (controle Radix controlado via RHF Controller). */
export function SelectField<TValues extends FieldValues>({
  name,
  label,
  description,
  required,
  placeholder = 'Selecione...',
  options,
}: SelectFieldProps<TValues>) {
  const { control } = useFormContext<TValues>();

  return (
    <FormField<TValues> name={name} label={label} description={description} required={required}>
      {({ id, describedBy, invalid }) => (
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <Select value={field.value ?? ''} onValueChange={field.onChange}>
              <SelectTrigger
                id={id}
                aria-invalid={invalid || undefined}
                aria-describedby={describedBy}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      )}
    </FormField>
  );
}

export type { SelectFieldProps };
