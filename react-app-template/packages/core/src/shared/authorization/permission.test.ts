import { describe, expect, it } from 'vitest';

import { hasAllPermissions, hasAnyPermission, hasPermission } from './permission';

describe('permission helpers', () => {
  const granted = ['products:read', 'products:create'];

  it('hasPermission reconhece permissão concedida', () => {
    expect(hasPermission(granted, 'products:read')).toBe(true);
    expect(hasPermission(granted, 'products:delete')).toBe(false);
  });

  it('hasAllPermissions exige todas', () => {
    expect(hasAllPermissions(granted, ['products:read', 'products:create'])).toBe(true);
    expect(hasAllPermissions(granted, ['products:read', 'products:delete'])).toBe(false);
  });

  it('hasAnyPermission exige ao menos uma', () => {
    expect(hasAnyPermission(granted, ['products:delete', 'products:read'])).toBe(true);
    expect(hasAnyPermission(granted, ['products:delete'])).toBe(false);
  });
});
