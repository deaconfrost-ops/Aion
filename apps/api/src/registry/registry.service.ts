import { Injectable } from '@nestjs/common';
import {
  ModuleRegistry,
  type ModuleKey,
  type NicheKey,
  type ResolveResult,
} from '@aion/module-kit';
import { ALL_MANIFESTS } from './module-table.js';
import { NICHE_PROFILES } from './niche-profiles.js';

/**
 * Wraps the framework-agnostic ModuleRegistry as an injectable service.
 * Constructed once at boot — the manifest graph is validated here, so a layer
 * violation or dependency cycle crashes the app on startup, not in production.
 */
@Injectable()
export class RegistryService {
  private readonly registry = new ModuleRegistry(ALL_MANIFESTS);

  /** Modules a tenant runs, given its niche and paid entitlements. */
  resolveForTenant(niche: NicheKey, entitlements: Set<string>): ResolveResult {
    const profile = NICHE_PROFILES[niche];
    if (!profile) throw new Error(`Unknown niche: ${niche}`);
    return this.registry.resolve(profile, { entitlements });
  }

  /** Convenience: is `module` enabled for a tenant on `niche` with `entitlements`? */
  isEnabled(niche: NicheKey, entitlements: Set<string>, module: ModuleKey): boolean {
    return this.resolveForTenant(niche, entitlements).enabled.includes(module);
  }
}
