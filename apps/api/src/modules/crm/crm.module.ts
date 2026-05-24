import { Module } from '@nestjs/common';
import { defineModule, type ModuleManifest } from '@aion/module-kit';

export const crmManifest: ModuleManifest = defineModule({
  key: 'crm',
  title: 'CRM',
  layer: 'shared',
  dependsOn: [],
  entitlement: 'module.crm',
  permissions: [
    { key: 'crm:customer:read', description: 'View customers', defaultRoles: ['owner', 'manager', 'employee'] },
    { key: 'crm:customer:write', description: 'Manage customers', defaultRoles: ['owner', 'manager'] },
  ],
  navigation: [{ key: 'customers', label: 'Customers', href: '/customers', requires: 'crm:customer:read' }],
  widgets: [{ key: 'new-leads', title: 'New leads', component: 'crm.NewLeads' }],
});

/**
 * SHARED/crm — customers, notes, booking/spending history, tags, lead pipeline,
 * segmentation. Available to every niche. AI-generated insights are produced by
 * `core/ai` consuming CRM data, not by CRM itself.
 */
@Module({})
export class CrmModule {}
