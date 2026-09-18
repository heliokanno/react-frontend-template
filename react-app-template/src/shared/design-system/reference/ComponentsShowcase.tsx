import { Plus } from 'lucide-react';

import {
  Alert,
  Badge,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
  EmptyState,
  ErrorState,
  Input,
  Label,
  Skeleton,
  Spinner,
  Switch,
  useToast,
} from '@/shared/ui';

function ButtonsRow() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="primary">Primário</Button>
      <Button variant="secondary">Secundário</Button>
      <Button variant="tertiary">Terciário</Button>
      <Button variant="destructive">Excluir</Button>
      <Button variant="ghost">Ghost</Button>
      <Button isLoading>Carregando</Button>
    </div>
  );
}

function ToastDemo() {
  const { toast } = useToast();
  return (
    <Button
      variant="secondary"
      onClick={() => toast({ title: 'Alterações salvas', variant: 'success' })}
    >
      Exibir toast
    </Button>
  );
}

function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Abrir dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar exclusão</DialogTitle>
          <DialogDescription>Esta ação não pode ser desfeita.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="destructive">Excluir</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DropdownDemo() {
  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <Button variant="secondary">Ações</Button>
      </DropdownTrigger>
      <DropdownContent>
        <DropdownItem>Editar</DropdownItem>
        <DropdownItem>Duplicar</DropdownItem>
        <DropdownItem>Excluir</DropdownItem>
      </DropdownContent>
    </Dropdown>
  );
}

/** Vitrine dos componentes primitivos (spec 003) na página de referência. */
export function ComponentsShowcase() {
  return (
    <section aria-labelledby="components-title" className="flex flex-col gap-8">
      <h2 id="components-title" className="text-text-primary text-xl font-semibold">
        Componentes
      </h2>

      <div className="flex flex-col gap-3">
        <h3 className="text-text-secondary text-sm font-medium">Botões</h3>
        <ButtonsRow />
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-text-secondary text-sm font-medium">Controles de formulário</h3>
        <div className="flex max-w-sm flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="demo-name">Nome</Label>
            <Input id="demo-name" placeholder="Digite o nome" />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="demo-terms" />
            <Label htmlFor="demo-terms">Aceito os termos</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="demo-switch" />
            <Label htmlFor="demo-switch">Ativar notificações</Label>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-text-secondary text-sm font-medium">Feedback</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="neutral">Neutro</Badge>
          <Badge variant="success">Ativo</Badge>
          <Badge variant="warning">Pendente</Badge>
          <Badge variant="error">Erro</Badge>
        </div>
        <Alert variant="success" title="Tudo certo">
          Operação concluída com sucesso.
        </Alert>
        <Alert variant="error" title="Falha ao salvar">
          Verifique os dados e tente novamente.
        </Alert>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-text-secondary text-sm font-medium">Overlays e ações</h3>
        <div className="flex flex-wrap items-center gap-3">
          <ToastDemo />
          <DialogDemo />
          <DropdownDemo />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-text-secondary text-sm font-medium">Estados</h3>
        <div className="flex items-center gap-3">
          <Spinner />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
        <EmptyState
          icon={Plus}
          title="Nenhum item cadastrado"
          description="Cadastre o primeiro item para começar."
          action={<Button size="sm">Cadastrar</Button>}
        />
        <ErrorState onRetry={() => undefined} />
      </div>
    </section>
  );
}
