import { zodResolver } from '@hookform/resolvers/zod';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { TextField } from './fields/TextField';
import { Form } from './Form';
import { useFormSubmit } from './useFormSubmit';

import { createAppError } from '@/infrastructure/errors/AppError';

// Formulário de teste sem Radix Select (que não é confiável em jsdom; coberto por E2E).
const schema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
});
type Values = z.infer<typeof schema>;

function TestForm({ onSubmit }: { onSubmit: (values: Values) => Promise<void> }) {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '' },
  });
  const { submitHandler, isSubmitting, status, generalError } = useFormSubmit<Values>({
    form,
    onSubmit,
  });

  return (
    <Form form={form} onSubmit={submitHandler} aria-label="Formulário de teste">
      <TextField<Values> name="name" label="Nome" required />
      <TextField<Values> name="email" label="E-mail" required />
      {status === 'success' ? <p role="status">Enviado com sucesso</p> : null}
      {generalError ? <p role="alert">{generalError}</p> : null}
      <button type="submit" disabled={isSubmitting}>
        Salvar
      </button>
    </Form>
  );
}

describe('Form (infraestrutura)', () => {
  it('bloqueia a submissão e mostra erros de validação', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<TestForm onSubmit={onSubmit} />);

    await userEvent.click(screen.getByRole('button', { name: /salvar/i }));

    expect(await screen.findByText(/nome é obrigatório/i)).toBeInTheDocument();
    expect(screen.getByText(/e-mail é obrigatório/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('valida o formato do e-mail', async () => {
    render(<TestForm onSubmit={vi.fn().mockResolvedValue(undefined)} />);

    await userEvent.type(screen.getByLabelText(/e-mail/i), 'invalido');
    await userEvent.click(screen.getByRole('button', { name: /salvar/i }));

    expect(await screen.findByText(/e-mail inválido/i)).toBeInTheDocument();
  });

  it('submete com dados válidos e sinaliza sucesso', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<TestForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText(/nome/i), 'Ana');
    await userEvent.type(screen.getByLabelText(/e-mail/i), 'ana@exemplo.com');
    await userEvent.click(screen.getByRole('button', { name: /salvar/i }));

    expect(await screen.findByRole('status')).toHaveTextContent(/enviado com sucesso/i);
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Ana', email: 'ana@exemplo.com' }),
    );
  });

  it('mapeia erro de campo vindo da API para o campo', async () => {
    const onSubmit = vi
      .fn()
      .mockRejectedValue(
        createAppError('validation', { fieldErrors: { email: ['Já está em uso'] } }),
      );
    render(<TestForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText(/nome/i), 'Ana');
    await userEvent.type(screen.getByLabelText(/e-mail/i), 'ana@exemplo.com');
    await userEvent.click(screen.getByRole('button', { name: /salvar/i }));

    expect(await screen.findByText(/já está em uso/i)).toBeInTheDocument();
  });

  it('exibe mensagem geral para erro não relacionado a campo', async () => {
    const onSubmit = vi.fn().mockRejectedValue(createAppError('server', { status: 500 }));
    render(<TestForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText(/nome/i), 'Ana');
    await userEvent.type(screen.getByLabelText(/e-mail/i), 'ana@exemplo.com');
    await userEvent.click(screen.getByRole('button', { name: /salvar/i }));

    expect(await screen.findByRole('alert')).toBeInTheDocument();
  });
});
