/**
 * Autorização de UI (spec 009). Adapta a experiência conforme as permissões do
 * usuário. É UX, não segurança: a autorização real é sempre do backend.
 */

export { type Permission, hasPermission, hasAllPermissions, hasAnyPermission } from './permission';
export { PermissionProvider } from './PermissionProvider';
export { useHasPermission } from './useHasPermission';
export { Can } from './Can';
export {
  createPermissionRegistry,
  type PermissionRegistry,
  type PermissionDefinition,
} from './permissionRegistry';
