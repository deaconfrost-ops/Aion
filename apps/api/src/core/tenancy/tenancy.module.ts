import { Module } from '@nestjs/common';
import { defineModule, type ModuleManifest } from '@aion/module-kit';

export const tenancyManifest: ModuleManifest = defineModule({
  key: 'tenancy',
  title: 'Tenancy',
  layer: 'core',
  dependsOn: [],
  permissions: [
    { key: 'tenancy:member:invite', description: 'Invite members', defaultRoles: ['owner', 'manager'] },
    { key: 'tenancy:settings:write', description: 'Edit business settings', defaultRoles: ['owner'] },
  ],
  navigation: [{ key: 'settings', label: 'Settings', href: '/settings', requires: 'tenancy:settings:write' }],
});

/**
 * CORE/tenancy — Tenant (business) records, the active niche profile, members.
 * Owns the `niche` field that drives which modules a tenant runs.
 * TODO(Phase 1): Tenant CRUD, niche selection, member invites.
 */
@Module({})
export class TenancyModule {}
