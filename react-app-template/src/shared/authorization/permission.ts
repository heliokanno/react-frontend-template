/**
 * Modelo de permissões da UI. Uma permissão é um identificador tipado no
 * formato `recurso:ação` (ex.: `products:create`). A fonte é o backend (via
 * sessão); a UI apenas adapta a experiência — a autorização real é do backend
 * (ver `.kiro/steering/frontend-architecture.md` → Authorization).
 */
export type Permission = `${string}:${string}`;

/** Verifica se o conjunto de permissões concedidas satisfaz a exigida. */
export function hasPermission(granted: readonly string[], required: Permission): boolean {
  return granted.includes(required);
}

/** Verifica se todas as permissões exigidas estão presentes. */
export function hasAllPermissions(
  granted: readonly string[],
  required: readonly Permission[],
): boolean {
  return required.every((permission) => granted.includes(permission));
}

/** Verifica se ao menos uma das permissões exigidas está presente. */
export function hasAnyPermission(
  granted: readonly string[],
  required: readonly Permission[],
): boolean {
  return required.some((permission) => granted.includes(permission));
}
