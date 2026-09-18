/**
 * Helpers de query keys padronizadas por feature, para invalidation previsível
 * (ver `.kiro/steering/tech.md` → Server State). Cada feature exporta sua
 * própria factory seguindo este padrão.
 *
 * @example
 * const productKeys = createQueryKeys('products');
 * productKeys.all            // ['products']
 * productKeys.list({ page }) // ['products', 'list', { page }]
 * productKeys.detail(id)     // ['products', 'detail', id]
 */
export function createQueryKeys<TFeature extends string>(feature: TFeature) {
  return {
    all: [feature] as const,
    lists: () => [feature, 'list'] as const,
    list: (params: Record<string, unknown>) => [feature, 'list', params] as const,
    details: () => [feature, 'detail'] as const,
    detail: (id: string) => [feature, 'detail', id] as const,
  };
}
