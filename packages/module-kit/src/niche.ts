import type { ModuleKey, NicheKey, SharedModuleKey } from './keys.js';

export interface RoleDef {
  key: 'owner' | 'manager' | 'employee';
  label: string;
}

/**
 * A niche is a thin composition: it lists the shared modules it switches on,
 * names its own niche module, and declares its default roles. No domain logic
 * lives here — that's in the niche module under `apps/api/src/niches/`.
 */
export interface NicheProfile {
  key: NicheKey;
  title: string;
  /** Shared capability modules this niche turns on. */
  enables: SharedModuleKey[];
  /** The niche's own module key (e.g. 'restaurant'). */
  nicheModule: ModuleKey;
  defaultRoles: RoleDef[];
}

export const DEFAULT_ROLES: RoleDef[] = [
  { key: 'owner', label: 'Owner' },
  { key: 'manager', label: 'Manager' },
  { key: 'employee', label: 'Employee' },
];
