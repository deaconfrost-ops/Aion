/**
 * Canonical identifiers for every module and niche in AION.
 *
 * Keeping these as string-literal unions (not enums) gives us exhaustive
 * switch checks and lets manifests/profiles be plain serialisable data.
 */

/** CORE modules — always on, cannot be disabled. */
export const CORE_MODULE_KEYS = [
  'auth',
  'tenancy',
  'rbac',
  'billing',
  'notifications',
  'audit',
  'ai',
] as const;

/** SHARED capability modules — toggled per niche + entitlement. */
export const SHARED_MODULE_KEYS = [
  'inventory',
  'providers',
  'scheduling',
  'resources',
  'crm',
  'hr-payroll',
  'reviews',
  'analytics',
] as const;

/** NICHE modules — compose shared modules + add domain logic. */
export const NICHE_MODULE_KEYS = [
  'restaurant',
  'salon',
  'gym',
  'cleaning',
  'clinic',
  'food-broker',
] as const;

export type CoreModuleKey = (typeof CORE_MODULE_KEYS)[number];
export type SharedModuleKey = (typeof SHARED_MODULE_KEYS)[number];
export type NicheModuleKey = (typeof NICHE_MODULE_KEYS)[number];

export type ModuleKey = CoreModuleKey | SharedModuleKey | NicheModuleKey;

/** A niche key is the same string as its niche module key. */
export type NicheKey = NicheModuleKey;

export type ModuleLayer = 'core' | 'shared' | 'niche';

export function layerOf(key: ModuleKey): ModuleLayer {
  if ((CORE_MODULE_KEYS as readonly string[]).includes(key)) return 'core';
  if ((SHARED_MODULE_KEYS as readonly string[]).includes(key)) return 'shared';
  return 'niche';
}

/** Numeric rank used to enforce "imports flow downward only". */
export const LAYER_RANK: Record<ModuleLayer, number> = {
  core: 0,
  shared: 1,
  niche: 2,
};
