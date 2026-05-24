import {
  CORE_MODULE_KEYS,
  LAYER_RANK,
  layerOf,
  type ModuleKey,
} from './keys.js';
import type { ModuleManifest } from './manifest.js';
import type { NicheProfile } from './niche.js';

export interface ResolveOptions {
  /** Entitlement keys the tenant currently pays for (from core/billing). */
  entitlements?: Set<string>;
}

export interface ResolveResult {
  /** Module keys to instantiate, in dependency order (deps before dependents). */
  enabled: ModuleKey[];
  /** Modules requested by the niche but withheld for lack of entitlement. */
  gatedOut: ModuleKey[];
}

/**
 * Resolves which modules a tenant runs, given its niche profile and entitlements.
 *
 * Algorithm:
 *  1. Start with all CORE modules (always on) + the niche's `enables` + its niche module.
 *  2. Take the transitive closure of `dependsOn`.
 *  3. Drop any non-core module whose `entitlement` isn't in the tenant's set.
 *  4. Topologically sort so dependencies boot first.
 *
 * Throws if the manifest graph violates layer rules or has a cycle.
 */
export class ModuleRegistry {
  private readonly byKey = new Map<ModuleKey, ModuleManifest>();

  constructor(manifests: ModuleManifest[]) {
    for (const m of manifests) {
      if (this.byKey.has(m.key)) {
        throw new Error(`Duplicate module manifest: ${m.key}`);
      }
      this.byKey.set(m.key, m);
    }
    this.assertLayerRules();
  }

  get(key: ModuleKey): ModuleManifest {
    const m = this.byKey.get(key);
    if (!m) throw new Error(`Unknown module: ${key}`);
    return m;
  }

  /** Enforces "imports flow downward only": a module may only depend on its own or lower layer. */
  private assertLayerRules(): void {
    for (const m of this.byKey.values()) {
      for (const dep of m.dependsOn) {
        const target = this.byKey.get(dep);
        if (!target) {
          throw new Error(`${m.key} depends on unknown module ${dep}`);
        }
        if (LAYER_RANK[layerOf(dep)] > LAYER_RANK[layerOf(m.key)]) {
          throw new Error(
            `Layer violation: ${m.key} (${layerOf(m.key)}) depends on ${dep} (${layerOf(dep)}). ` +
              `Imports must flow downward only (niche → shared → core).`,
          );
        }
      }
    }
  }

  resolve(profile: NicheProfile, opts: ResolveOptions = {}): ResolveResult {
    const entitlements = opts.entitlements ?? new Set<string>();

    // 1. seed set
    const requested = new Set<ModuleKey>([
      ...CORE_MODULE_KEYS,
      ...profile.enables,
      profile.nicheModule,
    ]);

    // 2. transitive closure of dependsOn
    const closure = new Set<ModuleKey>();
    const visit = (key: ModuleKey) => {
      if (closure.has(key)) return;
      closure.add(key);
      for (const dep of this.get(key).dependsOn) visit(dep);
    };
    for (const key of requested) visit(key);

    // 3. entitlement gate (core is never gated)
    const gatedOut: ModuleKey[] = [];
    const allowed = new Set<ModuleKey>();
    for (const key of closure) {
      const m = this.get(key);
      if (m.layer !== 'core' && m.entitlement && !entitlements.has(m.entitlement)) {
        gatedOut.push(key);
        continue;
      }
      allowed.add(key);
    }

    // 4. topological sort (deps first)
    const enabled = this.topoSort(allowed);
    return { enabled, gatedOut };
  }

  private topoSort(keys: Set<ModuleKey>): ModuleKey[] {
    const sorted: ModuleKey[] = [];
    const state = new Map<ModuleKey, 'visiting' | 'done'>();

    const visit = (key: ModuleKey) => {
      const s = state.get(key);
      if (s === 'done') return;
      if (s === 'visiting') throw new Error(`Dependency cycle involving ${key}`);
      state.set(key, 'visiting');
      for (const dep of this.get(key).dependsOn) {
        if (keys.has(dep)) visit(dep);
      }
      state.set(key, 'done');
      sorted.push(key);
    };

    for (const key of keys) visit(key);
    return sorted;
  }
}
