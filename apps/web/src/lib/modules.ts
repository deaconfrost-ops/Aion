import {
  ModuleRegistry,
  type ModuleManifest,
  type NavItemDef,
  type DashboardWidgetDef,
  type NicheProfile,
} from '@aion/module-kit';

/**
 * The web shell is manifest-driven: nav and dashboard widgets come from the
 * tenant's enabled modules, never hard-coded per niche. In production this is
 * fetched from `GET /api/me/modules` (which the API computes via the same
 * ModuleRegistry). For the scaffold we resolve locally from a profile.
 *
 * NOTE: `ALL_MANIFESTS` here is intentionally a thin client copy. The API is the
 * source of truth; the web only needs each manifest's nav/widgets/permissions to
 * render. Keep this list in sync (or, preferred, serve it from the API).
 */
export function resolveNavAndWidgets(
  allManifests: ModuleManifest[],
  profile: NicheProfile,
  entitlements: Set<string>,
): { nav: NavItemDef[]; widgets: DashboardWidgetDef[] } {
  const registry = new ModuleRegistry(allManifests);
  const { enabled } = registry.resolve(profile, { entitlements });
  const byKey = new Map(allManifests.map((m) => [m.key, m]));

  const nav: NavItemDef[] = [];
  const widgets: DashboardWidgetDef[] = [];
  for (const key of enabled) {
    const m = byKey.get(key);
    if (!m) continue;
    nav.push(...(m.navigation ?? []));
    widgets.push(...(m.widgets ?? []));
  }
  return { nav, widgets };
}
