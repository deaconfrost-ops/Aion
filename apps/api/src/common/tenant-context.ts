import { AsyncLocalStorage } from 'node:async_hooks';
import type { NicheKey } from '@aion/module-kit';

export interface TenantContext {
  tenantId: string;
  userId: string;
  niche: NicheKey;
  role: 'owner' | 'manager' | 'employee';
  entitlements: Set<string>;
}

/**
 * Request-scoped tenant context. Set by an auth middleware at the edge and read
 * everywhere downstream — notably by the Prisma middleware, which injects
 * `tenantId` into every query so modules never hand-write tenant filters.
 */
export const tenantStorage = new AsyncLocalStorage<TenantContext>();

export function currentTenant(): TenantContext {
  const ctx = tenantStorage.getStore();
  if (!ctx) throw new Error('No tenant context — request ran outside tenantStorage.run()');
  return ctx;
}

export function currentTenantOrNull(): TenantContext | undefined {
  return tenantStorage.getStore();
}
