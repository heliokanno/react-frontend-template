import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router';
import { z } from 'zod';

import { useAuth } from '@/features/auth/ui/useAuth';
import { Alert, Button, Form, TextField, useFormSubmit } from '@/shared/ui';

const schema = z.object({
  email: z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

type LoginValues = z.infer<typeof schema>;

type LocationState = { readonly from?: { readonly pathname?: string } };

/**
 * Tela de login: usa a infraestrutura de formulários (007) e os componentes
 * (003), e consome `useAuth` (008). Após autenticar, retorna ao destino
 * originalmente solicitado (preservado pelo guard em 005).
 */
export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const form = useForm<LoginValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const { submitHandler, isSubmitting, generalError } = useFormSubmit<LoginValues>({
    form,
    onSubmit: async (values) => {
      await login(values);
    },
    onSuccess: () => {
      const state = location.state as LocationState | null;
      const destination = state?.from?.pathname ?? '/dashboard';
      void navigate(destination, { replace: true });
    },
  });

  return (
    <div className="border-border-default bg-surface-elevated flex flex-col gap-6 rounded-lg border p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-text-primary text-2xl font-bold">Entrar</h1>
        <p className="text-text-secondary text-sm">Acesse sua conta para continuar.</p>
      </div>

      {generalError ? (
        <Alert variant="error" title="Não foi possível entrar">
          {generalError}
        </Alert>
      ) : null}

      <Form
        form={form}
        onSubmit={submitHandler}
        aria-label="Formulário de login"
        className="flex flex-col gap-4"
      >
        <TextField<LoginValues> name="email" label="E-mail" type="email" required />
        <TextField<LoginValues> name="password" label="Senha" type="password" required />
        <Button type="submit" isLoading={isSubmitting}>
          Entrar
        </Button>
      </Form>
    </div>
  );
}
