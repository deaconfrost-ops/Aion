import type { ModuleKey, ModuleLayer } from './keys.js';

/** A permission a module registers with `core/rbac`, e.g. `inventory:item:write`. */
export interface PermissionDef {
  /** `${moduleKey}:${resource}:${action}` */
  key: string;
  description: string;
  /** Roles granted this permission by default. */
  defaultRoles: Array<'owner' | 'manager' | 'employee'>;
}

/** A dashboard widget a module contributes to the shell. */
export interface DashboardWidgetDef {
  key: string;
  title: string;
  /** Web component id resolved by apps/web's widget registry. */
  component: string;
  /** Permission required to see it (optional). */
  requires?: string;
}

/** A navigation entry a module contributes to the web nav. */
export interface NavItemDef {
  key: string;
  label: string;
  href: string;
  icon?: string;
  requires?: string;
}

/** The event-bus contract a module participates in. */
export interface EventContract {
  /** Event names this module publishes, e.g. `sale.completed`. */
  emits: string[];
  /** Event names this module subscribes to, e.g. `stock.low`. */
  consumes: string[];
}

/** Billing gate. Omit for always-free / core modules. */
export type EntitlementKey = string;

/**
 * The single contract every AION module implements — core, shared or niche.
 * The platform discovers, enables, gates and bills modules purely through this.
 */
export interface ModuleManifest {
  key: ModuleKey;
  title: string;
  layer: ModuleLayer;

  /** Other modules this one needs. Resolved into NestJS imports at boot. */
  dependsOn: ModuleKey[];

  permissions: PermissionDef[];

  /** Billing entitlement required to enable this module; omit for always-on. */
  entitlement?: EntitlementKey;

  widgets?: DashboardWidgetDef[];
  navigation?: NavItemDef[];
  events?: EventContract;
}

/** Convenience builder that fills optional fields with safe defaults. */
export function defineModule(
  m: Omit<ModuleManifest, 'widgets' | 'navigation' | 'events'> &
    Partial<Pick<ModuleManifest, 'widgets' | 'navigation' | 'events'>>,
): ModuleManifest {
  return {
    widgets: [],
    navigation: [],
    events: { emits: [], consumes: [] },
    ...m,
  };
}
