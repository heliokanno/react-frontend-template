/**
 * Infraestrutura de formulários reutilizável (spec 007). React Hook Form +
 * Zod como fonte única de schema/tipos; campos acessíveis compondo os controles
 * de 003; estados de submissão e integração com erros da API (004).
 */

export { Form, type FormProps } from './Form';
export { FormField, type FormFieldProps, type FieldA11y } from './FormField';

export { TextField, type TextFieldProps } from './fields/TextField';
export { TextareaField, type TextareaFieldProps } from './fields/TextareaField';
export { CheckboxField, type CheckboxFieldProps } from './fields/CheckboxField';
export { SelectField, type SelectFieldProps, type SelectOption } from './fields/SelectField';

export { useFormSubmit, type SubmitStatus } from './useFormSubmit';
export { applyApiErrors } from './apiErrors';
