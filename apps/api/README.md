# @aion/api

NestJS modular monolith. One process, hard logical boundaries.

```
src/
  main.ts                 bootstrap
  app.module.ts           wires every module; per-tenant gating at request time
  common/
    tenant-context.ts     AsyncLocalStorage TenantContext (tenantId, niche, role, entitlements)
    prisma.service.ts     Prisma + tenant-isolation middleware (auto tenantId)
    event-bus.ts          in-process EventBus (cross-module channel)
    module-access.guard.ts @RequiresModule(key) → 404 if module not enabled for tenant
  registry/
    module-table.ts       manifest ↔ NestJS module pairing (single source of truth)
    niche-profiles.ts     what each niche enables
    registry.service.ts   wraps @aion/module-kit ModuleRegistry; validates graph at boot
  core/        auth tenancy rbac billing notifications audit ai   (always on)
  modules/     inventory providers scheduling resources crm hr-payroll reviews analytics
  niches/      restaurant(+ menu/recipe/orders) salon gym cleaning clinic food-broker
```

## How per-tenant module enablement works

All modules are registered in `AppModule` so their providers exist. A request carries a
`TenantContext` (niche + entitlements). `ModuleAccessGuard` reads the `@RequiresModule(key)`
on the route and asks `RegistryService` whether that module is in the tenant's resolved set
(`niche profile ∩ entitlements`). If not → 404. So a salon tenant hitting `/api/menu`
(restaurant) gets a 404, even though the code is loaded.

Boundary safety is checked at **boot**: `RegistryService` constructs the `ModuleRegistry`,
which throws if any manifest violates **niche → shared → core** or forms a dependency cycle.

## Conventions

- Tag every controller with `@RequiresModule('<key>')`.
- Never deep-import across a layer — emit/consume via the `EventBus`.
- Every row is `tenantId`-scoped (middleware injects it); tables are module-prefixed.
