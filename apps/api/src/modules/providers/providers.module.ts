import { Module } from '@nestjs/common';
import { defineModule, Events, type ModuleManifest } from '@aion/module-kit';
import { ProvidersService } from './providers.service.js';

export const providersManifest: ModuleManifest = defineModule({
  key: 'providers',
  title: 'Providers & Purchasing',
  layer: 'shared',
  dependsOn: ['inventory'], // a purchase order restocks inventory items
  entitlement: 'module.providers',
  permissions: [
    { key: 'providers:supplier:read', description: 'View suppliers', defaultRoles: ['owner', 'manager', 'employee'] },
    { key: 'providers:supplier:write', description: 'Manage suppliers', defaultRoles: ['owner', 'manager'] },
    { key: 'providers:po:write', description: 'Create/approve purchase orders', defaultRoles: ['owner', 'manager'] },
  ],
  navigation: [{ key: 'providers', label: 'Providers', href: '/providers', requires: 'providers:supplier:read' }],
  widgets: [{ key: 'open-pos', title: 'Open purchase orders', component: 'providers.OpenPOs', requires: 'providers:po:write' }],
  events: {
    emits: [Events.PurchaseOrderDrafted, Events.PurchaseOrderReceived],
    consumes: [Events.StockLow],
  },
});

/**
 * SHARED/providers — suppliers/vendors, item↔provider links (who supplies what,
 * at what price/lead time), purchase orders and receiving. Generic on purpose:
 * a restaurant uses it for ingredients, a workshop for tools & equipment — same
 * machinery, no domain assumptions. Depends on `inventory` for the items it buys.
 */
@Module({
  providers: [ProvidersService],
  exports: [ProvidersService],
})
export class ProvidersModule {}
