import { Controller, useFormContext, type FieldPath, type FieldValues } from 'react-hook-form';

import { Checkbox } from '@/shared/ui/checkbox/Checkbox';
import { Label } from '@/shared/ui/label/Label';

type CheckboxFieldProps<TValues extends FieldValues> = {
  readonly name: FieldPath<TValues>;
  readonly label: string;
  readonly description?: string;
};

/** Campo checkbox (controle Radix controlado via RHF Controller). */
export function CheckboxField<TValues extends FieldValues>({
  name,
  label,
  description,
}: CheckboxFieldProps<TValues>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<TValues>();

  const error = errors[name];
  const errorMessage = typeof error?.message === 'string' ? error.message : undefined;
  const id = `field-${name}`;
  const errorId = errorMessage ? `${id}-error` : undefined;
  const descriptionId = description ? `${id}-description` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <Checkbox
              id={id}
              checked={Boolean(field.value)}
              onCheckedChange={(checked) => field.onChange(checked === true)}
              onBlur={field.onBlur}
              ref={field.ref}
              aria-invalid={errorMessage ? true : undefined}
              aria-describedby={[descriptionId, errorId].filter(Boolean).join(' ') || undefined}
            />
          )}
        />
        <Label htmlFor={id}>{label}</Label>
      </div>
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

export type { CheckboxFieldProps };
