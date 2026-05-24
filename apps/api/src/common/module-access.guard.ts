import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { ModuleKey } from '@aion/module-kit';
import { RegistryService } from '../registry/registry.service.js';
import { currentTenant } from './tenant-context.js';

export const MODULE_KEY = 'aion:module';

/** Tag a controller/route with the module that owns it. */
export const RequiresModule = (key: ModuleKey) => SetMetadata(MODULE_KEY, key);

/**
 * Per-request gate: if the route's owning module isn't in the tenant's resolved
 * set (niche profile ∩ entitlements), the route behaves as if it doesn't exist
 * (404). This is what makes a single process present a different surface area to
 * a restaurant vs. a salon vs. an unentitled tenant.
 */
@Injectable()
export class ModuleAccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly registry: RegistryService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const moduleKey = this.reflector.getAllAndOverride<ModuleKey | undefined>(MODULE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!moduleKey) return true; // untagged route → no module gate

    const { niche, entitlements } = currentTenant();
    if (!this.registry.isEnabled(niche, entitlements, moduleKey)) {
      throw new NotFoundException();
    }
    return true;
  }
}
