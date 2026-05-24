# @aion/web

Next.js (App Router) front end. **Manifest-driven**: the sidebar nav and dashboard widgets
are produced from the tenant's enabled module manifests, never hard-coded per niche.

```
src/
  app/
    layout.tsx     shell
    page.tsx       dashboard (renders nav + widgets from manifests)
  lib/
    modules.ts     resolveNavAndWidgets(profile, entitlements) → { nav, widgets }
```

In production, `GET /api/me/modules` (computed server-side by the same
`@aion/module-kit` `ModuleRegistry`) returns the enabled modules; the web maps each
manifest's `navigation` and `widgets` into the UI. Widget `component` ids resolve through a
client-side widget registry (to be added in Phase 1).
