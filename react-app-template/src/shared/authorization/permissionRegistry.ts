import { type Permission } from './permission';

/** Metadados de uma permissão registrada por uma feature. */
export type PermissionDefinition = {
  readonly permission: Permission;
  /** Descrição legível para documentação/telas de administração. */
  readonly description: string;
};

/**
 * Registro central de permissões conhecidas. Permite que features declarem suas
 * permissões sem o núcleo conhecer cada feature concreta (dependência aponta
 * para dentro; ver `.kiro/steering/product.md` → Extensibilidade). A spec 011
 * conecta isto ao mecanismo de composição de features.
 */
export function createPermissionRegistry() {
  const definitions = new Map<Permission, PermissionDefinition>();

  return {
    register(entries: readonly PermissionDefinition[]): void {
      for (const entry of entries) {
        definitions.set(entry.permission, entry);
      }
    },
    list(): readonly PermissionDefinition[] {
      return [...definitions.values()];
    },
    has(permission: Permission): boolean {
      return definitions.has(permission);
    },
  };
}

export type PermissionRegistry = ReturnType<typeof createPermissionRegistry>;
