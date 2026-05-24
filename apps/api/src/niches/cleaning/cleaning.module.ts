import { Module } from '@nestjs/common';
import { defineModule, type ModuleManifest } from '@aion/module-kit';

export const cleaningManifest: ModuleManifest = defineModule({
  key: 'cleaning',
  title: 'Cleaning Company',
  layer: 'niche',
  dependsOn: ['scheduling', 'crm', 'hr-payroll', 'inventory', 'analytics'],
  entitlement: 'niche.cleaning',
  permissions: [
    { key: 'cleaning:job:write', description: 'Dispatch jobs', defaultRoles: ['owner', 'manager'] },
  ],
  navigation: [{ key: 'jobs', label: 'Jobs', href: '/jobs', requires: 'cleaning:job:write' }],
});

/**
 * NICHE/cleaning — job dispatch, crew routing, supply kits (uses inventory for
 * consumables). TODO(Phase 5).
 */
@Module({})
export class CleaningModule {}
