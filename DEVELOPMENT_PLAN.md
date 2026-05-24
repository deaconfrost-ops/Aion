# AION — Development Plan

Roadmap for building the modular niche platform described in
[ARCHITECTURE.md](ARCHITECTURE.md). First reference niche: **Restaurant**.

Phases are ordered so the **module contract and one full vertical slice** exist before we
fan out to more modules and niches. We do not build all eight shared modules up front; we
build the ones the Restaurant slice needs, prove the composition works, then generalize.

---

## Phase 0 — Foundations (monorepo + contract)

Goal: a buildable monorepo where the module system exists, even if empty.

- [ ] pnpm + Turborepo workspace (`apps/*`, `packages/*`).
- [ ] `packages/module-kit` — `ModuleManifest`, `NicheProfile`, `ModuleRegistry`, event-bus interface.
- [ ] `packages/types`, `packages/config`, `packages/utils`, `packages/ui` stubs.
- [ ] `apps/api` NestJS skeleton: `AppModule` wires CORE only; `ModuleRegistry` resolves a niche profile at boot.
- [ ] `apps/web` Next.js skeleton: renders nav/widgets from manifests (empty for now).
- [ ] Prisma + Postgres connected; tenant middleware (`tenantId` from `AsyncLocalStorage`).
- [ ] CI: typecheck + lint + the layer-boundary rule (niche→shared→core only).

**Exit:** `pnpm dev` boots web + api; a fake "restaurant" tenant loads with zero modules.

---

## Phase 1 — CORE platform

Goal: every always-on capability the rest of the system assumes.

- [ ] `auth` — email/password, Google OAuth, magic links, sessions/JWT.
- [ ] `tenancy` — Tenant CRUD, niche selection, member invites.
- [ ] `rbac` — Owner/Manager/Employee roles + per-module permission registration.
- [ ] `audit` — append-only log middleware on all mutations.
- [ ] `notifications` — email + in-app channels (SMS/push stubbed).
- [ ] `billing` — Stripe subscriptions → entitlement map (which modules a tenant may enable).
- [ ] `ai` — provider-agnostic LLM client + prompt-template registry (Claude default).

**Exit:** an owner can sign up, create a restaurant tenant, invite an employee, and the
dashboard shell renders with role-gated empty nav.

---

## Phase 2 — Restaurant vertical slice (the proof)

Goal: one niche working end-to-end through composed shared modules. This is the milestone
that validates the entire architecture; build only what the slice needs.

- [ ] `inventory` (shared) — Items, units, stock levels, reorder points, stock moves.
- [ ] `providers` (shared) — Suppliers, item↔provider links, purchase orders, receiving.
- [ ] `restaurant` (niche) — MenuItems, **Recipes (Bill of Materials)** referencing inventory items, plate-cost rollup, order types (dine-in/takeout/delivery).
- [ ] Event flow: `sale.completed` → inventory decrements per recipe line → `stock.low` → providers drafts PO.
- [ ] `analytics` (minimal) — plate margin, food cost %, low-stock widget.

**Exit:** record a pizza sale → stock auto-decrements → low item auto-drafts a PO to the
preferred supplier. Re-point the same `inventory`+`providers` at a non-recipe catalog to
prove reuse.

---

## Phase 3 — HR & Payroll (Quebec)

Goal: the cross-niche workforce module, correct for Quebec. (Detailed rules to be supplied
later; build the engine to accept a pluggable jurisdiction ruleset.)

- [ ] `hr-payroll` — Employees, schedules, shifts, time tracking, clock in/out, time-off.
- [ ] Quebec payroll engine: QPP, QPIP, EI, federal + Quebec income tax, vacation pay (4%/6%), CNESST. Rates as versioned, dated config — never hard-coded.
- [ ] Pay runs, payslips, remittance summaries; export hooks for accounting.

**Exit:** run a pay period for restaurant staff with correct Quebec deductions on a test ruleset.

---

## Phase 4 — Second niche: Salon (proves reuse)

Goal: stand up a second industry mostly by composition, minimal new code.

- [ ] `resources` (shared) — bookable chairs/stations/rooms.
- [ ] `scheduling` (shared) — calendar, appointments, recurring, public booking page, reminders.
- [ ] `crm` (shared) — customers, history, tags, lead pipeline.
- [ ] `salon` (niche) — chair assignment, stylist rota, service menu (composes resources+scheduling+crm+hr-payroll).

**Exit:** a salon tenant books an appointment to a stylist+chair with no changes to
inventory/providers/restaurant code. Reuse ratio documented in Devlog.

---

## Phase 5 — Growth modules & niches

- [ ] `reviews` — review requests, Google sync, negative-feedback filtering.
- [ ] `analytics` (full) — revenue/retention/booking trends, exports.
- [ ] AI automations — no-show recovery, rebooking, upsell, lead follow-up (uses `core/ai`).
- [ ] Niches: `gym`, `cleaning`, `clinic`, `food-broker`.
- [ ] Notifications: SMS (Twilio) + push.

---

## Phase 6 — Hardening & launch

- [ ] Mobile-first polish, perf budgets, smooth transitions.
- [ ] Observability (logs/metrics/traces), rate limits, backups.
- [ ] Security review (multi-tenant isolation tests, RBAC fuzzing, PII handling).
- [ ] Pricing tiers (Starter/Pro/Business) wired to entitlements; usage-based billing.
- [ ] Beta with one real restaurant + one real salon.

---

## Build order rationale

1. **Contract before capabilities** (Phase 0) so every later module plugs in the same way.
2. **One deep vertical** (Restaurant, Phases 1–2) before broad horizontals — proves the
   layered design under real load instead of theory.
3. **Reuse test early** (Salon, Phase 4) catches leaky abstractions while they're cheap to fix.
4. Payroll (Phase 3) is isolated and jurisdiction-heavy, so it's built as a self-contained
   engine with dated rate config and slotted in once the workforce data model exists.

## Definition of done (per module)

- Implements `ModuleManifest` (key, deps, permissions, entitlement, widgets, nav, events).
- Respects layer rules (no upward imports); cross-layer talk via events/published interfaces.
- All tables `tenantId`-scoped and module-prefixed; tenant-isolation test passes.
- Unit + integration tests; permissions registered with rbac; entry in Devlog.
