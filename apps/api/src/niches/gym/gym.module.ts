import { Module } from '@nestjs/common';
import { defineModule, type ModuleManifest } from '@aion/module-kit';

export const gymManifest: ModuleManifest = defineModule({
  key: 'gym',
  title: 'Gym',
  layer: 'niche',
  dependsOn: ['scheduling', 'crm', 'hr-payroll', 'analytics'],
  entitlement: 'niche.gym',
  permissions: [
    { key: 'gym:membership:write', description: 'Manage memberships', defaultRoles: ['owner', 'manager'] },
    { key: 'gym:class:write', description: 'Manage classes', defaultRoles: ['owner', 'manager'] },
  ],
  navigation: [{ key: 'memberships', label: 'Memberships', href: '/memberships', requires: 'gym:membership:write' }],
});

/**
 * NICHE/gym — adds memberships + class capacity on top of scheduling + crm.
 * TODO(Phase 5): membership tiers, class booking, check-ins.
 */
@Module({})
export class GymModule {}
