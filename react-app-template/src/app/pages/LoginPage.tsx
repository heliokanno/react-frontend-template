/**
 * Página de login (placeholder). A implementação real — formulário, validação
 * e autenticação — é entregue na spec 008. Aqui serve para exercitar a rota
 * pública e o layout de autenticação.
 */
export function LoginPage() {
  return (
    <div className="border-border-default bg-surface-elevated flex flex-col gap-2 rounded-lg border p-6">
      <h1 className="text-text-primary text-2xl font-bold">Entrar</h1>
      <p className="text-text-secondary">
        A tela de login será implementada na spec 008 (autenticação e sessão).
      </p>
    </div>
  );
}
