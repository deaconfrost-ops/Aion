# AION — Claude Context Guide

AION is a **multi-tenant, niche-aware modular monolith** SaaS for small businesses. One
codebase, many industries: a tenant picks a **niche** (restaurant, salon, gym, clinic…)
which enables a curated set of **modules**. Capabilities are written once as shared
modules; niches are thin compositions.

Read [ARCHITECTURE.md](ARCHITECTURE.md) first, then [DEVELOPMENT_PLAN.md](DEVELOPMENT_PLAN.md).
Original product brief: [AION.md](AION.md). Running history: [Devlog.md](Devlog.md).

**Stack:** Next.js (web) · NestJS (api, modular monolith) · PostgreSQL + Prisma · pnpm + Turborepo · Stripe · Claude/LLM via `core/ai`.

---

## The one rule that shapes everything

**Layers flow downward only: `niche → shared → core`.**
- `core/*` must not import `modules/*` or `niches/*`.
- `modules/*` (shared) must not import `niches/*`.
- Crossing a layer at runtime → use the **event bus** or a published service interface, never a deep import.

This is what keeps AION from rotting into a per-customer fork. A CI lint enforces it.

---

## Where things live

```
apps/api/src/
  core/      auth · tenancy · rbac · billing · notifications · audit · ai   (always on)
  modules/   inventory · providers · scheduling · resources · crm ·
             hr-payroll · reviews · analytics                               (shared, toggled)
  niches/    restaurant · salon · gym · cleaning · clinic · food-broker     (compose shared)
apps/web/    Next.js; nav + dashboard widgets render from module manifests
packages/
  module-kit ModuleManifest, NicheProfile, ModuleRegistry, event bus  ← the contract
  types · ui · config · utils
prisma/      schema.prisma (tenant-scoped, module-prefixed tables)
```

## Module taxonomy (memorize this)

- **CORE** — platform plumbing every tenant gets, cannot be disabled.
- **SHARED** — industry-agnostic capabilities (inventory, providers, scheduling, resources, crm, hr-payroll, reviews, analytics). Enabled when the niche profile lists them **and** billing entitles them.
- **NICHE** — small package that declares which shared modules it needs and adds only its unique domain logic.

**Ingredients/Recipes are NOT shared** — they live inside `niches/restaurant` (reused by `food-broker`). **Providers + Inventory ARE shared** — a tools/equipment business reuses the same purchasing/stock machinery with no recipe code.

## Adding a module — checklist

1. Create the folder under the right layer (`core` / `modules` / `niches`).
2. Export a `ModuleManifest` (key, `dependsOn`, permissions, entitlement, widgets, nav, events).
3. Prisma models: `tenantId` on every row; table prefix per module (`inv_`, `prov_`, `sched_`, `res_`, `crm_`, `hr_`, `rest_`).
4. Register permissions with `rbac`; gate routes by entitlement + role.
5. Talk to other layers via events, not imports.
6. Add a [Devlog.md](Devlog.md) entry.

## Adding a niche

Write a `NicheProfile` listing the shared modules it `enables` + its own `nicheModule`. The
`ModuleRegistry` resolves the dependency closure ∩ entitlements at boot and wires only those
NestJS modules. Disabled modules are never instantiated; their routes 404, nav/widgets hide.

## Multi-tenancy invariants (do not break)

- Every domain row has `tenantId`. Never hand-write tenant filters — a Prisma middleware
  injects `tenantId` from request context (`AsyncLocalStorage`) into every query.
- RBAC checked per request: `(tenantId, userId) → role → module permissions`.
- Audit log captures every mutation.

## Reference flow (Restaurant — the architecture in one paragraph)

`restaurant` MenuItem has a Recipe (BoM) of `inventory` Items → plate cost = Σ(qty × item cost).
On sale, `restaurant` emits `sale.completed` → `inventory` decrements stock → emits `stock.low`
→ `providers` drafts a PO to the preferred supplier. Staff hours run through `hr-payroll`
(Quebec). Same inventory+providers serve a non-recipe retailer unchanged — that reuse is the test.

## Conventions

- TypeScript everywhere; shared types in `packages/types`.
- Payroll/tax rates are **dated, versioned config** (Quebec), never hard-coded constants.
- Money in integer minor units; quantities carry an explicit unit.
- Prefer composition over inheritance for niches; keep niche packages thin.

## Status

Pre-Phase-0 scaffold as of 2026-05-24. See [DEVELOPMENT_PLAN.md](DEVELOPMENT_PLAN.md) for phases; Restaurant is the first reference niche.
