import { Module } from '@nestjs/common';
import { defineModule, type ModuleManifest } from '@aion/module-kit';

export const salonManifest: ModuleManifest = defineModule({
  key: 'salon',
  title: 'Salon / Hairdresser',
  layer: 'niche',
  dependsOn: ['resources', 'scheduling', 'crm', 'hr-payroll', 'reviews', 'analytics'],
  entitlement: 'niche.salon',
  permissions: [
    { key: 'salon:service:write', description: 'Manage service menu', defaultRoles: ['owner', 'manager'] },
    { key: 'salon:chair:assign', description: 'Assign stylists to chairs', defaultRoles: ['owner', 'manager'] },
  ],
  navigation: [{ key: 'chairs', label: 'Chairs', href: '/chairs', requires: 'salon:chair:assign' }],
});

/**
 * NICHE/salon — the planned second niche, proving reuse. Adds ONLY:
 *   • chair/station assignment (a "chair" is a `resources` Resource of type station)
 *   • stylist rota (built on `hr-payroll` schedules)
 *   • service menu
 * Everything else (booking, customers, reviews, payroll) is shared modules,
 * enabled via the niche profile — no inventory/restaurant code involved.
 */
@Module({})
export class SalonModule {}
