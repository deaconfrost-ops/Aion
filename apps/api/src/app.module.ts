import { Global, Module } from '@nestjs/common';
import { RegistryService } from './registry/registry.service.js';
import { InProcessEventBus } from './common/event-bus.js';
import { PrismaService } from './common/prisma.service.js';
import { ALL_NEST_MODULES } from './registry/module-table.js';

/**
 * AppModule wires every module so its providers exist in the DI container.
 * Per-tenant *enablement* is enforced at request time by ModuleAccessGuard,
 * which asks RegistryService whether the tenant's resolved set includes the
 * module that owns the route (disabled module → 404). This is the pragmatic
 * modular-monolith pattern: one process, hard logical boundaries, routes that
 * appear/disappear per tenant.
 *
 * Boundary safety is guaranteed at boot: `new ModuleRegistry(ALL_MANIFESTS)`
 * inside RegistryService throws if any manifest violates niche → shared → core.
 */
@Global()
@Module({
  imports: [...ALL_NEST_MODULES],
  providers: [RegistryService, InProcessEventBus, PrismaService],
  exports: [RegistryService, InProcessEventBus, PrismaService],
})
export class AppModule {}
