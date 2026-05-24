import { Module } from '@nestjs/common';
import { defineModule, type ModuleManifest } from '@aion/module-kit';

export const clinicManifest: ModuleManifest = defineModule({
  key: 'clinic',
  title: 'Clinic',
  layer: 'niche',
  dependsOn: ['scheduling', 'resources', 'crm', 'hr-payroll', 'inventory', 'analytics'],
  entitlement: 'niche.clinic',
  permissions: [
    { key: 'clinic:patient:read', description: 'View patients', defaultRoles: ['owner', 'manager', 'employee'] },
    { key: 'clinic:patient:write', description: 'Manage patients', defaultRoles: ['owner', 'manager'] },
  ],
  navigation: [{ key: 'patients', label: 'Patients', href: '/patients', requires: 'clinic:patient:read' }],
});

/**
 * NICHE/clinic — patients, rooms (via resources), medical-supply stock (via
 * inventory), appointments (via scheduling). TODO(Phase 5).
 */
@Module({})
export class ClinicModule {}
