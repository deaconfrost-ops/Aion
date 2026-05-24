# AION — Architecture

AION is a **multi-tenant, niche-aware modular monolith**. One codebase serves many
industries (restaurants, salons, gyms, clinics, cleaning companies…). Each business
("tenant") selects a **niche**, and that niche turns on a curated set of **modules**.

The whole architecture rests on one idea:

> **Capabilities are written once as shared modules; niches are thin compositions
> that enable those modules and add only the domain logic unique to them.**

A restaurant and a salon both need Inventory, Providers, Scheduling, CRM and Payroll.
They differ only in a small niche layer (recipes/ingredients vs. chairs/stations). We
never fork the platform per customer type — we toggle modules and add a niche package.

---

## 1. The three layers

```
┌─────────────────────────────────────────────────────────────────────┐
│  CORE (always on, every tenant)                                       │
│  auth · tenancy · rbac · billing · notifications · audit · ai-engine  │
├─────────────────────────────────────────────────────────────────────┤
│  SHARED CAPABILITY MODULES (toggled per niche, reused everywhere)     │
│  inventory · providers · scheduling · resources · crm ·              │
│  hr-payroll · reviews · analytics                                     │
├─────────────────────────────────────────────────────────────────────┤
│  NICHE MODULES (compose shared modules + add domain logic)            │
│  restaurant · salon · gym · cleaning · clinic · food-broker          │
└─────────────────────────────────────────────────────────────────────┘
```

### Core (`apps/api/src/core/`)
Non-negotiable platform plumbing. Present for every tenant, cannot be disabled.

| Module          | Responsibility                                                        |
|-----------------|-----------------------------------------------------------------------|
| `auth`          | Email/password, Google OAuth, magic links, sessions, JWT.             |
| `tenancy`       | Tenant (business) records, the active **niche profile**, member links. |
| `rbac`          | Roles (Owner/Manager/Employee) + per-module permissions.              |
| `billing`       | Stripe subscriptions, plans, entitlements (which modules a tenant pays for). |
| `notifications` | Email/SMS/in-app/push fan-out used by every other module.            |
| `audit`         | Append-only audit log of mutating actions.                            |
| `ai`            | LLM abstraction layer + prompt templates + automation engine.        |

### Shared capability modules (`apps/api/src/modules/`)
Industry-agnostic building blocks. A module is enabled for a tenant only if its niche
profile lists it **and** billing entitles it.

| Module        | Owns                                                       | Used by (examples)                         |
|---------------|-----------------------------------------------------------|--------------------------------------------|
| `inventory`   | Items, units, stock levels, reorder points, stock moves.  | restaurant, clinic, cleaning, food-broker  |
| `providers`   | Suppliers/vendors, item↔provider links, purchase orders.  | restaurant, tools/equipment, clinic        |
| `scheduling`  | Calendar, appointments, recurring slots, public booking.  | salon, gym, clinic                         |
| `resources`   | Bookable physical resources (chairs, rooms, tables, gear).| salon (chairs), clinic (rooms), restaurant (tables) |
| `crm`         | Customers, leads, pipeline, segmentation, history.        | all                                        |
| `hr-payroll`  | Employees, schedules, time tracking, **Quebec payroll/tax**.| all                                       |
| `reviews`     | Review requests, Google review sync, sentiment filtering.  | salon, restaurant, gym                     |
| `analytics`   | Cross-module metrics, dashboards, exports.                | all                                        |

### Niche modules (`apps/api/src/niches/`)
Thin packages that (a) declare which shared modules they need, and (b) add the small
amount of domain logic that is genuinely unique to the industry.

| Niche         | Enables (shared modules)                          | Adds (niche-only logic)                          |
|---------------|---------------------------------------------------|--------------------------------------------------|
| `restaurant`  | inventory, providers, resources, crm, hr-payroll, analytics | **Recipes/Menu → Ingredients (BoM), plate cost rollup, order types (dine-in/takeout/delivery), auto-deduct stock on sale** |
| `salon`       | resources, scheduling, crm, hr-payroll, reviews, analytics | Chair/station assignment, stylist rota, service menu |
| `gym`         | scheduling, crm, hr-payroll, analytics            | Memberships, class capacity                       |
| `cleaning`    | scheduling, crm, hr-payroll, inventory, analytics | Job dispatch, crew routing, supply kits          |
| `clinic`      | scheduling, resources, crm, hr-payroll, inventory | Patients, rooms, medical-supply stock            |
| `food-broker` | inventory, providers, crm, analytics              | Wholesale catalog, ingredient/product lots, B2B orders |

> **Ingredients live only in `restaurant` (and reuse by `food-broker`).** They are *not*
> a shared module. Providers + Inventory **are** shared, so a tools-and-equipment business
> reuses the exact same purchasing/stock machinery without ever importing recipe logic.

---

## 2. The module contract (`packages/module-kit`)

Every module — core, shared, or niche — implements the same contract so the platform can
discover, enable, gate and bill it uniformly.

```ts
// packages/module-kit/src/manifest.ts
export interface ModuleManifest {
  key: ModuleKey;                 // 'inventory', 'restaurant', …
  title: string;
  layer: 'core' | 'shared' | 'niche';
  dependsOn: ModuleKey[];         // resolved into NestJS imports at boot
  permissions: PermissionDef[];   // registered with rbac
  entitlement?: EntitlementKey;   // billing gate; omit for always-free
  widgets?: DashboardWidgetDef[]; // contributed to the dashboard shell
  navigation?: NavItemDef[];      // contributed to the web nav
  events?: { emits: string[]; consumes: string[] }; // event-bus contract
}
```

A **niche** is expressed as a profile that just lists module keys:

```ts
// packages/module-kit/src/niche.ts
export interface NicheProfile {
  key: NicheKey;                  // 'restaurant'
  title: string;
  enables: ModuleKey[];           // shared modules switched on
  nicheModule: ModuleKey;         // the niche's own module
  defaultRoles: RoleDef[];
}
```

**Dependency resolution.** At boot, `ModuleRegistry` reads the tenant's `NicheProfile`,
takes the transitive closure of `dependsOn`, intersects it with billing entitlements, and
wires the resulting NestJS modules. Disabled modules are never instantiated, their routes
404, and their nav/widgets never render.

---

## 3. Module dependency graph

```
                         ┌──────────┐
                         │  CORE    │  (auth, tenancy, rbac, billing,
                         └────┬─────┘   notifications, audit, ai)
                              │ every module may depend on core
        ┌─────────────────────┼─────────────────────────────┐
        ▼                     ▼                               ▼
   ┌─────────┐          ┌──────────┐                   ┌──────────┐
   │inventory│◄─────────│providers │                   │scheduling│
   └────┬────┘          └──────────┘                   └────┬─────┘
        │                                                   │
        │                                              ┌────▼─────┐
        │                                              │resources │
        │                                              └────┬─────┘
        │                                                   │
   ┌────▼───────── niches ──────────────────────────────────▼────┐
   │ restaurant → inventory, providers, resources, crm, hr-payroll │
   │ salon      → resources, scheduling, crm, hr-payroll, reviews  │
   │ clinic     → scheduling, resources, inventory, crm, hr-payroll│
   └──────────────────────────────────────────────────────────────┘

crm · hr-payroll · analytics · reviews depend only on CORE and are
available to any niche.
```

Rules enforced in code (lint + boot-time check):
- **Niche → shared → core only.** Shared modules must not import niche modules. Core must
  not import shared or niche modules. (Prevents the platform from rotting into per-customer forks.)
- Cross-module communication that crosses a layer boundary goes through the **event bus**
  or a **published service interface**, never a deep import.
- `providers` depends on `inventory` (a purchase order restocks inventory items).

---

## 4. Multi-tenancy & data isolation

- Every business is a **Tenant**. Every domain row carries `tenantId`.
- Isolation is enforced at the data layer via a Prisma middleware that injects
  `tenantId` from the request context (`AsyncLocalStorage`) into every query — modules
  never hand-write tenant filters.
- Postgres schema is **module-namespaced** by table prefix (`inv_`, `prov_`, `sched_`,
  `res_`, `crm_`, `hr_`, `rest_`) so ownership is obvious and a module can later be
  extracted to its own service/database without a rename.
- RBAC is checked per request: `(tenantId, userId) → role → module permissions`.

---

## 5. Reference flow — Restaurant (proves the architecture)

A pizza sale touches four modules without any of them knowing about "pizza":

1. **`restaurant`** defines a *MenuItem* "Margherita" with a *Recipe* (Bill of Materials):
   `200g flour, 150g san-marzano, 125g mozzarella…`. Each line points at an **`inventory`** Item.
2. Plate cost = Σ(line qty × inventory item unit cost) — rolled up by `restaurant`, priced
   off `inventory` cost data. Margin shown in `analytics`.
3. On sale, `restaurant` emits `sale.completed`; **`inventory`** consumes it and decrements
   stock for each recipe line (a stock move).
4. When an item drops below its reorder point, `inventory` emits `stock.low`; **`providers`**
   consumes it, finds the preferred supplier for that item, and drafts a **purchase order** —
   "contact provider X for item Y." Owner approves; receiving the PO restocks `inventory`.
5. Staff hours behind all of this run through **`hr-payroll`** (Quebec rules), payable
   independent of the restaurant logic.

Swap `restaurant` for a tools-and-equipment retailer: steps 3–4 are **identical** — same
inventory + providers machinery — only step 1's "recipe" disappears. That reuse is the
whole point.

---

## 6. Tech mapping

| Concern              | Choice                          | Why                                                        |
|----------------------|---------------------------------|------------------------------------------------------------|
| API framework        | **NestJS** (modular monolith)   | Its `@Module` DI maps 1:1 to our module contract.          |
| Web                  | Next.js + React + TS + Tailwind + shadcn/ui | Per master prompt; nav/widgets driven by manifests. |
| DB / ORM             | PostgreSQL + Prisma             | Tenant middleware + module-namespaced tables.              |
| Auth                 | Auth.js (or Clerk) via `core/auth` |                                                        |
| Payments             | Stripe via `core/billing` → entitlements |                                                   |
| AI                   | Provider-agnostic layer in `core/ai` (Claude default) | Prompt templates + automation engine.       |
| Realtime             | Supabase Realtime / WebSockets  | Dashboard live updates.                                    |
| Monorepo             | pnpm workspaces + Turborepo     | `apps/*` + `packages/*`.                                   |
| Event bus            | In-process emitter now → Redis/queue later | Lets modules stay decoupled, extraction-ready.   |

See [DEVELOPMENT_PLAN.md](DEVELOPMENT_PLAN.md) for build phases and
[CLAUDE.md](CLAUDE.md) for working conventions.
