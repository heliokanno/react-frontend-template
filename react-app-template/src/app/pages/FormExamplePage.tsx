import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { HttpError } from '@/infrastructure/errors/toAppError';
import {
  Alert,
  Button,
  CheckboxField,
  Form,
  SelectField,
  TextField,
  TextareaField,
  useFormSubmit,
} from '@/shared/ui';

// Zod é a fonte única de schema; os tipos derivam dele.
const schema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
  role: z.string().min(1, 'Selecione um perfil'),
  bio: z.string().max(280, 'Máximo de 280 caracteres').optional(),
  terms: z.literal(true, { message: 'É necessário aceitar os termos' }),
});

type FormValues = z.infer<typeof schema>;

const ROLE_OPTIONS = [
  { value: 'admin', label: 'Administrador' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Leitor' },
];

/**
 * Página de exemplo da infraestrutura de formulários: validação por schema Zod,
 * estados de submissão e mapeamento de erros da API para os campos. Um CRUD
 * real via API é entregue na spec 012.
 */
export function FormExamplePage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', role: '', bio: '', terms: false as unknown as true },
  });

  const { submitHandler, isSubmitting, status, generalError } = useFormSubmit<FormValues>({
    form,
    onSubmit: async (values) => {
      // Simula o backend: e-mail duplicado retorna 422 com erro de campo
      // (ProblemDetail), como um adapter real faria.
      await new Promise((resolve) => setTimeout(resolve, 300));
      if (values.email === 'duplicado@exemplo.com') {
        throw new HttpError(422, {
          title: 'Validation failed',
          errors: { email: ['Este e-mail já está em uso'] },
        });
      }
    },
  });

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4 p-6">
      <h1 className="text-text-primary text-3xl font-bold">Formulário</h1>
      <p className="text-text-secondary">
        Exemplo com validação (Zod), estados de submissão e erros de campo da API.
      </p>

      {status === 'success' ? (
        <Alert variant="success" title="Enviado com sucesso">
          Os dados foram salvos.
        </Alert>
      ) : null}
      {generalError ? (
        <Alert variant="error" title="Não foi possível salvar">
          {generalError}
        </Alert>
      ) : null}

      <Form
        form={form}
        onSubmit={submitHandler}
        aria-label="Cadastro de usuário"
        className="flex flex-col gap-4"
      >
        <TextField<FormValues> name="name" label="Nome" required />
        <TextField<FormValues>
          name="email"
          label="E-mail"
          type="email"
          required
          description="Use duplicado@exemplo.com para simular erro do servidor."
        />
        <SelectField<FormValues> name="role" label="Perfil" required options={ROLE_OPTIONS} />
        <TextareaField<FormValues>
          name="bio"
          label="Bio"
          description="Opcional, até 280 caracteres."
        />
        <CheckboxField<FormValues> name="terms" label="Aceito os termos de uso" />

        <Button type="submit" isLoading={isSubmitting}>
          Salvar
        </Button>
      </Form>
    </div>
  );
}
