# AION

Niche-aware modular SaaS for small businesses. One codebase serves many industries — a
tenant picks a **niche** (restaurant, salon, gym, clinic…) which enables a curated set of
shared **modules** (inventory, providers, scheduling, resources, crm, hr-payroll…).

> Capabilities are written once as shared modules; niches are thin compositions.

## Docs

- [ARCHITECTURE.md](ARCHITECTURE.md) — the module system, layers, dependency graph, multi-tenancy.
- [DEVELOPMENT_PLAN.md](DEVELOPMENT_PLAN.md) — phased roadmap (Restaurant is the first reference niche).
- [CLAUDE.md](CLAUDE.md) — conventions / context guide.
- [Devlog.md](Devlog.md) — running history.
- [AION.md](AION.md) — original product brief.

## Layout

```
apps/web    Next.js front end (nav + widgets render from module manifests)
apps/api    NestJS modular monolith (core/ · modules/ · niches/)
packages/   module-kit (the module contract) · types · ui · config · utils
prisma/     schema.prisma (tenant-scoped, module-prefixed tables)
```

## Getting started

```bash
pnpm install
cp .env.example .env          # fill in DATABASE_URL etc.
pnpm db:generate
pnpm db:migrate
pnpm dev                      # boots apps/web + apps/api via Turborepo
```

## The one rule

Imports flow downward only: **niche → shared → core**. Cross a layer at runtime via the
event bus or a published service interface, never a deep import. See [CLAUDE.md](CLAUDE.md).
