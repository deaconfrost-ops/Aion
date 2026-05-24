# @aion/module-kit

The contract that makes AION modular. Every module — core, shared, or niche — and every
niche profile is plain, serialisable data validated and wired by this package.

## Exports

| File          | Provides                                                                 |
|---------------|--------------------------------------------------------------------------|
| `keys.ts`     | `ModuleKey` unions per layer, `layerOf()`, `LAYER_RANK`.                  |
| `manifest.ts` | `ModuleManifest`, `defineModule()`, permission/widget/nav/event defs.     |
| `niche.ts`    | `NicheProfile`, `RoleDef`, `DEFAULT_ROLES`.                               |
| `events.ts`   | `EventBus`, `DomainEvent`, well-known `Events`.                           |
| `registry.ts` | `ModuleRegistry` — resolves niche profile + entitlements → ordered module list. |

## How the API uses it

```ts
const registry = new ModuleRegistry(allManifests); // throws on layer violations / cycles
const { enabled, gatedOut } = registry.resolve(restaurantProfile, {
  entitlements: tenant.entitlements,
});
// `enabled` is topologically sorted (deps first) → drives NestJS dynamic imports.
```

`ModuleRegistry` enforces the project's one rule at construction time: **a module may only
depend on its own layer or a lower one (niche → shared → core).** A violation throws before
the app can boot, so the boundary can't silently rot.
