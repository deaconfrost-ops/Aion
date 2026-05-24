import { Module } from '@nestjs/common';
import { defineModule, type ModuleManifest } from '@aion/module-kit';

export const authManifest: ModuleManifest = defineModule({
  key: 'auth',
  title: 'Authentication',
  layer: 'core',
  dependsOn: [],
  permissions: [],
});

/**
 * CORE/auth — email+password, Google OAuth, magic links, sessions/JWT.
 * Builds the TenantContext that the rest of the request relies on.
 * TODO(Phase 1): wire Auth.js (or Clerk) providers + session strategy.
 */
@Module({})
export class AuthModule {}
