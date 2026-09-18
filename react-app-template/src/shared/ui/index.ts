/**
 * API pública do catálogo de componentes primitivos do núcleo (spec 003).
 * Features e o shell consomem os componentes a partir daqui.
 */

export { cn } from './cn';

export { Button, buttonVariants, type ButtonProps } from './button/Button';

export { Input, type InputProps } from './input/Input';
export { Textarea, type TextareaProps } from './textarea/Textarea';
export { Label, type LabelProps } from './label/Label';
export { Checkbox, type CheckboxProps } from './checkbox/Checkbox';
export { Switch, type SwitchProps } from './switch/Switch';
export {
  RadioGroup,
  RadioGroupItem,
  type RadioGroupProps,
  type RadioGroupItemProps,
} from './radio-group/RadioGroup';
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from './select/Select';

export { Alert, type AlertProps } from './alert/Alert';
export { Badge, type BadgeProps } from './badge/Badge';

export { ToastProvider } from './toast/ToastProvider';
export { useToast } from './toast/useToast';
export type { Toast, ToastOptions, ToastVariant } from './toast/toast-context';

export { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from './tooltip/Tooltip';

export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './dialog/Dialog';

export {
  Drawer,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
} from './drawer/Drawer';

export {
  Dropdown,
  DropdownTrigger,
  DropdownLabel,
  DropdownGroup,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
} from './dropdown/Dropdown';

export { Skeleton } from './skeleton/Skeleton';
export { Spinner, type SpinnerProps } from './spinner/Spinner';
export { EmptyState, type EmptyStateProps } from './empty-state/EmptyState';
export { ErrorState, type ErrorStateProps } from './error-state/ErrorState';
