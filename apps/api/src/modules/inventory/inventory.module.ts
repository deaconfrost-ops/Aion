import { Module } from '@nestjs/common';
import { defineModule, Events, type ModuleManifest } from '@aion/module-kit';
import { InventoryService } from './inventory.service.js';

export const inventoryManifest: ModuleManifest = defineModule({
  key: 'inventory',
  title: 'Inventory',
  layer: 'shared',
  dependsOn: [],
  entitlement: 'module.inventory',
  permissions: [
    { key: 'inventory:item:read', description: 'View items', defaultRoles: ['owner', 'manager', 'employee'] },
    { key: 'inventory:item:write', description: 'Create/edit items', defaultRoles: ['owner', 'manager'] },
    { key: 'inventory:stock:adjust', description: 'Adjust stock', defaultRoles: ['owner', 'manager'] },
  ],
  navigation: [{ key: 'inventory', label: 'Inventory', href: '/inventory', requires: 'inventory:item:read' }],
  widgets: [{ key: 'low-stock', title: 'Low stock', component: 'inventory.LowStock', requires: 'inventory:item:read' }],
  events: {
    // Decrements stock when a sale happens; warns when an item crosses its reorder point.
    emits: [Events.StockMoved, Events.StockLow],
    consumes: [Events.SaleCompleted, Events.PurchaseOrderReceived],
  },
});

/**
 * SHARED/inventory — industry-agnostic stock: Items (with unit + unit cost),
 * stock levels, reorder points, and stock moves. Reused by restaurant, clinic,
 * cleaning, food-broker and any future retail niche — it knows nothing about
 * recipes or appointments.
 */
@Module({
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
