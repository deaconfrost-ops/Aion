# Devlog

## 2026-05-24

### Architecture decided — niche-aware modular monolith

Turned the [AION.md](AION.md) master prompt into a concrete modular design and scaffolded
the monorepo. Core decision: **capabilities are written once as shared modules; niches are
thin compositions that enable those modules and add only their unique domain logic.** We do
not fork the platform per customer type.

Three layers established:
- **CORE** (`apps/api/src/core/`) — auth, tenancy, rbac, billing, notifications, audit, ai. Always on.
- **SHARED** (`apps/api/src/modules/`) — inventory, providers, scheduling, resources, crm, hr-payroll, reviews, analytics. Toggled per niche + entitlement.
- **NICHE** (`apps/api/src/niches/`) — restaurant, salon, gym, cleaning, clinic, food-broker. Compose shared modules.

Key boundary rule (CI-enforced): **imports flow downward only — niche → shared → core.**
Cross-layer communication goes through the event bus or a published service interface.

Niche/module split clarified per the brief:
- **Ingredients/Recipes are niche-only** (restaurant + food-broker), NOT a shared module.
- **Providers + Inventory are shared** — reusable by tools/equipment, clinics, cleaning, etc.
- Hairdresser/salon = `resources` (chairs) + `scheduling` + `crm` + `hr-payroll`.
- **HR & Payroll is a shared module with a pluggable Quebec jurisdiction ruleset** (QPP, QPIP, EI, fed + QC income tax, vacation pay, CNESST) held as dated/versioned config — rules to be supplied later.

### Module contract (`packages/module-kit`)

Defined the contract every module implements: `ModuleManifest` (key, layer, `dependsOn`,
permissions, entitlement, widgets, nav, events) and `NicheProfile` (which shared modules a
niche `enables` + its own `nicheModule`). A `ModuleRegistry` resolves the dependency closure
∩ billing entitlements at boot and wires only those NestJS modules; disabled modules never
instantiate, their routes 404, nav/widgets hide.

### Reference niche chosen: Restaurant

Picked Restaurant as the first vertical slice because it exercises the most modules
end-to-end: Recipe (BoM) → Inventory → Providers → ordering, with auto stock-deduct on sale
and auto-PO on low stock. This is the proof that the layered design composes. Salon is the
planned second niche to prove reuse with minimal new code.

### Files created

- Docs: `ARCHITECTURE.md`, `DEVELOPMENT_PLAN.md`, `CLAUDE.md`, this `Devlog.md`.
- Monorepo root: `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `tsconfig.base.json`, `.gitignore`, `.env.example`, `README.md`.
- `packages/module-kit` — `ModuleManifest`/`NicheProfile`/`ModuleRegistry`/event-bus contract.
- `packages/{types,ui,config,utils}` — stubs.
- `apps/api` — NestJS skeleton: `AppModule`, `ModuleRegistry`, core + shared module folders with manifests, niche folders (restaurant fleshed out: recipes/menu/orders).
- `apps/web` — Next.js shell that renders nav/widgets from manifests.
- `prisma/schema.prisma` — tenant-scoped, module-prefixed models (tenancy + restaurant + inventory + providers starter).

### Next

Phase 0 wiring: make `pnpm dev` boot web + api with a fake restaurant tenant loading zero
modules, then build out CORE (Phase 1). See [DEVELOPMENT_PLAN.md](DEVELOPMENT_PLAN.md).
