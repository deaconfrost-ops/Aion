import { Module } from '@nestjs/common';
import { defineModule, Events, type ModuleManifest } from '@aion/module-kit';
import { InventoryModule } from '../../modules/inventory/inventory.module.js';
import { ProvidersModule } from '../../modules/providers/providers.module.js';
import { MenuService } from './menu.service.js';
import { RecipeService } from './recipe.service.js';
import { OrdersService } from './orders.service.js';

export const restaurantManifest: ModuleManifest = defineModule({
  key: 'restaurant',
  title: 'Restaurant',
  layer: 'niche',
  // Niche → shared only. Composes inventory + providers; resources/crm/hr-payroll/
  // analytics are enabled via the niche profile.
  dependsOn: ['inventory', 'providers', 'resources', 'crm', 'hr-payroll', 'analytics'],
  entitlement: 'niche.restaurant',
  permissions: [
    { key: 'restaurant:menu:read', description: 'View menu', defaultRoles: ['owner', 'manager', 'employee'] },
    { key: 'restaurant:menu:write', description: 'Manage menu & recipes', defaultRoles: ['owner', 'manager'] },
    { key: 'restaurant:order:write', description: 'Take/close orders', defaultRoles: ['owner', 'manager', 'employee'] },
  ],
  navigation: [
    { key: 'menu', label: 'Menu', href: '/menu', requires: 'restaurant:menu:read' },
    { key: 'orders', label: 'Orders', href: '/orders', requires: 'restaurant:order:write' },
  ],
  widgets: [{ key: 'food-cost', title: 'Food cost %', component: 'restaurant.FoodCost' }],
  events: {
    // The niche emits the sale; inventory + providers react. Restaurant never
    // touches stock or suppliers directly — it just announces what was sold.
    emits: [Events.SaleCompleted],
    consumes: [],
  },
});

/**
 * NICHE/restaurant — the reference niche. Adds ONLY restaurant-specific domain
 * logic on top of shared modules:
 *   • MenuItems and Recipes (Bill of Materials) referencing `inventory` Items
 *   • plate-cost rollup from inventory unit costs
 *   • order types (dine-in / takeout / delivery)
 *   • emits `sale.completed` → inventory auto-decrements → providers auto-drafts PO
 *
 * Ingredients live here (and are reused by food-broker), NOT in a shared module.
 */
@Module({
  imports: [InventoryModule, ProvidersModule],
  providers: [MenuService, RecipeService, OrdersService],
  exports: [MenuService, RecipeService, OrdersService],
})
export class RestaurantModule {}
